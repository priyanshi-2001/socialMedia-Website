import user from "../Models/User.js";
import certification from '../Models/Certification.js'
import chats from '../Models/Chats.js'
import comments from '../Models/Comments.js'
import company from '../Models/Company.js'
import connections from '../Models/Connections.js'
import country from '../Models/Country.js'
import education from '../Models/Education.js'
import experience from '../Models/Experience.js'
import followers from '../Models/Followers.js'
import location from '../Models/Location.js'
import posts from '../Models/Posts.js'
import skills from '../Models/Skills.js'
import certifications from "../Models/Certification.js";
import fileUpload from "express-fileupload";
import mongoose, { Mongoose, mongo } from "mongoose";
import { isAuthenticated } from "./signUp.js";
import fs from 'fs';
import {v2 as cloudinary} from 'cloudinary';
import jsonwebtoken from 'jsonwebtoken';
export const getChats=async(req,res)=>{
    try{
        const receiverId=req.params['receiverId'];
        const senderId=req.params['senderId'];
        const results=await chats.find({
            $or: [
                { sender: mongoose.Types.ObjectId(receiverId), receiver: mongoose.Types.ObjectId(senderId) },
                { sender: mongoose.Types.ObjectId(senderId), receiver: mongoose.Types.ObjectId(receiverId) }]}).populate('receiver').populate('sender');
        res.send({Error:'NA',chats:results});

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error',chats:[]});

    }
}

export const sendMessage=async(req,res)=>{
    try{
        const{receiver,sender,message}=req.body;
        const newChat= new chats({
            date:Date.now(),
            msg:message,
            receiver:mongoose.Types.ObjectId(receiver),
            sender:mongoose.Types.ObjectId(sender)
        })
       const chatSaved=await newChat.save();
       res.send({Error:'NA',chats:chatSaved});

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error',chats:[]});
    }
}

export const deleteChats=async(req,res)=>{//to delete all conversation b/w 2 people
    try{
        const{receiverId,senderId}=req.body;
        const deletedItems=await chats.deleteMany({
            $or: [
                { sender: mongoose.Types.ObjectId(receiverId), receiver: mongoose.Types.ObjectId(senderId) },
                { sender: mongoose.Types.ObjectId(senderId), receiver: mongoose.Types.ObjectId(receiverId) }]
        })
        
       res.send({Error:'NA',chats:deletedItems});


    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error',chats:[]});
    }
}

export const deleteMessage=async(req,res)=>{
    try{
        const{receiverId,senderId,message}=req.body;
        const chatDeleted=await chats.deleteOne({receiver:mongoose.Types.ObjectId(receiverId),sender:mongoose.Types.ObjectId(senderId),msg:message});
       
       res.send({Error:'NA',chats:chatDeleted});

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error',chats:[]});
    }
}

export const fetchChatsUsers=async(req,res)=>{
    try{
        const userId=req.params.id;
        if(userId=='' || userId==[] || userId==undefined){
            res.send({Error:'userId incorrect'});
        }
        const uniqueSenderIds = await chats.distinct('sender', {
            $or: [
              { receiver: mongoose.Types.ObjectId(userId), Status: 'S' },
              { sender: mongoose.Types.ObjectId(userId), Status: 'S' }
            ]
          });
          
          const uniqueReceiverIds = await chats.distinct('receiver', {
            $or: [
              { receiver: mongoose.Types.ObjectId(userId), Status: 'S' },
              { sender: mongoose.Types.ObjectId(userId), Status: 'S' }
            ]
          });
         
          
         

          const result=Array.from(new Set([...uniqueSenderIds.map(String), ...uniqueReceiverIds.map(String)]))
          const filteredArray = result.filter((element) => element !== userId);
          const chat=await user.find({ _id: { $in: filteredArray } }).lean().exec();
        
        
          console.log("chat is",chat);

          res.send({Error:'NA',users:chat});

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }
}
