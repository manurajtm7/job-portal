const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { default: mongoose } = require("mongoose");
const { Server } = require("socket.io");

require("dotenv").config();
const connect = require("./controllers/database/dbconnection");

//import routes here
const jobsListRoute = require("./routes/jobs-list/route");
const JobPostRoute = require("./routes/post-job/route");
const RegistrationRoute = require("./routes/authentication/registration/route");
const LoginRoute = require("./routes/authentication/login/route");
const PersonalDetailsRoute = require("./routes/personal-info/route");
const EmployerDetailsRoute = require("./routes/employer-details/route");
const EmployerAllDetailsRoute = require("./routes/employer-all-info/route");
const JobApplicationRoute = require("./routes/job-application-send/route");
const JobAlertsRoute = require("./routes/job-alerts/route");
const EmployerProfileVieRoute = require("./routes/employer-profile-view/route");
const ChangeStatusRoute = require("./routes/status-change/route");
const UsersListRoute = require("./routes/users-list/route");
const ProfileViewRoute = require("./routes/profile-view/route");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200,
    methods: ["GET", "POST"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cookieParser());

//?data base connection controller method
connect();
//?data base connection controller method end

//? routes expressions here
app.use("/register", RegistrationRoute);
app.use("/login", LoginRoute);

app.use("/jobs-list", jobsListRoute);
app.use("/post-job", JobPostRoute);
app.use("/personal-profile-form", PersonalDetailsRoute);
app.use("/profile-view", ProfileViewRoute);

app.use("/employer-details-form", EmployerDetailsRoute);
app.use("/employer-all-details", EmployerAllDetailsRoute);
app.use("/employer-profile-view", EmployerProfileVieRoute);
app.use("/change-status", ChangeStatusRoute);

app.use("/job-application-send", JobApplicationRoute);
app.use("/job-application-list", JobAlertsRoute);

app.use("/users-list", UsersListRoute);

//? routes expressions here

//additional route handlers
app.get("/", (_, res) => {
  res.send("Backend initital test ok");
});

//! socket api starts

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("join_chat", (data) => {
    const roomId = data.room;
    socket.join(roomId);
  });

  socket.on("message_send", (data) => {
    socket.broadcast.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected" + socket.id);
    onlineUsers = onlineUsers.filter((item) => item !== socket.id);
  });
});

//! socket api ends

//? server port configurations
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log("server listening on port " + PORT));

// module.exports = io;
