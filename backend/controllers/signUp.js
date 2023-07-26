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
import mongoose from "mongoose";
import {v2 as cloudinary} from 'cloudinary';
import jsonwebtoken from 'jsonwebtoken'
import bcrypt, { hash } from 'bcrypt';
import auth from "../Models/Auth.js";


export const isAuthenticated=async(auth)=>{
   
    const decodedToken = jsonwebtoken.verify(auth, process.env.API_KEY);

    const userId = decodedToken.userId;
    const userData = await user.findById(mongoose.Types.ObjectId(userId));
    if(userData){
        return true;
    }
    return false;
}
export const login= async (req, res) => {

    try {
       
      
      const { email, password } = req.body;
      const userdata = await auth.findOne({ email }).populate('userId');
      if (!userdata) {
        res.send({ Error: 'Invalid email or password',token:'' });
      }
      const isPasswordValid = await bcrypt.compare(password, userdata.password);
      if (!isPasswordValid) {
        res.send({ Error: 'Invalid email or password',token:'' });
      }
      const token = jsonwebtoken.sign({ userId: userdata.userId._id }, process.env.API_KEY, { expiresIn: '24h' });
      const companyData=new Set();
      const locationData=new Set();
      if(userdata.userId.organization!=undefined && mongoose.Types.ObjectId.isValid(mongoose.Types.ObjectId(userdata.userId.organization))){
      companyData.add(userdata.userId.organization);
      }
      if(userdata.userId.currentLoc!=undefined){
      companyData.add(userdata.userId.currentLoc);
      }
      const certifCompany=await certification.find({userId:mongoose.Types.ObjectId(userdata.userId._id)},{_id:0,company:1}).lean().exec();
      certifCompany.map((o)=>companyData.add(o.company.toString()))
      const educationInstNames=await education.find({ userId:mongoose.Types.ObjectId(userdata.userId._id) },{_id:0,name:1,location:1}).lean().exec();
      educationInstNames.map((o)=>{companyData.add(o.name);locationData.add(o.location.toString())});
      const experienceData=await experience.find({ userId:mongoose.Types.ObjectId(userdata.userId._id) },{_id:1,companyId:1,locationId:1}).lean().exec();
      experienceData.map((o)=>{companyData.add(o.companyId);o.locationId!=undefined?locationData.add(o.locationId):null});
      res.send({Error:'NA','token':token,'userId':userdata.userId._id,companyData:Array.from(companyData),locationData:Array.from(locationData) });
    } 
    catch (error) {
        console.log("error",error);
      res.send({ Error: 'Failed to log in',token:'' });
    }
  
}
  
// localStorage.setItem("hasAccount","true");
// localStorage.setItem("userId",String(resp.status));
// localStorage.setItem("companyNames",JSON.stringify(resp.companyNames));
// localStorage.setItem("locationCity",JSON.stringify(resp.locationCity));
// localStorage.setItem("educationInst",JSON.stringify(resp.educationInst));

