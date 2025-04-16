let currentUser = null;

document.addEventListener("DOMContentLoaded", checkAuthentication);

function checkAuthentication()
{
    fetch("server/index.php?action=checkAuth")
        .then(response => response.json())
        .then(data =>
        {
            if (data.isAuthenticated) 
            {
                currentUser = data.username;

                document.querySelector("header .dropdown-notify").style.display = "inline-block";
                document.querySelector("header .dropdown-profile").style.display = "flex";
                document.querySelector("header .dropdown-profile .user-name").textContent = currentUser;
            }
            else
            {
                window.location.href = "students.html";
            }
        })
        .catch(error => 
        {
            console.error("Authentication check failed:", error);
        });
}