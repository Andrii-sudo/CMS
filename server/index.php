<?php
require_once "loginController.php";
require_once "tableDataController.php";

$action = isset($_GET["action"]) ? $_GET["action"] : null;

$loginController = new LoginController();
$tableDataController = new TableDataController();

switch ($action)
{
    case "login":
        if ($_SERVER["REQUEST_METHOD"] === "POST")
        {
            $login = $_POST["login"];
            $password = $_POST["password"];
            
            $loginController->login($login, $password);
        }
        break;

    case "logout":
        $loginController->logout();
        break;
    
    case "checkAuth":
        $loginController->checkAuth();
        break;        

    case "pagination":
        $tableDataController->sendPage();
        break;

    case "addStudent":
        if ($_SERVER["REQUEST_METHOD"] === "POST") 
        {
            $data = json_decode(file_get_contents("php://input"), true);
            $tableDataController->addStudent($data);
        }
        break;

    case "editStudent":
        if ($_SERVER["REQUEST_METHOD"] === "POST") 
        {
            $data = json_decode(file_get_contents("php://input"), true);
            $tableDataController->editStudent($data);
        }
        break;
        
    case "delStudents":
        if ($_SERVER["REQUEST_METHOD"] === "POST") 
        {
            $data = json_decode(file_get_contents("php://input"), true);
            $tableDataController->delStudents($data["ids"]);
        }
        break;
}

?>