const strPath = location.pathname;
const lsNav = document.querySelectorAll("#navbar-list li a");

if (strPath[6] === 'd')
{
    lsNav[0].style.color = "#3b82f6";
}
else if (strPath[6] === 's')
{
    lsNav[1].style.color = "#3b82f6";
}
else if (strPath[6] === 't')
{
    lsNav[2].style.color = "#3b82f6";
}