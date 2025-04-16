<?php
class UserModel
{
    private $users =
    [
        ["login" => "Andrii Kityk", "password" => "05.12.2005"],
        ["login" => "John Doe",     "password" => "01.01.2000"]
    ];

    public function checkUser($login, $password)
    {
        foreach ($this->users as $user)
        {
            if ($user["login"] === $login && $user["password"] === $password)
            {
                return $user["login"];
            }
        }
        return "";
    }
}
?>