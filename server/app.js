const express = require('express');
const app = express();
require("dotenv").config()
const { configureSocket } = require('./socket');
const PORT = process.env.PORT
const cookieParser = require('cookie-parser');
const cors = require('cors');

const io = require('socket.io')(8080, {
    cors: {
        origin: "https://movie-drive.vercel.app"
    }
})

app.use(cors({ credentials: true, origin: "https://movie-drive.vercel.app" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const connectDB = require('./config/connect');
configureSocket(io);

const actorRoutes = require("./routes/actorRoutes");
const directorRoutes = require('./routes/directorRoutes');
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require('./routes/chatRoutes');


app.use("/actor", actorRoutes)
app.use("/director", directorRoutes)
app.use("/admin", adminRoutes)
app.use("/chat", chatRoutes)

app.get("/", (req, res) => res.send("Server is ready"))

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }).catch((e) => {
        console.log('cannot connect to the network', e.message);
    })
