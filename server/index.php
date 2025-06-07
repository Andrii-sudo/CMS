<?php
require_once "loginController.php";
require_once "tableDataController.php";
require_once "db.php";

$action = isset($_GET["action"]) ? $_GET["action"] : null;

$loginController = new LoginController($conn);
$tableDataController = new TableDataController($conn);

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

    case "checkUserExists":
        if ($_SERVER["REQUEST_METHOD"] === "POST") 
        {
            header("Content-Type: application/json");
            $data = json_decode(file_get_contents("php://input"), true);
            $username = $data["username"];
            require_once "userModel.php";
            $userModel = new UserModel($conn);
            $exists = $userModel->userExistsByName($username);
            echo json_encode(["exists" => $exists]);
        }
        break;
}

mysqli_close($conn);
?>