<?php
require_once "tableDataModel.php";

class TableDataController
{
    private $model;

    public function __construct($conn)
    {
        $this->model = new TableDataModel($conn);
    }

    public function sendPage()
    {
        $page = isset($_GET["page"]) ? (int)$_GET["page"] : 1;

        session_start();
        header("Content-Type: application/json");

        $response = 
        [
            "rows" => $this->model->getRows($page),
            "totalPages" => $this->model->getTotalPages()
        ];
        echo json_encode($response);
    }

    public function addStudent($student)
    {
        session_start();
        header("Content-Type: application/json");
    
        $response = $this->model->validateStudent($student);

        if ($response["success"] === true)
        {
            $this->model->addStudent($student);
        }

        echo json_encode($response);
    }

    public function editStudent($student)
    {
        session_start();
        header("Content-Type: application/json");
    
        $response = $this->model->validateStudent($student);

        if ($response["success"] === true)
        {
            $this->model->editStudent($student);
        }

        echo json_encode($response);
    }

    public function delStudents($studentsIds)
    {
        session_start();
        header("Content-Type: application/json");
    
        $response = [ "ok" => true ];
        
        foreach ($studentsIds as $id)
        {
            if (!$this->model->delStudent($id))
            {
                $response["ok"] = false;
                break;
            }
        }

        echo json_encode($response);
    }
}
?>