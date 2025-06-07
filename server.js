const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const server = http.createServer(app);
const io = new Server(server, 
{
    cors: 
    {
        origin: "*"
    }
});

const onlineUsers = new Set();
const unreadMessages = new Map(); 

const PORT = 3000;
const uri = "mongodb+srv://kitykandry:hT8XBc78942Dx69W@cluster0.upa9poy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
let db;

app.use(cors());
app.use(express.json());

client.connect().then(() => 
{
    db = client.db("chatApp");
    console.log("Підключено до MongoDB");
}).catch(console.error);

app.post("/api/createChat", async (req, res) => 
{
    const { name, participants } = req.body;
    if (!participants || participants.length < 2 || !name) 
    {
        return res.status(400).json({ error: "Потрібна назва та мінімум 2 учасники" });
    }

    try 
    {
        const chat = 
        {
            name,
            participants,
            messages: [],
            createdAt: new Date()
        };
        const result = await db.collection("chats").insertOne(chat);
        res.json({ _id: result.insertedId, ...chat });
    } 
    catch (err) 
    {
        res.status(500).json({ error: "Помилка при створенні чату" });
    }
});

io.on("connection", (socket) => 
{
    console.log("Користувач підключився:", socket.id);

    socket.on("registerUser", async (username) => 
    {
        socket.username = username;
        socket.join(username);
        onlineUsers.add(username);
        io.emit("userStatusChange", { username, status: "online" });

        try 
        {
            const unreadMessages = await db.collection("unreadMessages")
                .find({ recipient: username })
                .toArray();

            if (unreadMessages.length > 0) 
            {
                socket.emit("offlineMessages", unreadMessages);
                await db.collection("unreadMessages").deleteMany({ recipient: username });
            }
        } catch (err) {
            console.error("Error checking unread messages:", err);
        }
    });

    socket.on("sendMessage", async ({ chatId, sender, text }) => 
    {
        const message = 
        {
            sender,
            text,
            timestamp: new Date()
        };

        try 
        {
            await db.collection("chats").updateOne(
                { _id: new ObjectId(chatId) },
                { $push: { messages: message } }
            );

            const chat = await db.collection("chats").findOne({ _id: new ObjectId(chatId) });
            
            for (const participant of chat.participants) 
            {
                if (onlineUsers.has(participant)) 
                {
                    io.to(participant).emit("newMessage", 
                    {
                        chatId,
                        message,
                        chatName: chat.name
                    });
                } else if (participant !== sender) 
                {
                    await db.collection("unreadMessages").insertOne(
                    {
                        recipient: participant,
                        chatId,
                        message,
                        chatName: chat.name
                    });
                }
            }
        } 
        catch (err) 
        {
            console.error("Помилка при надсиланні повідомлення:", err);
        }
    });

    socket.on("getUserChats", async (username) => 
    {
        try 
        {
            const chats = await db.collection("chats").find(
            {
                participants: username
            }).toArray();
            socket.emit("userChats", chats);
        } 
        catch (err) 
        {
            socket.emit("userChats", []);
        }
    });

    socket.on("joinChat", (chatId) => 
    {
        socket.join(chatId);
        console.log(`Сокет ${socket.id} приєднався до чату ${chatId}`);
    });

    socket.on("getUnreadMessages", (username) => 
    {
        if (unreadMessages.has(username)) 
        {
            socket.emit("unreadMessages", unreadMessages.get(username));
            unreadMessages.delete(username);
        }
    });

    socket.on("markMessagesAsRead", (chatId) => 
    {
        if (socket.username && unreadMessages[socket.username]) 
        {
            unreadMessages[socket.username] = unreadMessages[socket.username].filter(
                msg => msg.chatId !== chatId
            );
        }
    });

    socket.on("disconnect", () => 
    {
        if (socket.username) 
        {
            onlineUsers.delete(socket.username);
            io.emit("userStatusChange", { username: socket.username, status: "offline" });
        }
        console.log("Користувач відключився:", socket.id);
    });
});

app.post("/api/addMember", async (req, res) => {
    const { chatId, username } = req.body;

    if (!chatId || !username) 
    {
        return res.status(400).json({ error: "Неправильні дані" });
    }

    try 
    {
        const chat = await db.collection("chats").findOne({ _id: new ObjectId(chatId) });
        if (!chat) return res.status(404).json({ error: "Чат не знайдено" });

        if (chat.participants.includes(username)) 
        {
            return res.status(400).json({ error: "Користувач уже в чаті" });
        }

        await db.collection("chats").updateOne(
            { _id: new ObjectId(chatId) },
            { $push: { participants: username } }
        );

        io.sockets.sockets.forEach((s) => 
        {
            if (s.username === username) 
            {
                s.emit("addedToChat", 
                {
                    _id: chatId,
                    name: chat.name,
                    participants: [...chat.participants, username],
                    messages: chat.messages || []
                });
            }
        });
        res.json({ success: true });
    } 
    catch (err) 
    {
        console.error("Помилка додавання учасника:", err);
        res.status(500).json({ error: "Серверна помилка" });
    }
});


server.listen(PORT, () => 
{
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
