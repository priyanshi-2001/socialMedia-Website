import React from 'react';
import { useState,useEffect } from 'react';
import {Snackbar,Alert}  from '@mui/material';
import { io } from 'socket.io-client';
import moment from 'moment'
import { Check, Close } from '@mui/icons-material';
const url="http://localhost:8000";

const Notifications = () => {
  const userId=localStorage.getItem("userId");
  const socket=io.connect('http://localhost:8000');
  const[showNotification,setShowNotification]=useState(false);
  const[notificationMsg,setNotificationMsg]=useState('');
  const [notification,setNotifications]=useState([]);
  useEffect(()=>{
    (async()=>{
       await fetchNotifications(localStorage.getItem("userId"));
    })()

  },[])

  useEffect(()=>{
    socket.on("receive_connReqNotif",(data)=>{
      setShowNotification(true);
      setNotificationMsg(data.notification.description);
      setNotifications((prev)=>([data.notification,...prev]));
    })
  },[])

  useEffect(()=>{
   socket.on("connectionRequestAcceptedNotify",(data)=>{
    setShowNotification(true);
    setNotificationMsg(data.notification.description);
    setNotifications((prev)=>([data.notification,...prev]));
  })
  },[])

  useEffect(()=>{
    socket.on("connectionRequestAcceptedMsg",(data)=>{
     setShowNotification(true);
     setNotificationMsg(data.notification.description);
     setNotifications((prev)=>([data.notification,...prev]));
   })
   },[])
 

  useEffect(()=>{
    (async()=>{
      await  socket.emit('listeningNotifications', {
        id: socket.id,
        sender:localStorage.getItem("userId")
      });

    })()
  },[])


  const fetchNotifications=async(id)=>{
    try{
          const resp=await fetch(url+`/fetchNotifications/${id}`,{
            method:'GET',
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            }
          })
          const res=await resp.json();
          if(res.Error=='NA'){
            setNotifications(res.data);
          }
          if(res.error=='Invalid token' || res.error=='Authentication required'){
            window.location='/login';
           }
  

    }
    catch(err){
      console.log("err is",err);
    }
  }
  const handleClose=()=>{
    setShowNotification(false);
    setNotificationMsg('');
  }

  const handleAcceptConnection=async(sender,receiver,id)=>{
    try{
     
      // const temp=[...notification];
      // console.log("temp is",temp,"sender",sender,"rec",receiver,"id",id);
      // var updatedData=temp.filter((o)=>o._id!=id);
      // console.log("b is",updatedData)
      // setNotifications(updatedData);

      // await socket.emit("connectionRequestAccepted",{
      //   id: socket.id,
      //   sender:sender,
      //   name:localStorage.getItem("Name"),
      //   profilePic:'',
      //   headline:'headline hhh',
      //   receiver:localStorage.getItem("userId")
      // })
         const resp=await fetch(url+"/acceptConnectionRequest",{
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          },
          method:'POST',
          body:JSON.stringify({
            receiver:receiver,
            sender:sender
          })
         });
         const res=await resp.json();
         if(res.Error=='NA'){
           const temp=[...notification];
      var updatedData=temp.filter((o)=>o._id!=id);
      setNotifications(updatedData);

      await socket.emit("connectionRequestAccepted",{
        id: socket.id,
        sender:res.updatedSenderData._id,
        receiver:localStorage.getItem("Name")
      })
      }
      if(res.error=='Invalid token' || res.error=='Authentication required'){
        window.location='/login';
       }
    }
    catch(err){
      console.log("err",err);
    }
  }

  const handleRejectConnection=async(sender,receiver,id)=>{
    try{
     
      
      // await socket.emit("connectionRequestRejected",{
      //   id: socket.id,
      //   sender:sender,
      //   // sender:res.updatedSenderData._id,
      //   receiver:localStorage.getItem("Name")
      // })
      const resp=await fetch(url+"/rejectConnectionRequest",{
        headers:{
          'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
          receiver:receiver,
          sender:sender
        })
       });
       const res=await resp.json();
       if(res.Error=='NA'){
        const temp=[...notification];
        var updatedData=temp.filter((o)=>o._id!=id);
        setNotifications(updatedData);
       }
    }
    catch(err){
      console.log("err",err);
    }
  }

  return (
   
    <div style={{ backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '10px' }}>
  <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Notifications</h2>
  <Snackbar open={showNotification} autoHideDuration={6000} onClose={()=>{handleClose()}}>
    <Alert onClose={()=>{handleClose()}} sx={{ width: '100%' }}>
      {notificationMsg}
    </Alert>
  </Snackbar>

  {notification.length > 0 ? (
    <div>
      {notification.map((o) => (
        <ul style={{ marginTop: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <div>{o.description}</div>
          <div>{o._id}</div>
          <div>{o.ref3 ? <p style={{ fontSize: '14px', marginBottom: '5px' }}>{new Map(JSON.parse(o.ref3)).get('headline')}</p> : null}</div>
          <div>{o.ref3 ? <img src={new Map(JSON.parse(o.ref3)).get('profilePic')} width={25} height={25} alt="Profile Pic" style={{ borderRadius: '50%' }} /> : null}</div>
          <div>{moment.utc(o.dateTime).local().startOf('seconds').fromNow()}</div>
          {o.name === 'connectionReceived' ? (
            <div>
              <Check onClick={()=>{handleAcceptConnection(o.ref1, o.userId, o._id)}} style={{ cursor: 'pointer', color: 'green' }} />
              <Close onClick={()=>{handleRejectConnection(o.ref1, o.userId, o._id)}} style={{ cursor: 'pointer', color: 'red', marginLeft: '5px' }} />
            </div>
          ) : null}
        </ul>
      ))}
    </div>
  ) : null}
</div>


  )
}

export default Notifications
