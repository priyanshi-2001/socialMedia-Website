import express from "express";
import cron from "node-cron"
import cors from "cors"
import NodeCache from 'node-cache';
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import mongoose from 'mongoose';
import fileUpload from "express-fileupload";
import {v2  as cloudinary} from 'cloudinary'
import redis from 'redis'
import {authorize} from './middleware/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
const app = express();

import fetch from "node-fetch"
import razorpay from 'razorpay'
app.set('view engine', 'ejs');
import cookieParser from 'cookie-parser';
app.use(cookieParser('keyforcookie'));
app.use(cors());
import jwt from 'jwt-decode'
import {connectDB} from './db/conn.js'
connectDB()
import './Routes/routes.js'
import user from "./Models/User.js";
import certification from './Models/Certification.js'
import chats from './Models/Chats.js'
import comments from './Models/Comments.js'
import company from './Models/Company.js'
import connections from './Models/Connections.js'
import country from './Models/Country.js'
import education from './Models/Education.js'
import experience from './Models/Experience.js'
import followers from './Models/Followers.js'
import location from './Models/Location.js'
import posts from './Models/Posts.js'
import skills from './Models/Skills.js'
import likes from "./Models/Likes.js";
import notification from "./Models/Notifications.js";
import auth from "./Models/Auth.js";
import userActivity from "./Models/userActivity.js";
import  {Server}  from "socket.io";
import http from 'http';
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: ["http://localhost:3000","http://localhost:3001"]
  },
});
// const socketIO = require('socket.io');
import router from "./Routes/routes.js";
const port=8000
import bodyParser from "body-parser";
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    // limit:'200mb',
    // type:'json'
  })
);
// app.use(fs);
app.use(
  fileUpload({
      createParentPath: true,
  }),
);
let client;
(async () => {
  client = redis.createClient();


  client.on('error', (err) =>console.error(`Error : ${err}`));

  await client.connect();
  console.log("connected redis")
  
})();
const getIndexes = async (collection) => {
  try {
    const indexes = await collection.indexes();
    return indexes;
  } catch (err) {
    throw err;
  }
};

const getLikesIndexes = async () => {
  const collection = mongoose.connection.db.collection('likes');
  try {
    const indexes = await getIndexes(collection);
    console.log(indexes);
    return indexes;
  } catch (err) {
    console.error(err);
  }
};

// Example usage in an API endpoint
app.get('/likes/indexes', async (req, res) => {
  try {
    const indexes=await getLikesIndexes();
    res.status(200).json({ message: 'Indexes retrieved successfully',indexes:indexes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const userSockets = new Map();
io.on('connection', (socket) => {
  socket.on("message",()=>{
    socket.emit('messageResponse', 'the data is data heyaa whatsawpp');

  });

  socket.on("chatMessage",(message)=>{
    userSockets.set(message.sender, socket.id);
    message.date=new Date();

    io.to(userSockets.get(message.receiver)).emit("receive_message",message);
  })

  socket.on("recieve_connReq",async(message)=>{
    userSockets.set(message.sender, socket.id);
    var mp=new Map();
    mp.set('profilePic',message.profilePic);
    mp.set('headline',message.headline);

    const newNotification=new notification({
        dateTime:Date.now(),
        description:`${message.name} wants to connect`,
        name:"connectionReceived",
        ref1:message.sender,
        ref2:message.receiver,
        ref3:JSON.stringify(Array.from(mp.entries())),
        userId:mongoose.Types.ObjectId(message.receiver)
    });
    await newNotification.save();
    message.notification=newNotification;
    io.to(userSockets.get(message.receiver)).emit("receive_connReqNotif",message);
  })

  socket.on("listeningNotifications",(message)=>{
    userSockets.set(message.sender, socket.id);
  })

  socket.on("connectionRequestAccepted",async(message)=>{
    message.description=`${message.name}accepted your Connection Request. Click to start a Conversation with them`
    var mp=new Map();
    mp.set('profilePic',message.profilePic);
    mp.set('headline',message.headline);
    const newNotification=new notification({
      dateTime:Date.now(),
      description:`${message.name} accepted your Connection Request.Click to start a Conversation with them`,
      name:"connectionAccepted",
      ref1:message.sender,
      ref2:message.receiver,
      ref3:JSON.stringify(Array.from(mp.entries())),
      userId:mongoose.Types.ObjectId(message.sender)
    });
    await newNotification.save();

    const updatedNotif=await notification.deleteMany({
      name:"connectionReceived",userId:mongoose.Types.ObjectId(message.receiver),ref1:message.sender
    });
    message.notification=newNotification;
    io.to(userSockets.get(message.sender)).emit("connectionRequestAcceptedNotify",message);
    const userDetails=await user.find({_id:mongoose.Types.ObjectId(message.receiver)}).lean().exec();
    message.description=`${userDetails.name} is now a connection. Click to Start a Conversation with them`;
    const notificationForReceiver=new notification({
      dateTime:Date.now(),
      description:`${message.name} is now a connection. Click to Start a Conversation with them`,
      name:"connectionAccepted",
      ref1:message.sender,
      ref2:message.receiver,
      ref3:JSON.stringify(Array.from(mp.entries())),
      userId:mongoose.Types.ObjectId(message.receiver)
    })
    message.notification=notificationForReceiver;
    io.to(userSockets.get(message.receiver)).emit("connectionRequestAcceptedMsg",message);
    
  })
  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected.');
  });

  socket.on("error", (error) => {
    console.log("Socket connection error:", error);
  });

});

app.use(router);
app.use(bodyParser.json());
cloudinary.config({
  cloud_name:process.env.MAIN_CLOUD_NAME,
  api_key:process.env.MAIN_CLOUD_KEY,
  api_secret:process.env.MAIN_CLOUD_SECRET,
  secure:true
})
cloudinary.uploader.upload
user();
certification();
chats();
comments();
company();
connections();
country();
education();
experience();
followers();
location();
posts();
skills();
likes();
userActivity();
notification();
auth();
server.listen(port,()=>{
    console.log(`connection is set up at ${port}`);

})

