const mongoose = require('mongoose'); // include mongodb package


const DatabaseConnect = () => {

    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb+srv://SocketChatApp:fYfOEXGPffl3Q5mF@cluster0.4zoqcuy.mongodb.net/?retryWrites=true&w=majority');
    const db = mongoose.connection;
    db.on("error",(error)=>console.log(error));
    db.once("open",()=>console.log("DB Connected"));
}

module.exports = DatabaseConnect