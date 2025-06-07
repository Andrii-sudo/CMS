let currentUser = null;
window.currentChatId = null;
let allChats = {};
let socket = null;
let onlineUsers = new Set();

document.addEventListener("DOMContentLoaded", checkAuthentication);

function checkAuthentication()
{
    return fetch("server/index.php?action=checkAuth")
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

document.getElementById("add-new-chat").addEventListener("click", () => 
{
    document.getElementById("new-chat-modal").style.display = "block";
});

document.getElementById("close-new-chat-modal").addEventListener("click", () => 
{
    document.getElementById("new-chat-modal").style.display = "none";
});

document.getElementById("cancel-new-chat").addEventListener("click", () => 
{
    document.getElementById("new-chat-modal").style.display = "none";
});

function showUserNotFoundPopup(username) 
{
    alert(`Користувача "${username}" не знайдено!`);
}

document.getElementById("new-chat-form").addEventListener("submit", function (e) 
{
    e.preventDefault();

    const username = document.getElementById("user-search").value.trim();
    const roomName = document.getElementById("chat-room-name").value.trim();
    if (!username || !roomName) return;

    fetch("server/index.php?action=checkUserExists", 
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    })
    .then(res => res.json())
    .then(data => 
    {
        if (!data.exists) 
        {
            showUserNotFoundPopup(username);
        } else {
            fetch("http://192.168.205.159:3000/api/createChat", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                {
                    name: roomName,
                    participants: [currentUser, username]
                })
            })
            .then(res => res.json())
            .then(chat => 
            {
                console.log("Чат створено:", chat);
                window.location.href = `messages.html?chatId=${chat._id}`;
            })
            .catch(err => console.error("Помилка створення чату:", err));
        }
    })
    .catch(() => showUserNotFoundPopup(username));
});

function renderChatMembers(chat) 
{
    const membersContainer = document.querySelector(".members-container");
    membersContainer.innerHTML = "";

    chat.participants.forEach(participant => 
    {
        const img = document.createElement("img");
        img.className = `member-avatar ${onlineUsers.has(participant) ? 'online' : 'offline'}`;
        img.src = participant === currentUser ? "images/myPhoto.webp" : "images/userPhoto.webp";
        img.alt = "user photo";
        img.title = participant;
        membersContainer.appendChild(img);
    });

    const addBtn = document.createElement("button");
    addBtn.id = "add-member";
    addBtn.textContent = "+";
    membersContainer.appendChild(addBtn);
}

document.addEventListener("DOMContentLoaded", () => 
{
    checkAuthentication().then(() => 
    {
        if (currentUser) 
        {
            setupChatHandlers(initializeSocket(currentUser));
        }
    });
});

function initializeSocket(username) 
{
    if (!socket) 
    {
        socket = io("http://192.168.205.159:3000");
        socket.emit("registerUser", username);
    }
    return socket;
}

function setupChatHandlers(socket) 
{
    socket.emit("getUserChats", currentUser);

    socket.on("userChats", (chats) => 
    {
        allChats = {};
        chats.forEach(chat => 
        {
            allChats[chat._id] = chat;
        });
        renderChats(chats);

        const urlParams = new URLSearchParams(window.location.search);
        const chatId = urlParams.get('chatId');
        if (chatId && allChats[chatId]) 
        {
            window.currentChatId = chatId;
            socket.emit("joinChat", chatId);
            renderMessages(allChats[chatId].messages || []);
            renderChatMembers(allChats[chatId]);
            document.querySelector("#chat-room h4").textContent = `Chat room ${allChats[chatId].name}`;
        }
    });

    socket.on("newMessage", ({ chatId, message }) => 
    {
        if (!allChats[chatId]) 
        {
            socket.emit("getUserChats", currentUser);
            return;
        }

        if (!allChats[chatId].messages) 
        {
            allChats[chatId].messages = [];
        }

        allChats[chatId].messages.push(message);

        if (chatId === window.currentChatId) 
        {
            const container = document.getElementById("messages-container");
            container.appendChild(buildMessageElement(message));
            container.scrollTop = container.scrollHeight;
        }
    });

    socket.on("userStatusChange", ({ username, status }) => 
    {
        if (status === "online") 
        {
            onlineUsers.add(username);
        } 
        else 
        {
            onlineUsers.delete(username);
        }
        updateUsersStatus();
    });

    socket.on("disconnect", () => 
    {
        console.log("Відключено від сервера");
        setTimeout(() => 
        {
            socket.connect();
        }, 1000);
    });
}