export const signup=async(req,res)=>{
    try{

        const data=req.body['data'];
        var userId='';
        var locationIds=[];
        var locationCity=[];
        var companyNames=[];
        var educationInst=[];
        var companyIds=[];
        var skillsData=[];
        var toAddSkills=[];
        var skillsIds=[];
        var profilePicUrl='';
        var cvUrl='';



       
        const experienceData=req.body['experience'];
        skillsData=req.body['skills'];
        if(skillsData){
            skillsData.map(i=>i.hasOwnProperty('_id')?skillsIds.push(i._id):null);
            toAddSkills=skillsData.filter(i=>!i.hasOwnProperty('_id'))
            if(toAddSkills){
            toAddSkills.forEach(s=>s.name=s.value);
            const newSkills=await skills.insertMany(toAddSkills);
            newSkills.map(o=>skillsIds.push(String(o._id)))
            }



        }
        if(req.body['data'].profilePic!==''){
        const uploadResponse=await cloudinary.uploader.upload(
            req.body['data'].profilePic,{
                upload_preset:'profilePic'//Cv
            },
        )
        console.log("uploadResponse");
        profilePicUrl=uploadResponse.url.replace("http","https")
        }


        const hashedPassword = await bcrypt.hash(data.password, 10)
        if('data' in req.body){
            const userRec=new user({
                Name:data.name,
                email:data.email,
                password:hashedPassword,
                date:new Date(),
                phNum:data.phNum,
                gender:data.gender,
                organization: data.currentJobCompany,          
                occupation:data.currentJobTitle,
                profilePic:profilePicUrl,
                isFresher:req.body['experience']&&req.body['experience'].length==0,
                skills:JSON.stringify(skillsIds)
                //save country also


            })
            const recordStatus=await userRec.save();
            if(recordStatus!=undefined ){
            const newUser=new auth({
                userId:mongoose.Types.ObjectId(userRec._id),
                password:hashedPassword,
                email:data.email
            })
            await newUser.save();
            }
            userId=userRec._id;
    }
        


        if(experienceData && experienceData.length>0){
            var expData=[];
            
            
            for(let i=0;i<experienceData.length;i++){
                companyNames.push(experienceData[i]['companyName'].toUpperCase())
                locationCity.push(experienceData[i]['locationCity'].toUpperCase())
            }
           
            locationCity.push(req.body['data'].curentJobLoc.toUpperCase());
            companyNames.push(req.body['data'].currentJobCompany.toUpperCase());
           
            if('education' in req.body && req.body['education'].length>0){
                    for(let i=0;i<req.body['education'].length;i++){
                        locationCity.push(req.body['education'][i].locationCity.toUpperCase());
                        companyNames.push(req.body['education'][i].name.toUpperCase());
                    }
                    locationCity=Array.from(new Set(locationCity));
                    locationIds=await location.find({name:{$in:locationCity}});
                    console.log("locatId",locationIds);
            }

            var tempForComp=[];
            if('certifications' in req.body && req.body['certifications'].length>0){
                    for(let i=0;i<req.body['certifications'].length;i++){
                        companyNames.push(req.body['certifications'][i].providedByOrg.toUpperCase());
                    }
                   
                   
            }
            companyNames=Array.from(new Set(companyNames));
            companyIds=await company.find({name:{$in:companyNames}});
            var g=[];
            companyIds.filter(o=>g.push(o.name))
            tempForComp=companyNames.filter(o=>g.indexOf(o)==-1)

         
            if(tempForComp && tempForComp.length>0){
                var companyNamesData=[];
                for(let i=0;i<tempForComp.length;i++){
                    var tempComp={};
                    tempComp['name']=tempForComp[i];
                    companyNamesData.push(tempComp);
                }

                await company.insertMany(companyNamesData).then((docs)=>{
                    for(let i=0;i<docs.length;i++){
                        companyIds.push(docs.slice(i,i+1)[0])
                   }
                }).catch((error)=>{
                    console.log(error,"in inserting experience");      
                });

            }
            g=[];
            locationIds.filter(o=>g.push(o.name))
            var tempForLoc=locationCity.filter(o=>g.indexOf(o)==-1)

            if(tempForLoc && tempForLoc.length>0){
                var locationsData=[];
                for(let i=0;i<tempForLoc.length;i++){
                    var tempLoc={};
                    tempLoc['name']=tempForLoc[i];
                    locationsData.push(tempLoc);
                }

                await location.insertMany(locationsData).then((docs)=>{
                    for(let i=0;i<docs.length;i++){
                        locationIds.push(docs.slice(i,i+1)[0])
                   }
                    console.log("Data inserted",docs) 
                }).catch((error)=>{
                    console.log(error,"in inserting experience");      
                });
            }
            else{

            }

            for(let i=0;i<req.body['experience'].length;i++){
                let temp={};
                //status companyId locationId
                temp['userId']=mongoose.Types.ObjectId(userId);
                temp['Status']='P'
                temp['locationId']=(JSON.parse(JSON.stringify(locationIds))).find(o=>o.name==experienceData[i].locationCity.toUpperCase())._id
                temp['companyId']=(JSON.parse(JSON.stringify(companyIds))).find(o=>o.name==experienceData[i].companyName.toUpperCase())._id
                temp['endDate']=experienceData[i].endDate;
                temp['startDate']=experienceData[i].joiningDate;
                temp['title']=experienceData[i].title;
                temp['workDescription']=experienceData[i].workDesc;
                expData.push(temp);
            }
            console.log("expdta",expData);
            var tempExp={};
            //add userId
            tempExp['userId']=mongoose.Types.ObjectId(userId);
            tempExp['Status']='C'
            tempExp['startDate']=req.body['data']['currentJobStartDate']
            tempExp['title']=req.body['data']['currentJobTitle']
            tempExp['workDescription']=req.body['data']['workDesc']
            tempExp['companyId']=(JSON.parse(JSON.stringify(companyIds))).find(o=>o.name==req.body['data'].currentJobCompany.toUpperCase())._id
            tempExp['locationId']=(JSON.parse(JSON.stringify(locationIds))).find(o=>o.name==req.body['data'].curentJobLoc.toUpperCase())._id
            expData.push(tempExp);
            console.log("tempExp",tempExp);
            if(expData.length>0){
                await experience.insertMany(expData).then((docs)=>{
                    console.log("Data inserted",docs) 
                }).catch((error)=>{
                    console.log(error,"in inserting experience");      
                });
            }
        }
        const educationData=req.body.education;
        if(educationData && educationData.length>0){
            var educData=[];
           

            for(let i=0;i<req.body['education'].length;i++){
                let temp={};
                temp['name']=companyIds.find(o=>o.name==educationData[i].name.toUpperCase())._id
                temp['startDate']=educationData[i].startDate
                temp['endDate']=educationData[i].endDate;
                temp['userId']=mongoose.Types.ObjectId(userId);
                temp['location']=(JSON.parse(JSON.stringify(locationIds))).find(o=>o.name==educationData[i].locationCity.toUpperCase())._id
                // temp['userId']='';
                temp['courseName']=educationData[i].courseName;
                temp['marksCategory']=educationData[i].marksCategory;
                temp['instCategory']=educationData[i].categoryOptions;
                temp['marks']=educationData[i].marks;
                educData.push(temp);
            }
            await education.insertMany(educData).then((docs)=>{
                
                docs.map((o)=>educationInst.push(o.name))
                console.log("Data inserted",docs) 
            }).catch((error)=>{
                console.log(error,"in inserting experience");      
            });
        }

        if('certifications' in req.body){
         const certificationsData=req.body.certifications;
        if(certificationsData && certificationsData.length>0){
            var certifData=[]
            for(let i=0;i<certificationsData.length;i++){
                let temp={};
                temp['company']=companyIds.find(o=>o.name==certificationsData[i].providedByOrg.toUpperCase())._id                
                temp['userId']=mongoose.Types.ObjectId(userId);
                temp['link']=certificationsData[i].link;
                temp['fileUploaded']=certificationsData[i].certifFile;
                temp['skill']=certificationsData[i].skill;
                temp['date']=certificationsData[i].date;
                certifData.push(temp);
            }
            if(certifData.length>0){
                await certifications.insertMany(certifData).then((docs)=>{
                    console.log("Data inserted",docs) 
                }).catch((error)=>{
                    console.log(error,"in inserting experience");      
                });
            }
        }


        }
        if(companyIds && companyIds.length>0){
            const updatedUserIdData=await user.updateOne({_id:mongoose.Types.ObjectId(userId)},{$set:{ organization:companyIds.find(o=>o.name==data.currentJobCompany.toUpperCase())._id}});
        }
       


        const temp={"data":{"name":"kkkk","email":"kkk@gmail.com","password":"Priya@30","confirmPassword":"Priya@30","occupation":"","gender":"M","profilePic":"","currentJobTitle":"intern","currentJobCompany":"ggg","currentJobStartDate":"2023-05-01","curentJobLoc":"hyderabad","workDesc":"pppp","phNum":"7051121148"},"experience":[{"title":"intern","companyName":"cyberxplore","joiningDate":"2022-02-17","endDate":"2022-12-21","workDesc":"sclaable apis","locationCity":""},{"title":"pppp","companyName":"LEO1","joiningDate":"2022-11-28","endDate":"2023-05-04","workDesc":"kkkkk"},{"title":"pppp","companyName":"pariksha","joiningDate":"2021-05-11","endDate":"2023-11-30","workDesc":"description 88"}],"education":[{"category":"","categoryOptions":"C","name":"lpu","locationCity":"phagwara","startDate":"2019-07-02","endDate":"2023-05-04","marks":"78.6","courseName":"b tech cse","marksCategory":"P"},{"categoryOptions":"C","name":"kk","locationCity":"lll","startDate":"2023-05-22","endDate":"2023-05-17","marks":"90","courseName":"tttt","marksCategory":"P"},{"categoryOptions":"S","name":"mvm","locationCity":"jammu","startDate":"2023-05-01","endDate":"2023-05-21","marks":"96","courseName":"","marksCategory":"P"}],"skills":[],"certifications":[{"name":"yyyyy","link":"hgdfhgj","skill":"react","date":"2023-05-09","providedByOrg":"hcakerrnak","certifFile":""},{"name":"dsa cpp","link":"hhhh","skill":"cpp","date":"2023-05-03","providedByOrg":"cb","certifFile":""},{"name":"uuuu","link":"iiiioiooo","skill":"wwww","date":"2023-05-09","providedByOrg":"CODING BLOCKS","certifFile":""},{"name":"qawqww","link":"errfgre","skill":"jbvfdj","date":"2023-06-09","providedByOrg":"ppopop","certifFile":"C:\\fakepath\\todayTask.txt"}]}
        res.send({Error:'NA',status:String(userId),locationCity:locationCity,companyNames:companyNames,educationInst:educationInst});
    }
    catch(e){
        console.log("err",e);
        res.send({Error:String(e),status:'error in signup api'});

    }
}


export const fetchSkills=async(req,res)=>{
  try{
    const skillsData=await skills.find({});
    res.send({'Error':'NA',Skills:skillsData});
    }
    catch(err){
        console.log("err in fetchSkills ",err)
        res.send({'Error':'Error occurred'+String(err),Skills:[]});
    }
}