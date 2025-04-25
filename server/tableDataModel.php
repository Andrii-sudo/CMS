<?php
class TableDataModel
{
    private $rowOnPage = 6;
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function getRows($page)
    {
        $start = ($page - 1) * $this->rowOnPage; 

        $stmt = $this->conn->prepare("SELECT * FROM students2 LIMIT ? OFFSET ?");
        $stmt->bind_param("ii", $this->rowOnPage, $start);
        $stmt->execute();
        
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getTotalPages()
    {
        $query = "SELECT COUNT(*) as total FROM students2";
        $result = $this->conn->query($query);

        return ceil($result->fetch_assoc()["total"] / $this->rowOnPage);
    }

    public function addStudent($student)
    {
        $stmt = $this->conn->prepare("INSERT INTO `students2` (`group`, `firstName`, `lastName`, `gender`, `birthday`) 
                                       VALUES (?, ?, ?, ?, ?)");
        
        $stmt->bind_param(
            "sssss", 
            $student["group"], 
            $student["firstName"], 
            $student["lastName"], 
            $student["gender"], 
            $student["birthday"]);

        $stmt->execute();
    }

    public function editStudent($student)
    {
        $stmt = $this->conn->prepare("UPDATE `students2` SET `group` = ?, `firstName` = ?, `lastName` = ?, `gender` = ?, `birthday` = ? WHERE `id` = ?");
        $stmt->bind_param(
            "ssssss",
            $student["group"],
            $student["firstName"],  
            $student["lastName"],
            $student["gender"],
            $student["birthday"],
            $student["id"]);

        $stmt->execute();    
    }

    public function delStudent($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM `students2` WHERE `id` = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) 
        {
            return true;
        }
        else
        {
            return false;
        }
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
        $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM students2 WHERE firstName = ? AND lastName = ? AND birthday = ?");
        $stmt->bind_param("sss", $student["firstName"], $student["lastName"], $student["birthday"]);
        $stmt->execute();

        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) 
        {
            return $row["total"] > 0;
        }

        return false;
    }
}
?>