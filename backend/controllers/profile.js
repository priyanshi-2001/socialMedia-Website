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
import mongoose from "mongoose";
import {v2 as cloudinary} from 'cloudinary';
import jsonwebtoken from 'jsonwebtoken'
import bcrypt, { hash } from 'bcrypt';
import notification from "../Models/Notifications.js";
export const getProfileDetails=async(req,res)=>{
    try{     
        const userId=req.params.id;
        const loggedInUser=req.params.userId;
        if(userId==null || userId==undefined || userId==''){
             res.send({Error:'userId incorrect'})
        }
        var connectionData,followerData;
        if(mongoose.Types.ObjectId(userId)!=mongoose.Types.ObjectId(loggedInUser)){
        connectionData=await connections.find({
            $or:[
                {receiver:mongoose.Types.ObjectId(userId),sender:mongoose.Types.ObjectId(loggedInUser)},
                {receiver:mongoose.Types.ObjectId(loggedInUser),sender:mongoose.Types.ObjectId(userId)}
            ]
        }).lean().exec();
        followerData=await followers.find({
            followedBy:mongoose.Types.ObjectId(loggedInUser),follower:mongoose.Types.ObjectId(userId)
        }).lean().exec();
        }
        else{
            //the case when user viewing his profile. we need to show his connections and his followers.
            connectionData=await connections.find({
                $or:[
                    {receiver:mongoose.Types.ObjectId(userId)},
                    {sender:mongoose.Types.ObjectId(userId)}
                ]
            }).lean().exec();
            followerData=await followers.find({
                follower:mongoose.Types.ObjectId(userId)
            }).lean().exec();

        }
       
        var userDetails=await user.findById(mongoose.Types.ObjectId(userId)).lean().exec();
        const compArr=[];
        userDetails!=undefined && userDetails.organization!=undefined && mongoose.Types.ObjectId.isValid(userDetails.organization)
        ? compArr.push(userDetails.organization) :null;
        var skillsData=[];
        if(userDetails.skills!=='' && userDetails.skills!==undefined){
         skillsData=await skills.find({name:{$in:userDetails.skills}})
        }
        if(userDetails.organization!=='' && userDetails.organization!=undefined){
            
        }
        var educationDetails=await education.find({userId:mongoose.Types.ObjectId(userId)}).sort({ endDate: -1 }).lean().exec();
        educationDetails.map((o)=>compArr.push(o.name));
        var experienceDetails=await experience.find({userId:mongoose.Types.ObjectId(userId)}).sort({ endDate: -1 }).lean().exec();
        experienceDetails.map((o)=>compArr.push(o.companyId));
        const certificationsData=await certification.find({userId:mongoose.Types.ObjectId(userId)}).sort({endDate:-1}).lean().exec();
        const companyData=await company.find({ _id:{$in:compArr} }).lean().exec();
        var mp=new Map();
        companyData.map((o)=>mp.set(String(o._id),o.name));
        userDetails!=undefined && userDetails.organization!=undefined ?(
            userDetails.organization=mp.get(userDetails.organization)
        ):(null);
        educationDetails.map((o)=>o.name=mp.get(o.name));
        experienceDetails.map((o)=>o.companyId=mp.get(o.companyId))


        res.send({Error:'NA',userData:userDetails,followerData:followerData,connectionData:connectionData,skillsData:skillsData,educationDetails:educationDetails,experienceDetails:experienceDetails,certificationsData:certificationsData});
    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error',status:[]});
    }
}

export const fetchNotifications=async(req,res)=>{
    try{
         const userId=req.params;
         if(userId==undefined || userId=='' || userId==[]){
            res.send({Error:'userId incorrect'})

         }
         const notificationdata=await notification.find({userId:mongoose.Types.ObjectId(userId)}).sort({dateTime:-1});
         res.send({Error:'NA',data:notificationdata});

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }
}

export const getUserDetails=async(req,res)=>{
    try{
        const userId=req.params.id;
        if(userId==undefined || userId=='' || userId==[]){
            res.send({Error:'Error in userId'});
        }
        const userData=await user.findById(userId);
        res.send({Error:'NA',userData:userData});

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }

}

