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



    socket.on('sendMessage', async (messageData) => {
        console.log("Sending message", messageData);

        const senderId = messageData.Sender_id;
        const reciverId = messageData.Reciver_id;

        const CreateChat = await MessageModal({
            sender: senderId,
            receiver: reciverId,
            text: messageData.Message,
        });

        await CreateChat.save();

        const data = await MessageModal.find({
            $or: [
                { sender: senderId, receiver: reciverId },
                { sender: reciverId, receiver: senderId },
            ],
        });


        const FriendSocketId = await User.findOne({_id : reciverId})

        console.log("Data exist", FriendSocketId)
        // Emit the chat data to both sender and receiver
        socket.emit(`${senderId}_${reciverId}`, { data });
        socket.emit(`${reciverId}_${senderId}`, { data });

        // socket.on("")

    });



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

            console.log("Chat with user Exist")

        } else {
            const ChatUserModal = await ChatUsers({
                sender_data: data.Sender_id,
                reciver_data: data.Reciver_id,
                sender_id: senderId,
                receiver_id: reciverId
            })

            await ChatUserModal.save()

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



