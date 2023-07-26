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
// import { ObjectId } from "mongoose/lib/schema.js";
import jsonwebtoken from 'jsonwebtoken';
import notification from "../Models/Notifications.js";
export const fetchConnectionsAndKnownPeople=async(req,res)=>{//tested
    try{

        var {userId,companyNames}=req.params;
        companyNames=JSON.parse(companyNames);
       


        const connection=await connections.find({
            $or:[
                {receiver:mongoose.Types.ObjectId(userId),status:'S'},
                {sender:mongoose.Types.ObjectId(userId),status:'S'} //dont show a user with pending connecn request we show pending req people in educ or job field section
            ]
        }).populate('receiver').populate('sender');

       

        const followersData=await followers.find({
            followedBy:mongoose.Types.ObjectId(userId)
        }).populate('follower').lean().exec()
        var excludedUserIds=new Set();
        followersData.map((o)=>excludedUserIds.add(String(o.follower._id)));
        excludedUserIds.add(userId);
        connection.map((o)=>String(o.receiver._id)!=userId ?excludedUserIds.add(String(o.receiver._id)) :excludedUserIds.add(String(o.sender._id)) )
        const companyIds=await company.find({_id:{$in:companyNames}},{_id:1,name:1});
        var companyIdsList=companyIds.map((o)=>String(o._id))
        const userIdsByCompany=await user.find({organization:{$in:companyIdsList},_id: { $nin: Array.from(excludedUserIds) } },{password:1}).lean().exec(); //fetch users who are currently working in the company
        userIdsByCompany.map((o)=>excludedUserIds.add(String(o._id)));
        var excludedUserObjectIds=Array.from(excludedUserIds).map((i)=>mongoose.Types.ObjectId(i))
        
        const userIdsByEducation=await education.find( {name:{$in:companyIdsList},userId: { $nin: excludedUserObjectIds }} ,{ _id:1,name:1,userId:1} ).populate('userId').lean().exec();
        userIdsByEducation.map((o)=>excludedUserIds.add(String(o.userId._id)));
        excludedUserObjectIds=Array.from(excludedUserIds).map((i)=>mongoose.Types.ObjectId(i))
        const usersdataByPreviousExpInCompany=await experience.find({companyId:{$in:companyIdsList},userId: { $nin: excludedUserObjectIds }},{_id:1,companyId:1}).populate('userId').lean().exec();//to get people who have already worked here in past
        var companyMappings=new Map();
        companyIds.forEach((o)=>{
            companyMappings.set(String(o._id),o.name)

        })
        var data=new Map();
        userIdsByCompany.map((o)=> {
            if(!data.has(companyMappings.get(o.organization))){
               
                data.set(companyMappings.get(o.organization),[o])
            } 
            else{
             data.get(companyMappings.get(o.organization)).push(o); 
            }
            } )
        usersdataByPreviousExpInCompany.map((o)=> {
            if(!data.has(companyMappings.get(o.companyId))){
                o.userId !=undefined?(
                data.set(companyMappings.get(o.companyId),[o.userId])
                ):(null)
            } 
            else{
                data.get(companyMappings.get(o.companyId)).push(o.userId); 
            }
            } )
        userIdsByEducation.map((o)=> {
            if(!data.has(companyMappings.get(o.name))){
                o.userId!=undefined?(
                data.set(companyMappings.get(o.name),[o.userId])
                ):(null)
            } 
            else{
                data.get(companyMappings.get(o.name)).push(o.userId); 
            }
            } )

        console.log("data",data);
        const idsToCheckConnection=excludedUserObjectIds.filter((o)=>!o.equals(mongoose.Types.ObjectId(userId)));
        const connectionDataForRelevantPeople=await connections.find({
            $or:[
                {receiver:mongoose.Types.ObjectId(userId),status:'P',sender:{$in:idsToCheckConnection}},
                {sender:mongoose.Types.ObjectId(userId),status:'P',receiver:{$in:idsToCheckConnection}} //dont show a user with pending connecn request we show pending req people in educ or job field section
            ]
        }).populate('receiver').populate('sender');
        var idsForConnection=connectionDataForRelevantPeople.map((o)=>o.receiver._id.equals(mongoose.Types.ObjectId(userId))?
        (String(o.sender._id)):(String(o.receiver._id))
        );

        const dataObject = {};
        data.forEach((value, key) => {
        dataObject[key] = value;
        });
        const connectionsData=connection.map((o)=>o.toObject())
        for(let i=0;i<companyNames.length;i++){
            if(companyMappings.get(companyNames[i]) in dataObject){
            dataObject[companyMappings.get(companyNames[i])].map((o)=>
            o!=null?
            (idsForConnection.includes( String(o._id))?(
                o['ConnectionReqPending']=true,
                o['followed']=false
            ):(o['ConnectionReqPending']=false,o['followed']=false)
            ):(null)
            )
            
            
            }

        }
       
        res.
        send({Error:'NA',followersData:followersData,connection:connectionsData,companyIdsList:Array.from(companyMappings.values()),data:dataObject})


    }
    catch(err){
        console.log("err is",err);
        res.send({Error:'Error'+String(err)});
    }
}

