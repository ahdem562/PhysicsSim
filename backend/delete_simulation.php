<?php
// delete a saved simulation for the logged-in user

session_start();
header("Content-Type: application/json");
require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Not logged in"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;

if (!$id) {
    echo json_encode([
        "success" => false,
        "message" => "Simulation id is required"
    ]);
    exit;
}

$stmt = $pdo->prepare(
    "DELETE FROM simulations WHERE id = ? AND user_id = ?"
);

$stmt->execute([$id, $_SESSION["user_id"]]);

echo json_encode([
    "success" => true,
    "message" => "Simulation deleted"
]);
?>