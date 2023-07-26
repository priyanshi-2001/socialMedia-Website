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
import likes from '../Models/Likes.js'
import skills from '../Models/Skills.js'
import certifications from "../Models/Certification.js";
import fileUpload from "express-fileupload";
import mongoose, { mongo } from "mongoose";
import fs from 'fs';
import {v2 as cloudinary} from 'cloudinary';
import redis from 'redis';
import { promisify } from "util";

const reactionMap = new Map([
  ['like', 'L'],
  ['support', 'S'],
  ['love', 'LV'],
  ['laugh', 'LG']
]);
let client;
(async () => {
  client = redis.createClient();


  client.on('error', (err) =>console.error(`Error : ${err}`));

  await client.connect();
  console.log("connected redis in routes.js")
  
})();

export const createPost=async(req,res)=>{
    try{
        const body=req.body;
        const file=req.files!==null ? req.files['files']:[];
      
        var encodedData=[];
        
        var encodedData=[];
        if(Array.isArray(file)){
        

        for(let i=0;i<file.length;i++){
            var base64encoded=Buffer.from(file[i]['data']).toString('base64');
            try{
                var startString='';
                if(base64encoded.toString().startsWith("iVB")){
                    startString='data:image/png;base64,';
                }
                if(base64encoded.toString().startsWith('JVB')){
                    startString='data:application/pdf;base64,';
                }
          
            const uploadResponse=await cloudinary.uploader.upload(
                startString + base64encoded,{
                    upload_preset:'posts'
                },
            )
            console.log("uploadResponse");
            encodedData.push(uploadResponse.url.replace("http","https"));
            }
            catch(err){
                console.log("err",err)
            }
        }
    }
    else if(file !==[]){

        var base64encoded=Buffer.from(file['data']).toString('base64');
        try{
            var startString='';
            if(base64encoded.toString().startsWith("iVB")){
                startString='data:image/png;base64,';
            }
            if(base64encoded.toString().startsWith('JVB')){
                startString='data:application/pdf;base64,';
            }
      
        const uploadResponse=await cloudinary.uploader.upload(
            startString + base64encoded,{
                upload_preset:'posts'
            },
        )
        console.log("uploadResponse");
        encodedData.push(uploadResponse.url.replace("http","https"));
        }
        catch(err){
            console.log("err",err)
        }
    }
       
      
        const postsRec=new posts({
           
            userId:mongoose.Types.ObjectId(body['userId']),
            // title:body['title'],
            body:body['body'],
            files:JSON.stringify(encodedData),
            createdDate:new Date(),
            modifiedDate:new Date(),
            isActive:true




        })
        await postsRec.save();
        res.send({Error:'NA',status:'success','postsRec':postsRec,'encodedData':encodedData})


    }
    catch(err){
        console.log("err",err);
    }
}