export const sendConnectionRequest=async(req,res)=>{//tested
try{
    const{sender,receiver}=req.body;
    if(sender!=undefined && sender!=null && receiver!=undefined && receiver!=null){

    const connecnReq=new connections({
        date:Date.now(),
        receiver:mongoose.Types.ObjectId(receiver),
        sender:mongoose.Types.ObjectId(sender),
        status:'P'
    });
    await connecnReq.save();

    res.send({Error:'NA',connecnRequest:connecnReq})

    }
    else{
        res.send({Error:'Error in request body',status:[]});

    }

}
catch(err){
    console.log("err",err);
    res.send({Error:"Error"+String(err)})
}
}

export const acceptConnectionRequest=async(req,res)=>{ //tested
    try{
        const{sender,receiver}=req.body; //receiver will be user who is accepting connecn req
        if(sender!=undefined && sender!=null && receiver!=undefined && receiver!=null){

        const connecnReq=await connections.updateOne({receiver:mongoose.Types.ObjectId(receiver),sender:mongoose.Types.ObjectId(sender)},{$set:{status:'S'}});
        
        const userToUpdate = await user.findById(mongoose.Types.ObjectId(sender));
        const currentCount =userToUpdate.numOfConnections==undefined ||userToUpdate.numOfConnections==NaN || userToUpdate.numOfConnections=='0' ? parseInt(0,10): parseInt(userToUpdate.numOfConnections, 10);
        const updatedCount = currentCount + 1;

        userToUpdate.numOfConnections = updatedCount.toString();
        const updatedSender = await userToUpdate.save();

        const receiverToUpdate = await user.findById(mongoose.Types.ObjectId(receiver));
        const currentReceiverCount = receiverToUpdate.numOfConnections==undefined || receiverToUpdate.numOfConnections==NaN || receiverToUpdate.numOfConnections=='0' ? parseInt(0,10): parseInt(receiverToUpdate.numOfConnections, 10);
        const updatedReceiverCount = currentReceiverCount + 1;

        receiverToUpdate.numOfConnections = updatedReceiverCount.toString();
        const updatedReceiver = await receiverToUpdate.save();
        res.send({Error:'NA',status:connecnReq,updatedSenderData:updatedSender,updatedReceiverData:updatedReceiver})
        }
        else{
            res.send({Error:'Error in request body',status:[]});
        }
    }
    catch(err){
        console.log("err",err);
    res.send({Error:"Error"+String(err)})
    }
}

