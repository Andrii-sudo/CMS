document.getElementById("notify-icon").addEventListener("mouseover", showNotifyIndicator);

function showNotifyIndicator()
{
    setTimeout(function ()
    {
        document.getElementById("notify-indicator").style.opacity = "1";
    }, 2200);
}