<?php 
//check if user is logged in
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => true,
        "logged_in" => true,
        "user" => [
            "id" => $_SESSION["user_id"],
            "email" => $_SESSION["email"]
        ]
    ]);
} else {
    echo json_encode([
        "success" => true,
        "logged_in" => false
    ]);
}
?>