export const withdrawConnectionRequest=async(req,res)=>{//tested
    //when withdrawing connecn req also remove notifcn from receiver end
    try{
        const{sender,receiver}=req.body;
        if(sender!=undefined && sender!=null && receiver!=undefined && receiver!=null){

        const n=await notification.find({userId:mongoose.Types.ObjectId(receiver)});
        const updatedNotif=await notification.deleteOne({
            name:"connectionReceived",userId:mongoose.Types.ObjectId(receiver),ref1:sender
        })

        const connecnReq=await connections.deleteOne({
            $or: [
                { receiver: mongoose.Types.ObjectId(receiver), sender: mongoose.Types.ObjectId(sender),status:'P'},
                { receiver: mongoose.Types.ObjectId(sender), sender: mongoose.Types.ObjectId(receiver),status:'P'}
              ]
            }
            );
        res.send({Error:'NA',status:connecnReq})
        }
        else{
            res.send({Error:'Error in request body',status:[]});
        }


    }
    catch(err){
        console.log("err",err);
        res.send({Error:"Error"+String(err)})
    }
}

export const followUser=async(req,res)=>{//tested
    try{
        const{follower,followedBy,flag}=req.body;
        if(follower!=undefined && follower!=null && followedBy!=undefined && followedBy!=null){
        const followRecords=new followers({
            followedBy:mongoose.Types.ObjectId(followedBy),//person who follows
            follower:mongoose.Types.ObjectId(follower)//person who is followed
        })
        await followRecords.save();
        if(flag==undefined){
        await followRecords.populate('follower');
        }
        const userToUpdate = await user.findById(mongoose.Types.ObjectId(follower));
        const currentCount =userToUpdate.numOfFollowers==undefined || userToUpdate.numOfFollowers==NaN || userToUpdate.numOfFollowers=='0' ? parseInt(0,10): parseInt(userToUpdate.numOfFollowers, 10);
        const updatedCount = currentCount + 1;

        userToUpdate.numOfFollowers = updatedCount.toString();
        const updatedSender = await userToUpdate.save();
        res.send({Error:'NA',status:followRecords});
    }
    else{
    res.send({Error:'Error in request body',status:[]});
    }

    }
    catch(err){
        console.log("err",err);
        res.send({Error:"Error"+String(err)})
    }
}

export const unfollowUser=async(req,res)=>{//tested //api called by user who did follow the other person
    try{
        const{follower,followedBy}=req.body;
        if(follower!=undefined && follower!=null && followedBy!=undefined && followedBy!=null){
        const followRecords=await followers.deleteOne({  
                followedBy:mongoose.Types.ObjectId(followedBy),//person who follows
                follower:mongoose.Types.ObjectId(follower)//person who is followed    
        })
        if(followRecords && followRecords.deletedCount==0){
            res.send({Error:'Record not deleted'});
        }
        const userToUpdate = await user.findById(mongoose.Types.ObjectId(follower));
        const currentCount =userToUpdate.numOfFollowers==undefined || userToUpdate.numOfFollowers==NaN || userToUpdate.numOfFollowers=='0' ? parseInt(0,10): parseInt(userToUpdate.numOfFollowers, 10);
        const updatedCount = currentCount - 1;

        userToUpdate.numOfFollowers = updatedCount.toString();
        const updatedSender = await userToUpdate.save();
        res.send({Error:'NA',status:followRecords});
    }
    else{
        res.send({Error:'Error in request body',status:[]});
    }
    }
    catch(err){
        console.log("err",err);
        res.send({Error:"Error"+String(err)})
    }
}


export const showActivity=async(req,res)=>{

}

export const removeFollower=async(req,res)=>{//tested
    try{
        const{follower,followedBy}=req.body;
        if(follower!=undefined && follower!=null && followedBy!=undefined && followedBy!=null){
        const followRecords=await followers.deleteOne({
            followedBy:mongoose.Types.ObjectId(followedBy),//person who follows
            follower:mongoose.Types.ObjectId(follower)//person who is followed
        })
        if(followRecords && followRecords.deletedCount==0){
            res.send({Error:'Record not deleted'});
        }
        const userToUpdate = await user.findById(mongoose.Types.ObjectId(follower));
        const currentCount =userToUpdate.numOfFollowers==undefined || userToUpdate.numOfFollowers==NaN || userToUpdate.numOfFollowers=='0' ? parseInt(0,10): parseInt(userToUpdate.numOfConnections, 10);
        const updatedCount = currentCount - 1;

        userToUpdate.numOfFollowers = updatedCount.toString();
        const updatedSender = await userToUpdate.save();
        res.send({Error:'NA',status:followRecords});
    }
        else{
            res.send({Error:'Error in request body',status:[]});
        }
    }
    catch(err){
        console.log("err",err);
        res.send({Error:"Error"+String(err)})
    }
}

