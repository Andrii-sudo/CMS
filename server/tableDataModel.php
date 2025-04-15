<?php
class TableDataModel
{
    private $rowOnPage = 6;
    private $id;

    private $data;

    public function __construct()
    {
        if (file_exists("students.json"))
        {
            $json = file_get_contents("students.json");
            $decoded = json_decode($json, true);
            
            $this->data = $decoded["students"];
            $this->id = $decoded["lastId"];
        }
        else
        {
            $this->data = [];
            $this->id = 0;
        }
    }

    private function saveStudents()
    {
        $save = 
        [
            "lastId" => $this->id,
            "students" => $this->data
        ];

        file_put_contents("students.json", json_encode($save));
    }

    public function getRows($page)
    {
        $start = ($page - 1) * $this->rowOnPage; 
        return array_slice($this->data, $start, $this->rowOnPage);
    }

    public function getTotalPages()
    {
        return ceil(count($this->data) / $this->rowOnPage);
    }

    public function addStudent($student)
    {
        $student["id"] = (string)($this->id++);
        array_push($this->data, $student);
        $this->saveStudents();
    }

    public function editStudent($student)
    {
        $id = $student["id"];
        for ($i = 0; $i < count($this->data); $i++)
        {
            if (isset($this->data[$i]) && $this->data[$i]["id"] == $id)
            {
                $this->data[$i]["group"]     = $student["group"];
                $this->data[$i]["firstName"] = $student["firstName"];
                $this->data[$i]["lastName"]  = $student["lastName"];
                $this->data[$i]["gender"]    = $student["gender"];     
                $this->data[$i]["birthday"]  = $student["birthday"];
                break;
            }
        }
        $this->saveStudents();
    }

    public function delStudent($id)
    {
        for ($i = 0; $i < count($this->data); $i++)
        {
            if (isset($this->data[$i]) && $this->data[$i]["id"] == $id)
            {
                unset($this->data[$i]);
                $this->data = array_values($this->data);
                $this->saveStudents();
                return true;
            }
        }
        return false;
    }

    public function validateStudent($student)
    {
        $res = 
        [
            "success" => true,
            "isGroupValid" => true,
            "isFirstNameValid" => true,
            "isLastNameValid" => true,
            "isGenderValid" => true,
            "isBirthdayValid" => true,
            "isDuplicate" => false
        ];

        if (empty($student["group"])) 
        {
            $res["success"] = false;
            $res["isGroupValid"] = false;
        }

        if (!preg_match("/^[A-Z][a-z\`\-]{0,19}$/", $student["firstName"] ?? ""))
        {
            $res["success"] = false;
            $res["isFirstNameValid"] = false;
        }

        if (!preg_match("/^[A-Z][a-z\`\-]{0,24}$/", $student["lastName"] ?? ""))
        {
            $res["success"] = false;
            $res["isLastNameValid"] = false;
        }

        if (empty($student["gender"])) 
        {
            $res["success"] = false;
            $res["isGenderValid"] = false;
        }

        $bd = strtotime($student["birthday"] ?? "");
        if (!$bd || $bd < strtotime("1900-01-01") || $bd > strtotime("2010-01-01")) 
        {
            $res["success"] = false;
            $res["isBirthdayValid"] = false;
        }
        
        if($this->isDuplicate($student))
        {
            $res["success"] = false;
            $res["isDuplicate"] = true;
        }

        return $res;
    }

    public function isDuplicate($student)
    {
        foreach ($this->data as $existingStudent) 
        {
            if (
                $existingStudent["firstName"] === $student["firstName"] &&
                $existingStudent["lastName"] === $student["lastName"] &&
                $existingStudent["birthday"] === $student["birthday"]) 
            {
                return true;
            }
        }
        return false;
    }
}
?>