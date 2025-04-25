<?php
$db_server = "localhost";
$db_user   = "root";
$db_pass   = "";
$db_name   = "pidb";

$conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

if (!$conn) 
{
    die("Помилка підключення: " . mysqli_connect_error());
}
?>