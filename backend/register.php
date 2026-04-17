<?php
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

// check user input before account creation
if ($email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);
    exit;
}

// check if email already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->fetch()) {
    echo json_encode([
        "success" => false,
        "message" => "Email already registered"
    ]);
    exit;
}

// hash password before storing for security
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// add new user to database
$stmt = $pdo->prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
$stmt->execute([$email, $passwordHash]);

echo json_encode([
    "success" => true,
    "message" => "User registered successfully"
]);
?>