const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require('cors')
const Route = require('./Routes.js');

const db = require('./DatabaseConnect');
const User = require('./models/UserModel.js');
const MessageModal = require('./models/MessageModal.js');
const ChatUsers = require('./models/ChatUsersModal.js');

app.use(cors())
app.use(express.json())
app.use("/api/user", Route)


db()

app.get('/', (req, res) => {
    res.send('<H1>Kearb socket</H1>');
});




io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('login', async (data) => {
        try {
            // Validate user input (for example, check if data.id is a valid MongoDB ObjectId)

            // Save user details to MongoDB
            console.log('User logged in:', data);

            await User.updateOne({ _id: data._id }, { $set: { socketId: socket.id } });

            console.log('Successfully Updated', socket.id);

            // Send a success response back to the client if needed
            socket.emit('loginSuccess', { message: 'Login successful' });
        } catch (error) {
            console.error('Error updating:', error.message);

            // Send an error response back to the client if needed
            socket.emit('loginError', { message: 'Error updating user details' });
        }
    });

    socket.on('sendMessage', async (data) => {
        console.log("Sending message", data)
    })


    socket.on('Sender_Reciver_data', async (data) => {

        const senderId = data.Sender_id._id
        const reciverId = data.Reciver_id._id

        // Check if the chat already exists
        const existingChat = await ChatUsers.findOne({
            $or: [
                { sender_id: senderId, receiver_id: reciverId },
                { sender_id: reciverId, receiver_id: senderId }
            ]
        });

        if (existingChat) {
            console.log("Chat already exists:", existingChat);
        } else {
            const ChatUserModal = await ChatUsers({
                sender_data: data.Sender_id,
                reciver_data: data.Reciver_id,
                sender_id: senderId,
                receiver_id: reciverId
            })

            const saveChat = await ChatUserModal.save()
            console.log("Chat saved successfully:", saveChat);
        }

    })


    // // Handle user disconnect
    socket.on('disconnect', async () => {
        console.log('a user disconnected', socket.id);

        await User.updateOne({ socketId: socket?.id }, { $set: { socketId: "" } })
        // Perform any cleanup or additional actions upon user disconnect, if needed
    });


});

server.listen(3000, () => {
    console.log('listening on *:3000');
});



