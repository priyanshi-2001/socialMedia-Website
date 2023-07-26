import React from 'react'
import { useEffect,useState } from 'react'
import {Button,Input, OutlinedInput }from '@mui/material';
import SetPassword from './SetPassword';
import BasicSignup from './BasicSignup';
import CurrentJob from './CurrentJob';
import AddExperience from './AddExperience';
import AddEducation from './AddEducation';
import AddSkills from './AddSkills';
import AddCertifications from './AddCertifications';
import ProfilePicUpload from './ProfilePicUpload';
const url='http://localhost:8000/';
const MultiStepForm = () => {
    const[isuserlogIn,setIsUserLogIn]=useState(false);
    const[page,setPage]=useState(0);
    const[disableNext,setDisableNext]=useState(false);
    const[pageNames,setPagenames]=useState(["Signup","SetPassword","currentJob","Experience","Education","Skills","certifications","profilePicUpload"]);
    const[data,setData]=useState({
      name:"",
      email:"",
      password:"",
      confirmPassword:"",
      occupation:"",
      gender:"",
      profilePic:"",
      currentJobTitle:"",
      currentJobCompany:"",
      currentJobStartDate:"",
      curentJobLoc:"",
      workDesc:"",
      phNum:""
    });
    const[profilePic,setProfilePic]=useState('');
    const[experience,setExperience]=useState();
    const [education,setEducation]=useState();
    const[certifications,setCertifications]=useState();
    const[isFresher,setFresher]=useState(false);
    const[skills,setSkills]=useState();
    const validation=()=>{
      
       
      setPage((currPage) => currPage + 1)
    };

    const handleFresher=(val)=>{
          setFresher(val);
    }
    
    const handleCallback=(val)=>{
      if(page==0){
           if(val.name=="" || val.name.length>=20 || val.name.length==1){
            document.getElementById("errorName").innerHTML="Please enter valid Name(Length should be not shorter than 2 and not greater than 20)";
           }
           else{
            document.getElementById("errorName").innerHTML="";
           }
           if( (val.email=="" || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val.email))===false) && (document.getElementById("errorName").innerHTML==="")){
            document.getElementById("errorEmail").innerHTML="Please enter valid email";
           }
           else{
            document.getElementById("errorEmail").innerHTML="";
           }
           if( (val.phNum=="" || val.phNum.length<10 || val.phNum.length >10 ) && (document.getElementById("errorEmail").innerHTML==="" &&  document.getElementById("errorName").innerHTML==="")){
            document.getElementById("errorPhNum").innerHTML="Please enter valid Phone Number(length must be 10)";
           }
           else{
            document.getElementById("errorPhNum").innerHTML="";
           }
           if(val.gender=="" && (document.getElementById("errorEmail").innerHTML==="" ||  document.getElementById("errorName").innerHTML==="" ||  document.getElementById("errorPhNum").innerHTML==="")){
            document.getElementById("errorGender").innerHTML="Please Select Gender";
           }
           else{
            document.getElementById("errorGender").innerHTML="";
           }
           if(val.email!=="" && val.name!=="" && val.name.length!=1 && val.name.length<=20  && val.errorPhNum!=="" && val.phNum.length==10 && val.gender!="" && (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val.email))===true){
            setData(val);
            setDisableNext(false);
            return;
           }
           setDisableNext(true);

      }

      if(page==1){
        if(val.password=="" || val.password.length<8 || val.password.includes('@')==false || /[A-Z]/.test(val.password)===false || /\d/.test(val.password)===false){
          document.getElementById("errorPwd").innerHTML="Password Length must be 8, must have one special symbol and one capital letter and one number"
        }
        else{
          document.getElementById("errorPwd").innerHTML="";
        }
        if(val.confirmPassword!==val.password && document.getElementById("errorPwd").innerHTML==""){
          document.getElementById("errorConfirmPwd").innerHTML="Confirm Password and Password must be same";
        }
        else{
          document.getElementById("errorConfirmPwd").innerHTML="";
        }
        if(val.password!=="" && val.password.length==8 && val.password.includes('@')==true && /[A-Z]/.test(val.password)===true && /\d/.test(val.password)===true
        && val.confirmPassword===val.password){
          setData(val);
          setDisableNext(false);
          return;
         }
         setDisableNext(true);
      }
      if(page==2){
        // if(val.currentJobTitle==""){
        //   document.getElementById("errorcurrentJobTitle").innerHTML="Please Enter  Current Job Title"
        // }
        // else{
        //   document.getElementById("errorcurrentJobTitle").innerHTML=""
        // }
        // if(val.currentJobCompany=="" && document.getElementById("errorcurrentJobTitle").innerHTML===""){
        //   document.getElementById("errorcurrentJobCompany").innerHTML="Please  Enter Current Company's Name"
        // }
        // else{
        //   document.getElementById("errorcurrentJobCompany").innerHTML=""
        // }
        // if(val.currentJobStartDate=="" && document.getElementById("errorcurrentJobTitle").innerHTML==="" && document.getElementById("errorcurrentJobCompany").innerHTML===""){
        //   document.getElementById("errorcurrentJobStartDate").innerHTML="Please your  Joining Date in this Company"
        // }
        // else{
        //   document.getElementById("errorcurrentJobStartDate").innerHTML=""
        // }
        // if(val.workDesc=="" && document.getElementById("errorcurrentJobTitle").innerHTML==="" && document.getElementById("errorcurrentJobCompany").innerHTML==="" && document.getElementById("errorcurrentJobStartDate").innerHTML===""){
        //   document.getElementById("errorworkDesc").innerHTML="Please Enter Work Description in this Company"
        // }
        // else{
        //   document.getElementById("errorworkDesc").innerHTML=""
        // }
        // if(val.curentJobLoc=="" && document.getElementById("errorcurrentJobTitle").innerHTML==="" && document.getElementById("errorcurrentJobCompany").innerHTML==="" && document.getElementById("errorcurrentJobStartDate").innerHTML==="" && document.getElementById("errorworkDesc").innerHTML===""){
        //   document.getElementById("errorcurentJobLoc").innerHTML="Please Enter Current Job Location"
        // }
        // else{
        //   document.getElementById("errorcurentJobLoc").innerHTML=""
        // }
        // if(val.currentJobTitle!="" && val.currentJobCompany!=="" && val.currentJobStartDate!=="" && val.workDesc!="" && val.curentJobLoc!==""){
        //   setData(val);
        //   setDisableNext(false);
        //   return;
        // }
        // setDisableNext(true);

        setData(val);
        setDisableNext(false);
        return;
      }
      if(page==3){
       
          setExperience(val);
          setDisableNext(false);
          return;
      }
      if(page==4){
        setEducation(val);
        setDisableNext(false);
      }
      if(page==5){
        // console.log("val for skills",val);
        setSkills(val);
        setDisableNext(false);
      }
      if(page==6){
        // console.log("value of certif injjj",val);
        setCertifications(val);
        setDisableNext(false);
      }
      if(page==7){
        // console.log("val iskk",val);
        // setProfilePic(val);
        setData((prev)=>({...prev,profilePic:val}));
        setDisableNext(false);
      }
      
    }

    const handleNextPage=()=>{
    
      if(page==0){
        return <BasicSignup  data={data}  newData={handleCallback}/>
      }
      if(page==1){
        return <SetPassword  data={data}  newData={handleCallback}/>
      }
      if(page==2){
        return <CurrentJob  data={data}  newData={handleCallback}/>
      }
      if(page==3){
        return <AddExperience  data={data}   newData={handleCallback}  isFresher={isFresher} handleFresher={handleFresher}/>
      }
      if(page==4){
        return <AddEducation  data={data}  newData={handleCallback} />
      }
      if(page==5){
        return <AddSkills  data={data}  newData={handleCallback} />
      }
      if(page==6){
        return <AddCertifications  data={data}  newData={handleCallback} />
      }
      if(page==7){
        return <ProfilePicUpload  data={data} experience={experience} education={education} skills={skills} certifications={certifications} newData={handleCallback} />
      }

    }

    const addData=async()=>{
      try{
        const res=await fetch(url+"signup",{
          method:"POST",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            data:data,
            experience:experience,
            education:education,
            skills:skills,
            certifications:certifications
            // profilePic:profilePic
          })
        });
        const resp=await res.json();

        // console.log("resp",resp);
        if(resp.Error==="NA"){
        
          
          window.location.href="/login";
          
        }

         
      }
      catch(err){
       console.log("err",err,"in addData")
      }
    }
  
  return (
    <div>
      <div>
          <progress value={page/(pageNames.length-1)}></progress>
      </div>
      <div>
        {pageNames[page]}
      </div>
      <div>
      {handleNextPage()}
      </div>


      <div>

        {page==0?(null):(
          <Button  onClick={()=>{setPage((currPage) => currPage - 1)}}>Previous</Button>
        )}
        
       {page!=pageNames.length-1?(
        <Button disabled={disableNext} onClick={()=>{validation()}}>Next</Button>
       ):(null)} 
        {
         page== pageNames.length-1?(
          <Button onClick={()=>{addData()}}>Submit All Details</Button>
         ):(null)
        }
        </div>
      </div>
    )

}

export default MultiStepForm