export const removeConnection=async(req,res)=>{//tested
    try{
        const{sender,receiver}=req.body;
        if(sender!=undefined && sender!=null && receiver!=undefined && receiver!=null){
        const connecnReq=await connections.deleteOne({
            $or:[
                {receiver:mongoose.Types.ObjectId(receiver),sender:mongoose.Types.ObjectId(sender),status:'S'},
                {receiver:mongoose.Types.ObjectId(sender),sender:mongoose.Types.ObjectId(receiver),status:'S'},
            ]
        })
        
        // const connecnReq=await connections.deleteOne({
        //     receiver:mongoose.Types.ObjectId(receiver),sender:mongoose.Types.ObjectId(sender),status:'S'
        // });
        if(connecnReq && connecnReq.deletedCount==0){
            res.send({Error:'Record not deleted'});
        }
        const userToUpdate = await user.findById(mongoose.Types.ObjectId(sender));
        const currentCount =userToUpdate.numOfConnections==undefined || userToUpdate.numOfConnections==NaN || userToUpdate.numOfConnections=='0'? parseInt(0,10): parseInt(userToUpdate.numOfConnections, 10);
        const updatedCount = currentCount - 1;

        userToUpdate.numOfConnections = updatedCount.toString();
        const updatedSender = await userToUpdate.save();

        const receiverToUpdate = await user.findById(mongoose.Types.ObjectId(receiver));
        const currentReceiverCount = receiverToUpdate.numOfConnections==undefined || receiverToUpdate.numOfConnections==NaN ||receiverToUpdate.numOfConnections=='0' ? parseInt(0,10): parseInt(receiverToUpdate.numOfConnections, 10);
        const updatedReceiverCount = currentReceiverCount - 1;

        receiverToUpdate.numOfConnections = updatedReceiverCount.toString();
        const updatedReceiver = await receiverToUpdate.save();
        res.send({Error:'NA',status:connecnReq,userToUpdateData:userToUpdate,receiverToUpdateData:receiverToUpdate})
    }
    else{
        res.send({Error:'Error in request body',status:[]});
    }


    }
    catch(err){
        console.log("err",err);
        res.send({Error:"Error"+String(err)})
    }
}

export const fetchConnections=async(req,res)=>{
    try{
          const userId=req.params;
          if(userId=='' || userId==undefined || userId==[]){
            res.send({Error:'userId incorrect'});
          }

          const connection=await connections.find({
            $or:[
                {receiver:mongoose.Types.ObjectId(userId),Status:'S'},
                {sender:mongoose.Types.ObjectId(userId),Status:'S'}
            ]
          }).populate('sender').populate('receiver');

          res.send({Error:'NA',connection:connection});
    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }
}

export const rejectConnectionRequest=async(req,res)=>{
    try{

        const {receiver,sender}=req.body;
        if(receiver ==undefined || receiver==null || sender ==null || sender ==undefined){
            res.send({Error:'Error in sender and receiver'});
        }
        const u=await connections.find({ receiver:mongoose.Types.ObjectId(receiver),
            sender:mongoose.Types.ObjectId(sender),
            status:'P'}).lean().exec();

        const updatedData=await connections.updateOne({
            receiver:mongoose.Types.ObjectId(receiver),
            sender:mongoose.Types.ObjectId(sender),
            status:'P'
        },{$set:{status:'R'}},{new:true});
        if(updatedData && updatedData.modifiedCount>0){
        res.send({Error:'NA',updatedData:updatedData});
        }
        else{
            res.send({Error:'Error in modification'});
        }

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }
}