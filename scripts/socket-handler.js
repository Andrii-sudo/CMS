let socket = null;

function initializeSocket(username) 
{
    if (!socket) 
    {
        socket = io("http://192.168.205.159:3000");

        socket.on("connect", () => 
        {
            socket.emit("registerUser", username);
        });

        socket.on("newMessage", ({ chatId, message, chatName }) => 
        {
            if (message.sender !== username) 
            {
                const isMessagesPage = window.location.pathname.endsWith("messages.html");
                const isChatOpen = window.currentChatId === chatId;

                if (!isMessagesPage || (isMessagesPage && !isChatOpen)) 
                {
                    triggerBellAnimation();
                    addNotification(
                    {
                        ...message,
                        chatName
                    });
                }
            }
        });

        socket.on("disconnect", () => 
        {
            setTimeout(() => socket.connect(), 1000);
        });
    }
    return socket;
}

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
