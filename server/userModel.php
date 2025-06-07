<?php
class UserModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function checkUser($login, $password)
    {
        $stmt = $this->conn->prepare("SELECT * FROM students2 WHERE CONCAT(firstName, ' ', lastName) = ? AND birthday = ?");
        $stmt->bind_param("ss", $login, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($user = $result->fetch_assoc())
        {
            return $user["firstName"] . " " . $user["lastName"];
        }
                
        return "";
    }

    public function userExistsByName($username)
    {
        $stmt = $this->conn->prepare("SELECT COUNT(*) as cnt FROM students2 WHERE CONCAT(firstName, ' ', lastName) = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result && $row = $result->fetch_assoc())
        {
            return intval($row["cnt"]) > 0;
        }
        return false;
    }
}
?>