export const fetchMostRelatedPosts=async(req,res)=>{
    try{
        // var orgNames=await education.find({});
        // var names=orgNames.map((o)=>o.name);
        // const compIds=await company.find({});
        const companyNames=req.body['companyNames'];
        const locationCities=req.body['locationCity'];
       
        const userData=await user.find({_id:mongoose.Types.ObjectId(req.body['userId'])});
        const companyIds=await company.find({_id:{$in:companyNames}},{_id:1});
        var companyIdsList=companyIds.map((o)=>String(o._id.toString()))
        const userIds=await user.find({organization:{$in:companyIdsList}},{_id:1,Name:1,headline:1,profilePic:1}); //fetch users who are currently working in the company
        var currentColleagues=userIds.map((o)=>mongoose.Types.ObjectId(o._id.toString()))

        const userIdsByEducation=await education.find( {name:{$in:companyIdsList}} ,{ _id:0,userId:1,name:1} );
        const userIdsByExperience=await experience.find({ companyId:{$in:companyIdsList}
          // ,locationId:{$in:locationCities} 
        }).lean().exec();
        var educationWiseIds;
        var experienceWiseids;
        if(userIdsByEducation && userIdsByEducation.length>0){
          educationWiseIds=userIdsByEducation.map((o)=>mongoose.Types.ObjectId(o.userId));
        }
        if(userIdsByExperience && userIdsByExperience.length>0){
          experienceWiseids=userIdsByExperience.map((o)=>mongoose.Types.ObjectId(o.userId));
        }

        // const pipeline = [
        //     {
        //       $lookup: {
        //         from: 'comments',
        //         localField: '_id',
        //         foreignField: 'postId',
        //         as: 'commentsData'
        //       }
        //     },
        //     ]
    
      
        // const pipeline = [
        //     {
        //       $lookup: {
        //         from: 'likes',
        //         localField: '_id',
        //         foreignField: 'postId',
        //         as: 'likesData',
                
        //       },    
        //     },
           
        //   ];
        // const pipeline = [
        //     {
        //       $match: {
        //         userId: { $in: currentColleagues }
        //       }
        //     },
        //     {
        //       $lookup: {
        //         from: 'likes',
        //         let: { postId: '$_id' },
        //         pipeline: [
        //           {
        //             $match: {
        //               $expr: { $eq: ['$postId', '$$postId'] }
        //             }
        //           },
        //           {
        //             $group: {
        //               _id: '$reactionType',
        //               count: { $sum: 1 }
        //             }
        //           }
        //         ],
        //         as: 'likesData'
        //       }
        //     },
        //     {
        //       $addFields: {
        //         likesData: {
        //           $map: {
        //             input: "$likesData",
        //             as: "like",
        //             in: {
        //               $switch: {
        //                 branches: [
        //                   { case: { $in: ['$$like._id', ['L', 'S', 'LV', 'LG']] }, then: { reactionCt: '$$like.count' } },
        //                   // { case: { $eq: ['$$like._id', ['L','S','LV','LG']] }, then: { reactionCt: '$$like.count' } },
        //                   // { case: { $eq: ['$$like._id', 'S'] }, then: { reactionCt: '$$like.count' } },
        //                   // { case: { $eq: ['$$like._id', 'LV'] }, then: { reactionCt: '$$like.count' } },
        //                   // { case: { $eq: ['$$like._id', 'LG'] }, then: { reactionCt: '$$like.count' } }
        //                 ],
        //                 default: null
        //               }
        //             }
        //           }
        //         }
        //       }
        //     }
        //   ];
          
        const pipeline = [
          {
            $match: {
              userId: { $in: currentColleagues }
            }
          },
          {
            $lookup: {
              from: 'likes',
              let: { postId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$postId', '$$postId'] }
                  }
                },
                {
                  $group: {
                    _id: '$reactionType',
                    count: { $sum: 1 }
                  }
                }
              ],
              as: 'likesData'
            }
          },
          {
            $addFields: {
              likesData: { $sum: "$likesData.count" }
            }
          }
        ];
        
        const fetchIds=Array.from(new Set(currentColleagues.concat(educationWiseIds).concat(userIdsByExperience)));
          const postsDataByColleagues = await posts.aggregate([
            { $match: { userId: { $in: currentColleagues } } },
            ...pipeline
          ]);

          
        
        const finalDataPostsbyColleagues=await user.populate(postsDataByColleagues, {path: "userId"});

        const postsDataByEducation = await posts.aggregate([
            { $match: { userId: { $in: educationWiseIds } } },
            ...pipeline
          ]);
        const postsDataByExperience = await posts.aggregate([
          { $match: { userId: { $in: experienceWiseids } } },
          ...pipeline
        ]);
        
        const finalDatapostsByEd=await user.populate(postsDataByEducation, {path: "userId"});
        const finalDatapostsByExperience=await user.populate(postsDataByExperience, {path: "userId"});

        res.send({'Error':'NA','postsDataByExperience':finalDatapostsByExperience,'postsDataByCurrColleagues':finalDataPostsbyColleagues,'postsDataByEducation':finalDatapostsByEd,'profilePic':userData[0].profilePic});

    }
    catch(err){
        
        console.log("err",err)
        res.send({'Error':'Error','status':'Error ocurred'+String(err)})
    }
}

