import React from 'react'
import { useEffect,useState } from 'react'
import {useParams} from 'react-router-dom'
import io from 'socket.io-client';
const url="http://localhost:8000"


const ViewProfile = () => {
  const socket=io.connect("http://localhost:8000");
  const id=useParams().id;
  const userId=localStorage.getItem("userId");
  const [data,setData]=useState([]);
  const[skillsData,setSkillsData]=useState([]);
  const[educationData,setEducationData]=useState([]);
  const[experienceData,setExperienceData]=useState([]);
  const[certificationsData,setCertificationsData]=useState([]);
  const[followerData,setFollowerData]=useState([]);
  const[connectionData,setConnectionData]=useState([]);
  useEffect(()=>{
   
    (async()=>{
     await fetchUserDetails(id);
    })()
  },[])

  const fetchUserDetails=async(id)=>{
    try{
      const resp=await fetch(url+`/getProfileDetails/${id}/${userId}`,{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`
        },
        method:'GET'
        
      })
      const res=await resp.json();
      if(res.Error=='NA'){
        setData(res.userData);
        setSkillsData(res.skillsData);
        setEducationData(res.educationDetails);
        setExperienceData(res.experienceDetails);
        setCertificationsData(res.certificationsData);
        setFollowerData(res.followerData);
        setConnectionData(res.connectionData);
      }
      if(res.error=='Invalid token' || res.error=='Authentication required'){
        window.location='/login';
       }
    }
    catch(err){
      console.log("err",err);
    }
  }

  const withdrawConnectionRequest=async()=>{
    try{

    const resp=await fetch(url+"/withdrawConnectionRequest",{
      headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`
      },
      body:JSON.stringify({
      sender:userId,
      receiver:id

      }),
      method:'POST'
      })
      const res=await resp.json();
      if(res.Error=='NA'){
         setConnectionData([]);
      }
      if(res.error=='Invalid token' || res.error=='Authentication required'){
        window.location='/login';
       }

      }
      catch(err){
        console.log("err",err);
      }
  }

  const sendConnectionRequest=async()=>{
    try{
 
        const resp=await fetch(url+"/sendConnectionRequest",{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify({
            sender:userId,
            receiver:id

            }),
            method:'POST'
        })
        const res=await resp.json();
        if(res.Error=='NA'){
          setConnectionData([res.connecnRequest]);
          await socket.emit('recieve_connReq', {
            id: socket.id,
            socketID: socket.id,
            receiver:id,
            sender:userId,
            profilePic:data.profilePic,
            headline:data.userheadline,
            name:data.Name
          });
        }
        if(res.error=='Invalid token' || res.error=='Authentication required'){
          window.location='/login';
         }

    }
    catch(err){
      console.log("err",err);
    }
  }

  const removeConnection=async()=>{
    try{
    const resp=await fetch(url+"/removeConnection",{
      method:'POST',
      headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`
      },
      body:JSON.stringify({
          sender:userId,
          receiver:id
          })
      })
      const res=await resp.json();
          if(res.Error=='NA'){
              setConnectionData([]);
          }
          if(res.error=='Invalid token' || res.error=='Authentication required'){
            window.location='/login';
           }
        }
    catch(err){
      console.log("err is",err);
    }
  }

  const followUser=async(id)=>{
    try{
      const res=await fetch(url+"/followUser",{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
        },
        body:JSON.stringify({
            follower:id,//person who is followed
            followedBy:userId,//person who follows
            flag:true//flag so that in backend api we dont populate 
        })
     })

     const resp=await res.json();
     if(resp.Error=='NA'){
      
      setFollowerData([resp.status]);
     }
     if(resp.error=='Invalid token' || resp.error=='Authentication required'){
      window.location='/login';
     }
    }
    catch(err){
      console.log("err",err);
    }
  }

  const unfollowUser=async(id)=>{
    try{
       
      const resp=await fetch(url+"/unfollowUser",{
     method:'POST',
     body:JSON.stringify({
       follower:id,//person who is followed
       followedBy:userId//person who follows
     }),
     headers:{
       'Content-Type':'application/json',
       'Authorization':`Bearer ${localStorage.getItem("token")}`
     }
      })
      const res=await resp.json();
      if(res.Error=='NA'){
        setFollowerData([]);
      }
      if(res.error=='Invalid token' || res.error=='Authentication required'){
        window.location='/login';
       }
   }
   catch(err){
       console.log("err",err);
   }
  }
  const dateFormatRegex = /^\d{3}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

  return (

    <div>
  <div style={{ backgroundColor: '#4FD9F4', padding: '20px', marginBottom: '30px', borderRadius: '8px' }}>
    {
      data ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px',textTransform:'capitalize' }}>{data.Name}</div>
            <img src={data.profilePic} width={150} height={150} style={{ borderRadius: '50%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>{data.headline}</div>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>{data.organization}</div>
            {data.numOfConnections && <div style={{ fontSize: '14px', marginBottom: '10px' }}>{data.numOfConnections} Connections</div>}
            {data.numOfFollowers && <div style={{ fontSize: '14px', marginBottom: '10px' }}>{data.numOfFollowers} Followers</div>}
          </div>
          {
            followerData.length > 0 ? (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>Following</div>
                <button onClick={() => { unfollowUser(followerData[0].follower) }} style={{ padding: '12px 24px', backgroundColor: '#289DB5', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Unfollow</button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button onClick={() => { followUser(id) }} style={{ padding: '12px 24px', backgroundColor: '#289DB5', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Follow</button>
              </div>
            )
          }
          {
            connectionData.length > 0 && connectionData[0].status === 'S' ? (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>Connected</div>
                <button onClick={() => { window.location = `/Messages?userId=${id}` }} style={{ padding: '12px 24px', backgroundColor: '#289DB5', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' }}>Message</button>
                <button onClick={() => { removeConnection() }} style={{ padding: '12px 24px', backgroundColor: 'pink', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Remove Connection</button>
              </div>
            ) : connectionData.length === 0 ? (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button onClick={() => { sendConnectionRequest() }} style={{ padding: '12px 24px', backgroundColor: '#289DB5', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Connect</button>
              </div>
            ) : connectionData.length > 0 && connectionData[0].status === 'P' ? (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>Connection Request Sent</div>
                <button onClick={() => { withdrawConnectionRequest() }} style={{ padding: '12px 24px', backgroundColor: '#289DB5', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Withdraw Connection Request</button>
              </div>
            ) : null
          }
        </div>
      ) : null
    }

    {
      experienceData.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Experience</div>
          {
            experienceData.map((o) => (
              <div key={o.id} style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'pink', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{o.startDate!=undefined ? new Date((o.startDate)).toLocaleString("en-us", { month: "long", year: "numeric" }) :(null)}{o.Status === 'P' ? o.endDate!=undefined ? "-"+new Date((o.endDate)).toLocaleString("en-us", { month: "long", year: "numeric" }) : null :' - Present'}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{o.title}</div>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>{o.workDescription}</div>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>{o.companyName}</div>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>{o.companyId}</div>
              </div>
            ))
          }
        </div>
      ) : null
    }

    {
      educationData.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Education</div>
          {
            educationData.map((o) => (
              <div key={o.id} style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'pink', borderRadius: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{o.name}</div>
                <div style={{ fontSize: '16px', marginBottom: '10px' }}>{new Date((o.startDate)).toLocaleString("en-us", { month: "long", year: "numeric" })}-{new Date((o.endDate)).toLocaleString("en-us", { month: "long", year: "numeric" })}</div>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>{o.courseName}</div>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>{o.marksCategory === 'P' ? 'Percentage' : 'Marks'}-{o.marks}</div>
              </div>
            ))
          }
        </div>
      ) : null
    }

    {
      certificationsData.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Certifications</div>
          {
            certificationsData.map((o) => (
              <div key={o.id} style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'pink', borderRadius: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{o.skill}</div>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <img src={o.fileUploaded} width={150} height={150} style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                </div>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>{new Date((o.date)).toLocaleString("en-us", { month: "long", year: "numeric" })}</div>
              </div>
            ))
          }
        </div>
      ) : null
    }
  </div>
</div>

  )
}

export default ViewProfile
