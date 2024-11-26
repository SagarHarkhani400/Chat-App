const express = require('express');
const cors = require('cors');
const conn = require('./connection');
const bcrypt = require('bcrypt');

const app = express();
const http = require('http').Server(app);
const PORT = 4000;

app.use(express.json())

const socketIo = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.1.246:3000"], // Allow both local and mobile network requests
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    }
})

app.use(cors({
    origin: ["http://localhost:3000", "http://192.168.1.246:3000"], // Same origins as above
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));

socketIo.on('connection', (socket) => {
    console.log(`${socket.id} user just connected`);

    // Handle incoming 'message' event and broadcast
    socket.on('message', (data) => {
        const savedMessageId = data.id;
        const fetchMessageQuery = "SELECT * FROM messages WHERE id = ?";
        conn.query(fetchMessageQuery, [savedMessageId], (err, savedMessages) => {
            if (err) {
                console.error("Database error while fetching saved message:", err);
                return;
            }

            // Broadcast the saved message
            const savedMessage = savedMessages[0];
            socketIo.emit('messageResponse', savedMessage);
        });
    })

    // Handle typing indicator and broadcast to others
    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));
    socket.on('stop typing', () => socket.broadcast.emit('stopTypingResponse'));

    // Handle user disconnection
    socket.on('disconnect', async () => {
        console.log(`A user disconnected`);
    });
})

// Handle user registeration
app.post("/register", (req, res) => {
    const { name, email, password, status } = req.body;

    bcrypt.hash(password, 10, (err, hashpassword) => {
        if (err) {
            return res.status(402).status({ message: "Error in hashing password" });
        }
        const sql = "insert into users (name, email, password, status) values (?,?,?,?)";
        conn.query(sql, [name, email, hashpassword, status], (err, result) => {
            if (err) {
                return res.status(500).send({ message: "internal server problem" });
            }
            res.json({ message: "User reguster successfully", result: result });
        });
    });
});

// Handle user login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    const update = "UPDATE users SET status = true where email = ?";
    conn.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(402).send({ message: "Error in hashing password" });
        }

        if (!email && !password) {
            res.json({ message: "Please enter email and password" });
        }

        if (result.length === 0) {
            res.json({ message: "Invalid email or password" });
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, ismatch) => {
            if (err) {
                return res.status(402).send({ message: "Error in hashing password" });
            }

            if (!ismatch) {
                return res.status(401).send({ message: "Invalid email and password" })
            }

            conn.query(update, [email], (err) => {
                if (err) {
                    return res.send({ message: "Internal server error" });
                }
            })
            res.json({ message: "Login Successfully", user: user })
        })
    })
})

// Handle users insert message
app.post('/messages', (req, res) => {
    const { message, sender_id, receiver_id, time } = req.body;

    sql = "INSERT INTO messages (message, sender_id, receiver_id, time) VALUES (?,?,?,?)";
    conn.query(sql, [message, sender_id, receiver_id, time], (err, result) => {
        if (err) {
            console.error("database error", err);
            return res.status(500).send({ message: "Internal server error" })
        }
        res.json({
            message: "new message is inserted",
            result: result,
            success: true
        })
    })
})

// Handle users list message
app.get('/list-message/:id', (req, res) => {
    const id = req.params.id;
    const sqlMessage = "SELECT * FROM messages WHERE sender_id = ? or receiver_id = ?";
    conn.query(sqlMessage, [id, id], (err, result) => {
        if (err) return res.status(500).send({ message: "Internal server problem" })
        res.json({
            message: "Record display succssfully",
            result: result
        })
    })
})

// Handle fetch login user information 
app.get('/login-users', (req, res) => {
    sql = "SELECT * FROM users";
    conn.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Internal server problem" })
        }
        res.json({
            message: "Record display succssfully",
            result: result
        })
    })
})

// Handle user disconnection
app.post('/disconnect-user', (req, res) => {
    const { user_id } = req.body;
    const sql = "UPDATE users SET status = 0 WHERE id = ?"
    conn.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'internal server error' })
        }
        res.json({
            message: "User status updated to offline",
            result: result
        });
    })
})

http.listen(PORT, '192.168.1.246', () => console.log(`Server is running on ${PORT} PORT`));