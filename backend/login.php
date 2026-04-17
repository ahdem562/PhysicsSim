<?php
// handle user login
session_start();
header("Content-Type: application/json");
require_once "db.php";

// get user input from request
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

// check that email and password were entered
if ($email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);
    exit;
}

// find user by email in database
$stmt = $pdo->prepare("SELECT id, email, password_hash FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// check password matches stored hash
if (!$user || !password_verify($password, $user["password_hash"])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password"
    ]);
    exit;
}

// store user info in session after login
$_SESSION["user_id"] = $user["id"];
$_SESSION["email"] = $user["email"];

echo json_encode([
    "success" => true,
    "message" => "Login successful"
]);
?>