export const editEducationData=async(req,res)=>{
    try{
        const{id,details,flag,userId}=req.body;
        if(flag=='add'){
            if(details!=undefined && details!=null ){
                const newData=new education({
                    userId:mongoose.Types.ObjectId(userId),
                    location:mongoose.Types.ObjectId(details.locationCity),
                    name:details.name,
                    startDate:details.startDate,
                    endDate:details.endDate,
                    courseName:details.courseName,
                    marksCategory:details.marksCategory,
                    instCategory:details.categoryOptions,
                    marks:details.marks
                })
                const data=await newData.save();
               return res.send({Error:'NA',data:data})

            }
            else{
                return res.send({Error:'Error in details'});
            }



        }
        if(flag=='edit'){

            if(id!=undefined && id!=null && details!=undefined && details!=null ){
                var data=await education.findById(id);
                if('name' in details){
                    data.name=details.name
                }
                if('courseName' in details){
                    data.courseName=details.courseName
                }
                if('locationCity' in details){
                    data.location=mongoose.Types.ObjectId(details.locationCity);
                }
                if('startDate' in details){
                    data.startDate=details.startDate
                }
                if('endDate' in details){
                    data.endDate=details.endDate
                }
                if('marksCategory' in details){
                    data.marksCategory=details.marksCategory
                }
                if('categoryOptions' in details){
                    data.instCategory=details.categoryOptions
                }
                if('marks' in details){
                    data.marks=details.marks
                }
                const updated=await data.save();
                return res.send({Error:'NA',data:updated});

            }
            else{
                return res.send({Error:'Error in id and details'});
            }

        }

        return res.send({Error:'no flag found'});
        
        


    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }
}

export const editExperienceData=async(req,res)=>{
    try{

        const{id,details,flag,userId}=req.body;
        if(flag=='add'){
            if(details!=undefined && details!=null ){
        const newData=new experience({
            userId:mongoose.Types.ObjectId(userId),
            location:mongoose.Types.ObjectId(details.locationId),
            workDescription:details.workDescription,
            companyId:mongoose.Types.ObjectId(details.companyName),
            title:details.title,
            startDate:details.startDate,
            endDate:details.endDate!==undefined?details.endDate:'',
            Status:details.endDate!==undefined?'P':'C'
        })
            const data=await newData.save();
            return res.send({Error:'NA',data:data})
        }
        else{
            return res.send({Error:'Error in id and details'})
        }

        }

        if(flag=='edit'){

            if(id!=undefined && id!=null && details!=undefined && details!=null ){
                var data=await experience.findById(id);
                if('locationId' in details){
                    data.locationId=mongoose.Types.ObjectId(details.locationId)
                }
                if('workDescription' in details){
                    data.workDescription=details.workDescription
                }
                if('companyName' in details){
                    data.companyId=mongoose.Types.ObjectId(details.companyName);
                }
                if('title' in details){
                    data.title=details.title
                }
                if('endDate' in details){
                    data.endDate=details.endDate
                    data.Status='P'
                }
                if('startDate' in details){
                    data.startDate=details.startDate
                }
                if(!'endDate' in details){
                    data.Status='C'
                }
               
                const updated=await data.save();
                return res.send({Error:'NA',data:updated});

            }
            else{
                return res.send({Error:'Error in id and details'});
            }

        }

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }
}

export const editCertificationsData=async(req,res)=>{
    try{

        const{id,details,flag,userId}=req.body;
        if(flag=='add'){
            if(details!=undefined && details!=null ){
                const newData=new certification({
                    userId:mongoose.Types.ObjectId(userId),
                    company:mongoose.Types.ObjectId(details.locationId),
                    link:details.link,
                    skill:details.skill,
                    date:details.date
                })
                const data=await newData.save();
                return res.send({Error:'NA',data:data})
            }
            return res.send({Error:'Error'})

        }
        if(flag=='edit'){
            var data=await certification.findById(id);
            if('locationId' in details){
                data.company=details.locationId
            }
            if('link' in details){
                data.link=details.link
            }
            if('skill' in details){
                data.skill=details.skill
            }
            if('date' in details){
                data.date=details.date
            }
            const updated=await data.save();
            return res.send({Error:'NA',data:updated});

        }

    }
    catch(err){
        console.log("err",err);
        res.send({Error:'Error'});
    }
}

