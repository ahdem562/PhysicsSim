<?php

session_start();
header("Content-Type: application/json");
require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["name"] ?? "Untitled";
$simData = json_encode($data["data"] ?? []);

$stmt = $pdo->prepare(
    "INSERT INTO simulations (user_id, sim_name, particle_data_json) VALUES (?, ?, ?)"
);

$stmt->execute([
    $_SESSION["user_id"],
    $name,
    $simData
]);

echo json_encode(["success" => true]);
?>