export const reactOnPost=async(req,res)=>{
    try{
           const{postId,userId,reaction}=req.body;
           const checkReactionRecord=await likes.find({userId:mongoose.Types.ObjectId(userId),
            postId:mongoose.Types.ObjectId(postId)}
            ).lean().exec();
            if(Array.isArray(checkReactionRecord) && checkReactionRecord.length > 0){
             
                const updatedData=await likes.updateOne(
                                    {_id:mongoose.Types.ObjectId(checkReactionRecord[0]._id)},
                                    {$set:{reactionType:reactionMap.get(reaction)}}
                                    );
                                  
                if(updatedData.modifiedCount==0){
                  res.send({Error:'Error in updation'});
                }
                else{
                res.send({Error:'NA',status:updatedData});
                }
            }
            else{
                const newReactionRecord=new likes({
                    userId:mongoose.Types.ObjectId(userId),
                    postId:mongoose.Types.ObjectId(postId),
                    reactionType:reactionMap.get(reaction)
                });
                await newReactionRecord.save();
                res.send({Error:'NA',status:newReactionRecord});

            }
    }
    catch(err){
        console.log("err",err)
        res.send({Error:'Error'});
    }
}



export const unReactOnPost=async(req,res)=>{
    try{
        const{postId,userId}=req.body;
     
        const updatedData=await likes.deleteOne(
                {userId:mongoose.Types.ObjectId(userId),
                 postId:mongoose.Types.ObjectId(postId)}
        );
        if(updatedData.deletedCount>0){
        res.send({Error:'NA',status:updatedData});
        }
        else{
            res.send({Error:'Record not deleted'});
        }
       
    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }
}

export const getReactionsOnAPost=async(req,res)=>{
    try{
        const postId=req.params.postId;
        if(postId=='' || postId==undefined || postId==null ){
            res.send({Error:'postId incorrect'});
        }
        const pipeline=
            [
                {
                  $group: {
                    _id: "$reactionType",
                    likes: { $push: "$$ROOT" }
                  }
                },
                {
                  $group: {
                    _id: null,
                    reactions: {
                      $push: {
                        reactionType: "$_id",
                        likes: "$likes"
                      }
                    }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    reactions: 1
                  }
                }
        ]
        
       
        
        
        const reactions=await likes.aggregate([ 
            { $match: { postId: mongoose.Types.ObjectId(postId) } },
            ...pipeline
        ]);
        const reactionsData=await user.populate(reactions[0]['reactions'], {path: "likes.userId"});

        res.send({Error:'NA',reactions:reactionsData});

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }
}

export const search=async(req,res)=>{
  try{

    const value=req.params.value;
    if(value=='' || value==[] || value==null || value==undefined){
      res.send({Error:'Error in searched value'})
    }
    const data={};
    data.companies = await company.find({
      name: { $regex: value, $options: "i" }
    });
    data.users=await user.find({
      Name: { $regex: value, $options: "i" }
    })
    data.postsData= await posts.find(
      {
        body: { $regex: new RegExp(value, "i") }
      }
    )
    res.send({Error:'NA',data:data});
    
  }
  catch(err){

    console.log("err",err);
    res.send({Error:'Error'});

  }
}
export const getCompanies=async(req,res)=>{
  try{
     var results;
     const cacheResults= await client.get('companiesData');
     if (cacheResults) {
      console.log("cacheResults",cacheResults);
      results = JSON.parse(cacheResults);
      res.send({Error:'NA',results:results})

    } else {
      results = await company.find({}).lean().exec();
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      else{
      await client.set('companiesData', JSON.stringify(results));
      }
      res.send({Error:'NA',results:results})

    }

  }
  catch(err){
    console.log("err",err);
    res.send({Error:'Error'});
  }
}

export const getLocation=async(req,res)=>{
  try{
     var results;
     const cacheResults= await client.get('locationsData');
     if (cacheResults) {
      console.log("cacheResults",cacheResults);
      results = JSON.parse(cacheResults);
      res.send({Error:'NA',results:results})

    } else {
      results = await location.find({}).lean().exec();
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      else{
      await client.set('locationsData', JSON.stringify(results));
      }
      res.send({Error:'NA',results:results})

    }

  }
  catch(err){
    console.log("err",err);
    res.send({Error:'Error'});
  }
}
