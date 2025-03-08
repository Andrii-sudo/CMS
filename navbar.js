const strPath = location.pathname;
const lsNav = document.querySelectorAll("#navbar-list li a");
if (strPath[6] === 'd')
{
    lsNav[0].style.fontWeight = "bold";
}
else if (strPath[6] === 's')
{
    lsNav[1].style.fontWeight = "bold";
}
else if (strPath[6] === 't')
{
    lsNav[2].style.fontWeight = "bold";
}