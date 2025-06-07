function addNotification(message) 
{
    const container = document.querySelector(".dropdown-notify-content");
    const item = document.createElement("div");
    item.className = "dropdown-notify-item";
    
    item.innerHTML = `
        <div class="notify-user-info">
            <img src="images/userPhoto.webp" alt="user photo" class="user-photo">
            <p class="notify-user-name">${message.sender}</p>
        </div>
        <p class="dropdown-notify-message">
            ${message.chatName ? `[${message.chatName}] ` : ''}${message.text}
        </p>
    `;

    if (container.firstChild) 
    {
        container.insertBefore(item, container.firstChild);
    } 
    else 
    {
        container.appendChild(item);
    }

    while (container.children.length > 3) 
    {
        container.removeChild(container.lastChild);
    }

    document.getElementById("notify-indicator").style.opacity = "1";
}

function triggerBellAnimation() 
{
    const bell = document.getElementById("notify-icon");
    const indicator = document.getElementById("notify-indicator");

    bell.classList.add("bell-animate");
    indicator.style.opacity = "1";

    setTimeout(() => 
    {
        bell.classList.remove("bell-animate");
    }, 2000);
}

let notificationSocket = window.socket;

document.addEventListener("DOMContentLoaded", () => {
    fetch("server/index.php?action=checkAuth")
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                initializeNotifications(data.username);
            }
        })
        .catch(error => {
            console.error("Failed to check authentication:", error);
        });
});

function initializeNotifications(username) {
    if (!notificationSocket) {
        notificationSocket = io("http://192.168.205.159:3000");
        notificationSocket.emit("registerUser", username);
        window.socket = notificationSocket;
    }

    notificationSocket.on("offlineMessages", (messages) => {
        messages.forEach(({message, chatName}) => {
            addNotification({...message, chatName});
            triggerBellAnimation();
        });
    });

    notificationSocket.on("newMessage", ({ chatId, message, chatName }) => {
        const isMessagesPage = window.location.pathname.endsWith("messages.html");
        const isChatOpen = window.currentChatId === chatId;
        
        if ((!isMessagesPage || !isChatOpen) && message.sender !== username) {
            addNotification({...message, chatName});
            triggerBellAnimation();
        }
    });
}
