<?php
require_once "userModel.php";

class LoginController
{
    private $model;

    public function __construct($conn)
    {
        $this->model = new UserModel($conn);
    }

    public function login($login, $password)
    {
        $user = $this->model->checkUser($login, $password);
        session_start();
        if ($user !== "")
        {
            $_SESSION["user"] = $user;
        }
        else
        {
            $_SESSION["error"] = "1";
        }
        header("Location: ../students.html");
        exit;
    }

    public function logout()
    {
        session_start();
        session_unset();
        session_destroy();

        header("Location: ../students.html");
        exit;
    }

    public function checkAuth()
    {
        session_start();
        header("Content-Type: application/json");

        $response = 
        [
            "isAuthenticated" => isset($_SESSION["user"]),
            "username" => isset($_SESSION["user"]) ? $_SESSION["user"] : null,
            "error" => isset($_SESSION["error"]) ? $_SESSION["error"] : null
        ];

        echo json_encode($response);
    }
}
?>