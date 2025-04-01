const strPath = location.pathname;
const lsNav = document.querySelectorAll("#navbar-list li a");

if (strPath.includes('/dashboard'))
{
    lsNav[0].style.color = "#3b82f6";
}
else if (strPath.includes('/students'))
{
    lsNav[1].style.color = "#3b82f6";
}
else if (strPath.includes('/tasks'))
{
    lsNav[2].style.color = "#3b82f6";
}

document.getElementById("burger-menu-show").addEventListener("click", btnBurgerMenuShowClicked);

let isNavShowed = false;
function btnBurgerMenuShowClicked()
{
    if (isNavShowed)
    {
        document.querySelector("nav").style.display = "none";
    }
    else
    {
        document.querySelector("nav").style.display = "block";
    }
    isNavShowed = !isNavShowed;
}
