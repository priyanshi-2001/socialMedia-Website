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
export const addComment=async(req,res)=>{
    try{
    

      const {comment,parentCommentId,postId,userId}=req.body;
      let parentPath = '';
      var newPath=''
      if(parentCommentId){
        const parentComment = await comments.findById(mongoose.Types.ObjectId(parentCommentId));
        if(parentComment){
          parentPath=parentComment.path;
          if(parentPath){
             const commentsWithSamePath = await comments.find({postId:mongoose.Types.ObjectId(postId), path: { $regex:`^${parentPath}\\.(?!0+$)[0-9]+$`}}).sort({ path: -1 });

             
              // const commentsWithSamePath = await comments.find({postId:mongoose.Types.ObjectId(postId), path: { $regex: `^${parentPath}\.` }}).sort({ path: -1 });
              var listOfPath=parentPath.split(".");
              if(commentsWithSamePath.length>0){
                newPath=`${parentPath}.${parseInt(commentsWithSamePath[0].path.split(".").pop())+1
              }`
              }
              else{
                newPath=`${parentPath}.1`
              }

          }
          else{
            res.send({Error:'Error',status:'parentPathNotFound',newComment:[]})
          }
      }
      else{
        res.send({Error:'Error',status:'parentCommentNotFound',newComment:[]})
      }
      }
      else{
        const prevComments=await comments.find({ postId:mongoose.Types.ObjectId(postId) }).sort({ path: -1 });;
        if(prevComments.length>0){
          newPath=`${parseInt(prevComments[0].path)+1}`;
         
        }
        else{
          newPath='1';
        }
      }



      const newComment = new comments({
        description:comment,
        path: newPath,
        postId:mongoose.Types.ObjectId(postId),
        userId:mongoose.Types.ObjectId(userId),
        ref1:parentCommentId?mongoose.Types.ObjectId(parentCommentId):null,
        ref2:new Date().toISOString()
      });
  
      await newComment.save();

      //now add this commentId to its immediate parent
      if(parentCommentId){
      const updatedParentComment=await comments.findOneAndUpdate({_id:mongoose.Types.ObjectId(parentCommentId)},{$push:{immediateChilds:{children:mongoose.Types.ObjectId(newComment._id)}}},{new:true});
      console.log("updatedParentComment",updatedParentComment);
      }
      res.send({Error:'NA',status:'success','newComment':newComment})
   
      


    }
    catch(err){

        console.log("err inside addComment is",String(err));
        res.send({'Error':'Error','status':'Error ocurred'+String(err)})
    }
}

const  populateNestedComments=async(commentId)=> {
  try{
  const commentData = await comments.findById(commentId).populate('immediateChilds').exec();

  if (commentData.immediateChilds.length > 0) {
    const nestedCommentPromises = commentData.immediateChilds.map(async nestedComment => {
      const populatedNestedComments = await populateNestedComments(nestedComment.children);
      return populatedNestedComments;
    });

    const nestedComments = await Promise.all(nestedCommentPromises);
    commentData.immediateChilds = nestedComments;
  }

  return commentData;
}
 catch (error) {
  throw error;
}

}


export const getComments=async (req, res) => {
    try {
      // const auth=await isAuthenticated(req.headers.authorization);
      // if(!auth){
      //   res.send({Error:'Not Authenticated',status:'',newComment:[]});
      // }
        const postId=req.params['id'];
        const temp=[];
        const commentsData = await comments.find({postId:mongoose.Types.ObjectId(postId),path: /^[0-9]+$/ }).sort({ path: 1 })
        // .populate({path:'immediateChilds.children'})
        .populate({
          path: 'immediateChilds',
          populate: {
            path: 'children',
            populate: {
              path: 'immediateChilds',
              populate: {
                path: 'children',
                populate: {
                  path: 'immediateChilds',
                  populate: {
                    path: 'children',
                    populate: {
                      path: 'immediateChilds',
                      populate: {
                        path: 'children'
                      }
                    }
                  }
                }
              }
            }
          }
        })
        .exec()
        
        
     
       console.log("commentsData",commentsData)
        res.send({"Error":'NA',"comments":commentsData
      });
    } 
    catch (error) {
      console.error(error);
      res.send({'Error':'Error','status':'Error ocurred'+String(err)})
    }
  }

export const updateComment=async(req,res)=>{
    try{
        const{updatedComment,commentId}=req.body;
        const comment=await comments.findByIdAndUpdate({_id:mongoose.Types.ObjectId(commentId)},{$set:{description:updatedComment}},{new:true});
        res.send({Error:'NA',updatedComment:comment});

    }
    catch(err){
        console.error(err);
      res.send({'Error':'Error','status':'Error ocurred'+String(err)})
    }
}

export const deleteComments=async(req,res)=>{
    try{
        const{commentId,parentCommentId}=req.body;
        const comment=await comments.findById({_id:commentId});
        if(!comment){
            res.send({'Error':'NA','status':'Comment not found'});
        }


        //check if this commentId is present in an children anywhere
        const filter = { immediateChilds: { $elemMatch: { children: commentId } } };
        // const d= await comments.updateOne({ "immediateChilds.children": val },
        // { $pull: { arrayField: { fieldToMatch: val } } }
        // );

        const updatedComments=await comments.updateMany(
          { _id:parentCommentId }, // Replace val with the specific value you want to match
          { $pull: { immediateChilds: { children: commentId } } }
        );
      
        const g=await comments.find(filter);
        var deletedRecord=[];
        //updatedComments.modifiedCount>0

        if(updatedComments && commentId!==parentCommentId){
          const deletedComment=await comments.deleteMany({_id:mongoose.Types.ObjectId(commentId),ref1:mongoose.Types.ObjectId(parentCommentId)});
          deletedRecord=deletedComment;

        }
        else{
          const deletedComment=await comments.deleteMany({_id:mongoose.Types.ObjectId(commentId)});
          deletedRecord=deletedComment;

        }
        res.send({Error:'NA',updatedComments:updatedComments,deletedComments:deletedRecord});

    }
    catch(err){
        console.log("err",err);
        res.send({'Error':'Error','status':'Error ocurred'+String(err)})

    }
}