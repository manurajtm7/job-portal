const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Server } = require("socket.io");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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
const UsersProfileViewRoute = require("./routes/user-profile-view/route");
const ChatRequestRoute = require("./routes/chat-request/route");
const authRoutes = require("./routes/authentication/Auth/Auth");
const profileRoutes = require("./routes/authentication/Auth/Profile");
const jobPostListRoute = require("./routes/posted-jobs-list/route");

const handleGoogleAuthUsere = require("./controllers/user-google-auth/UserGoogleAuth");
const messageModel = require("./schema/message-schema/messageSchema");
const { default: mongoose } = require("mongoose");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//* multer config start
const upload = multer({ dest: "./uploads" });
app.use(upload.any());
//* multer config ends

//* cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
//* cloudinary configuration ends

//?data base connection controller method
connect();
//?data base connection controller method end

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await handleGoogleAuthUsere(profile);

        return done(null, user);
      } catch (Err) {
        console.log(Err);
        return done(Err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

//google authentication end

//? routes expressions here
app.use("/register", RegistrationRoute);
app.use("/login", LoginRoute);

app.use("/jobs-list", jobsListRoute);
app.use("/post-job", JobPostRoute);
app.use("/", jobPostListRoute);
app.use("/personal-profile-form", PersonalDetailsRoute);
app.use("/profile-view", ProfileViewRoute);
app.use("/user-profile-view", UsersProfileViewRoute);

app.use("/employer-details-form", EmployerDetailsRoute);
app.use("/employer-all-details", EmployerAllDetailsRoute);
app.use("/employer-profile-view", EmployerProfileVieRoute);
app.use("/change-status", ChangeStatusRoute);

app.use("/job-application-send", JobApplicationRoute);
app.use("/job-application-list", JobAlertsRoute);

app.use("/users-list", UsersListRoute);
app.use("/chat-request", ChatRequestRoute);

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

//? routes expressions here

//google authentication

//additional route handlers
app.get("/", (_, res) => {
  res.send("Backend initital test ok");
});

//! socket api starts

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("join_chat", async (data) => {
    const roomId = data.room;
    socket.join(roomId);
    try {
      const messages = await messageModel.find({
        room: roomId,
      });
      io.to(roomId).emit("all_chat_messages", messages);
    } catch (Err) {
      console.log(Err);
    }
  });

  socket.on("message_send", async (data) => {
    console.log(data);
    const messageResponse = await messageModel.create({
      sender: new mongoose.Types.ObjectId(data?.sender),
      receiver: new mongoose.Types.ObjectId(data?.receiver),
      message: data?.message,
      room: data?.room,
    });

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
