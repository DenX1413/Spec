<?php
/**
 * Приём заявок с сайта СПЕЦТЕХНИК — напрямую с российского хостинга,
 * без стороннего внешнего сервиса (formsubmit.co был недоступен части
 * посетителей без VPN).
 */

header('Content-Type: application/json; charset=utf-8');

// Разрешаем только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Куда присылать заявки
$to = 'SpectehniK-320303@yandex.ru';

// ===== Простая защита от ботов: скрытое honeypot-поле =====
// На случай, если в форму добавят поле name="website" (спамботы часто заполняют все поля подряд).
if (!empty($_POST['website'])) {
    // Молча "успешно" отвечаем боту, ничего не отправляя
    echo json_encode(['success' => true]);
    exit;
}

function clean_field($value) {
    $value = trim((string) $value);
    // Убираем управляющие символы и защищаемся от header injection в теме/полях письма
    $value = str_replace(["\r", "\n"], ' ', $value);
    return $value;
}

$name    = clean_field($_POST['name'] ?? '');
$phone   = clean_field($_POST['phone'] ?? '');
$message = trim((string) ($_POST['message'] ?? ''));

// ===== Серверная валидация (дублирует клиентскую на всякий случай) =====
$errors = [];

if ($name === '' || mb_strlen($name) > 25) {
    $errors[] = 'invalid_name';
}

$phoneDigits = preg_replace('/\D/', '', $phone);
if (mb_strlen($phoneDigits) < 10) {
    $errors[] = 'invalid_phone';
}

if (mb_strlen($message) > 500) {
    $errors[] = 'invalid_message';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// ===== Формируем письмо =====
$subject = '=?UTF-8?B?' . base64_encode('Новая заявка с сайта СПЕЦТЕХНИК') . '?=';

$bodyLines = [
    'Новая заявка с сайта СПЕЦТЕХНИК',
    '',
    'Имя: ' . $name,
    'Телефон: ' . $phone,
    'Сообщение: ' . ($message !== '' ? $message : '—'),
    '',
    'Дата: ' . date('d.m.Y H:i:s'),
];
$body = implode("\n", $bodyLines);

// Адрес "От кого" — почтовый ящик на этом же домене, чтобы письма не улетали в спам
$host = $_SERVER['HTTP_HOST'] ?? 'spetctehnik70.ru';
// Убираем возможный www. и порт из хоста для корректного from-адреса
$domain = preg_replace('/^www\./', '', explode(':', $host)[0]);
$fromAddress = 'noreply@' . $domain;

$headers  = "From: СПЕЦТЕХНИК <{$fromAddress}>\r\n";
$headers .= "Reply-To: {$fromAddress}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "MIME-Version: 1.0\r\n";

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'mail_failed']);
}
