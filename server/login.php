<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $login = $_POST['login'];
    $password = $_POST['password'];

    require_once 'loginController.php';
    $loginController = new LoginController();
    $loginController->login($login, $password);
}
?>