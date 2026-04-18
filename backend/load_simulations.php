<?php
// load saved simulations for logged-in user

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

$stmt = $pdo->prepare(
    "SELECT id, sim_name, particle_data_json, created_at
     FROM simulations
     WHERE user_id = ?
     ORDER BY created_at DESC"
);

$stmt->execute([$_SESSION["user_id"]]);

$simulations = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "simulations" => $simulations
]);
?>