function updateUsersStatus() 
{
    document.querySelectorAll('.message').forEach(msg => 
    {
        const avatar = msg.querySelector('.avatar');
        const username = msg.querySelector('.sender-name').textContent;
        const actualUsername = username === 'Me' ? currentUser : username;
        
        avatar.classList.remove('online', 'offline');
        avatar.classList.add(onlineUsers.has(actualUsername) ? 'online' : 'offline');
    });

    document.querySelectorAll('.member-avatar').forEach(avatar => 
    {
        const username = avatar.title;
        avatar.classList.remove('online', 'offline');
        avatar.classList.add(onlineUsers.has(username) ? 'online' : 'offline');
    });
}

function renderChats(chats) 
{
    const container = document.getElementById("chat-room-buttons-container");
    container.innerHTML = "";

    chats.forEach(chat => 
    {
        const btn = document.createElement("div");
        btn.className = "chat-room-button";
        if (chat._id === window.currentChatId) 
        {
            btn.classList.add("selected");
        }
        btn.textContent = chat.name || chat.participants.filter(p => p !== currentUser).join(", ");
        btn.addEventListener("click", () => 
        {
            document.querySelectorAll(".chat-room-button").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            
            window.currentChatId = chat._id;
            socket.emit("joinChat", window.currentChatId);
            if (allChats[window.currentChatId]) 
            {
                renderMessages(allChats[window.currentChatId].messages || []);
                renderChatMembers(allChats[window.currentChatId]);
                document.querySelector("#chat-room h4").textContent = `Chat room ${allChats[window.currentChatId].name}`;
            }
        });
        container.appendChild(btn);
    });
}

function renderMessages(messages) 
{
    const container = document.getElementById("messages-container");
    container.innerHTML = "";

    messages.forEach(msg => 
    {
        container.appendChild(buildMessageElement(msg));
    });

    container.scrollTop = container.scrollHeight;
}

function buildMessageElement(msg) 
{
    const wrapper = document.createElement("div");
    wrapper.className = msg.sender === currentUser ? "message outgoing" : "message incoming";

    const avatar = document.createElement("img");
    avatar.className = `avatar ${onlineUsers.has(msg.sender) ? 'online' : 'offline'}`;
    avatar.src = msg.sender === currentUser ? "images/myPhoto.webp" : "images/userPhoto.webp";
    avatar.alt = "user photo";
    avatar.title = msg.sender;  // Add title attribute

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = msg.text;

    const name = document.createElement("span");
    name.className = "sender-name";
    name.textContent = msg.sender === currentUser ? "Me" : msg.sender;

    if (msg.sender === currentUser) 
    {
        wrapper.appendChild(bubble);
        wrapper.appendChild(avatar);
    } 
    else 
    {
        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
    }

    wrapper.appendChild(name);
    return wrapper;
}


const input = document.querySelector("#chat-room .message-input input");
const sendBtn = document.querySelector("#chat-room .message-input button");

sendBtn.addEventListener("click", () => 
{
    sendMessage();
});

input.addEventListener("keydown", (e) => 
{
    if (e.key === "Enter") 
    {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() 
{
    const text = input.value.trim();
    if (!text || !window.currentChatId || !socket) return;

    socket.emit("sendMessage", 
    {
        chatId: window.currentChatId,
        sender: currentUser,
        text
    });

    input.value = "";
}

document.addEventListener("click", function (e) 
{
    if (e.target && e.target.id === "add-member") 
    {
        document.getElementById("add-member-modal").style.display = "block";
    }
});

document.getElementById("close-add-member-modal").addEventListener("click", () => 
{
    document.getElementById("add-member-modal").style.display = "none";
});

document.getElementById("cancel-add-member").addEventListener("click", () => 
{
    document.getElementById("add-member-modal").style.display = "none";
});

document.getElementById("confirm-add-member").addEventListener("click", async () => 
{
    const username = document.getElementById("add-member-username").value.trim();
    if (!username || !currentChatId) return;

    const existsRes = await fetch("server/index.php?action=checkUserExists", 
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    });
    const existsData = await existsRes.json();

    if (!existsData.exists) 
    {
        showUserNotFoundPopup(username);
        return;
    }

    const res = await fetch(`http://192.168.205.159:3000/api/addMember`, 
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: currentChatId, username })
    });

    const result = await res.json();

    if (result.success) 
    {
        alert(`Користувача "${username}" додано до чату.`);
        socket.emit("getUserChats", currentUser);
        document.getElementById("add-member-modal").style.display = "none";
    } 
    else 
    {
        alert("Помилка додавання користувача: " + result.error);
    }
});
