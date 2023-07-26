import express from "express";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import NodeCache from "node-cache";
import {authorize} from '../middleware/authMiddleware.js';

const myCache = new NodeCache();
import redis from 'redis'


import cors from 'cors';
import {deleteChats,deleteMessage,getChats,sendMessage,fetchChatsUsers} from '../controllers/chats.js';
import {signup ,fetchSkills,login} from "../controllers/signUp.js";
import {createPost,fetchMostRelatedPosts,reactOnPost,unReactOnPost,getReactionsOnAPost,search,getCompanies,getLocation} from '../controllers/posts.js';
import {getProfileDetails,fetchNotifications,getUserDetails,editEducationData,editExperienceData,editCertificationsData} from '../controllers/profile.js';
import {addComment,getComments,deleteComments,updateComment} from '../controllers/comments.js';
import {fetchConnectionsAndKnownPeople,rejectConnectionRequest,fetchConnections,followUser,sendConnectionRequest,unfollowUser,withdrawConnectionRequest,removeConnection,removeFollower,acceptConnectionRequest} from '../controllers/connectionsAndFollowers.js';
var app = express();
import bodyParser from "body-parser";
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
app.use(bodyParser.json());
app.use(cors());
import { ObjectId } from "mongoose";
import nodemailer from 'nodemailer'
import cookieParser from "cookie-parser";
const bcryptSalt =process.env.BCRYPT_SALT;

// import jwt from 'jwt-decode'

const router = express.Router();
// let client;
// (async () => {
//   client = redis.createClient();


//   client.on('error', (err) =>console.error(`Error : ${err}`));

//   await client.connect();
//   console.log("connected redis")
  
// })();

router.get("/",(req,res)=>{
    res.send("HEY ITS ROOT PAGE")
})

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/createPost").post(authorize,createPost);
router.route("/fetchMostRelatedPosts").post(authorize,fetchMostRelatedPosts);
router.route("/addComment").post(authorize,addComment);
router.route("/getComments/:id").get(authorize,getComments);
router.route("/deleteComments").post(authorize,deleteComments);
router.route("/updateComment").post(authorize,updateComment);
router.route("/fetchSkills").get(fetchSkills);
router.route("/getChats/:receiverId/:senderId").get(authorize,getChats);
router.route("/sendMessage").post(authorize,sendMessage);
router.route("/deleteChats").post(authorize,deleteChats);
router.route("/deleteMessage").post(authorize,deleteMessage);
router.route("/fetchConnectionsAndKnownPeople/:userId/:companyNames").get(authorize,fetchConnectionsAndKnownPeople);
router.route("/sendConnectionRequest").post(authorize,sendConnectionRequest);
router.route("/withdrawConnectionRequest").post(authorize,withdrawConnectionRequest);
router.route("/followUser").post(authorize,followUser);
router.route("/unfollowUser").post(authorize,unfollowUser);
router.route("/getProfileDetails/:id/:userId").get(authorize,getProfileDetails);
router.route("/removeFollower").post(authorize,removeFollower);
router.route("/removeConnection").post(authorize,removeConnection);
router.route("/acceptConnectionRequest").post(authorize,acceptConnectionRequest);
router.route("/fetchNotifications/:id").get(authorize,fetchNotifications);
router.route("/fetchConnections/:id").get(authorize,fetchConnections);
router.route("/fetchChatsUsers/:id").get(authorize,fetchChatsUsers);
router.route("/getUserDetails/:id").get(authorize,getUserDetails);
router.route("/rejectConnectionRequest").post(authorize,rejectConnectionRequest);
router.route("/reactOnPost").post(authorize,reactOnPost);
router.route("/unReactOnPost").post(authorize,unReactOnPost);
router.route("/getReactionsOnAPost/:postId").get(authorize,getReactionsOnAPost);
router.route("/search/:value").get(authorize,search);
router.route("/editEducationData").post(authorize,editEducationData);
router.route("/editExperienceData").post(authorize,editExperienceData);
router.route("/editCertificationsData").post(authorize,editCertificationsData);
router.route("/getCompanies").get(authorize,getCompanies);
router.route("/getLocation").get(authorize,getLocation);
//add edit apis
//rate limit for 10 connecn req each day by every user
// router.route("editProfile").get(editProfileDetails)

export default router;
