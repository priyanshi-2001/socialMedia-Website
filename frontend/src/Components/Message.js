import React from 'react'
import { useState,useEffect } from 'react';
import io from 'socket.io-client';
import { Button } from '@mui/material';
const url="http://localhost:8000/";

const Message = () => {
  const socket = io.connect('http://localhost:8000');
  const[message,setMessage]=useState('');
  const[data,setData]=useState('');
  const[chats,setChats]=useState([]);
  const[sender,setSenderId]=useState(localStorage.getItem("userId"));
  const[receiver,setReceiver]=useState(new URLSearchParams(window.location.search).get('userId'));
 
  const chatButton= {
    padding: '10px',
    marginLeft: '10px',
    backgroundColor: '#4d94ff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }

  const timestampStyle = {
    fontSize: '12px',
    color: '#888888',
    marginTop: '5px',
  };

  useEffect(()=>{
   (async()=>{
    await socket.emit('listeningNotifications', {
      name: 'username',
      id: socket.id,
      socketID: socket.id,
      sender:sender
    });
    

   })()
  },[])
const handleSendMsg=async()=>{
  const resp=await fetch(url+"sendMessage",{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${localStorage.getItem("token")}`
    },
    body:JSON.stringify({
      receiver:receiver,
      sender:sender,
      message:message
    })
  });
  const res=await resp.json();
  if(res.Error=='NA'){
    // console.log("new chat is",res.chats);
    setChats((prev)=>([...prev,res.chats]));
    setMessage('');
    // console.log("chats updated are",chats);
  }
  if(res.error=='Invalid token' || res.error=='Authentication required'){
    window.location='/login';
   }


  
  await socket.emit('chatMessage', {
    text: message,
    name: 'username',
    id: socket.id,
    socketID: socket.id,
    receiver:receiver,
    sender:sender
  });
  
 
  
 

}

useEffect(()=>{
(async()=>{
  const resp=await fetch(url+"getChats/"+receiver+"/"+sender,{
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${localStorage.getItem("token")}`
    },

  })
  const res=await resp.json();
  if(res.error=='Invalid token' || res.error=='Authentication required'){
    window.location='/login';
   }
  else{
  setChats(res.chats);
  }
})()
},[])

useEffect(() => {
  socket.on("receive_message", (data) => {
    // console.log("data we got is",data);
    setChats((prev)=>[...prev,{receiver:sender,sender:receiver,msg:data.text,date:data.date}])
    // console.log("chats here3",chats);
  });

}, [socket]);

const handleKeyPress = async(e) => {
  if (e.key === 'Enter') {
    await handleSendMsg();
  }
};

  return (
    <div style={{overflowY:'auto'}}>
      <div>
        <div>{chats && chats.length>0?(
          <div style={{backgroundColor:'#b3b3cc',width:'100%'}}>
            {chats[0].sender && chats[0].receiver?(
            chats[0].sender._id==sender?(
              <div>
                {/* {chats[0].receiver._id} */}
                <img src={chats[0].receiver.profilePic} onClick={()=>{window.location.href=`/viewProfile/${chats[0].receiver._id}/${localStorage.getItem("userId")}`}} width={50} height={50}/>
                {chats[0].receiver.headline}

              </div>
            ):(<div>
              {/* {chats[0].sender._id} */}
              <img src={chats[0].sender.profilePic}width={50} height={50}/>
                {chats[0].sender.headline}

            </div>)
            
            ):(null)}

          </div>
        ):(null)}</div>

        
        {/* {console.log("in uu",chats)} */}

        <div>
        {chats?chats.map((o)=>{
          return(
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '10px',
              justifyContent: o.sender._id==sender || o.sender==sender? 'flex-end' : 'flex-start',
              // marginLeft:o.sender._id==sender?'calc(100% - 90%)':'',columnGap:'100px',backgroundColor:'pink',width:'300px'
              }}>

          <div
          style={{ padding: '10px',
          borderRadius: '10px',
          backgroundColor: o.sender._id==sender || o.sender==sender? '#3399ff' : '#e0e0e0',
          color: o.sender._id==sender || o.sender==sender? '#ffffff' : '#000000',
          maxWidth: '70%',
          wordWrap: 'break-word',}}
          
          >{o.msg}</div>
          <div style={timestampStyle}>{new Date(o.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          </div>
          )
        }):(null)}

        <div style={{display: 'flex',
  marginTop: '10px'}}>
         <input type="text" style={{
          flexGrow: 1,
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px'
         }} 
         onKeyDown={handleKeyPress}
         placeholder="Enter Message" value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
         <button  style={chatButton}onClick={()=>{handleSendMsg()}}>Send</button>
         </div>
        </div>

      </div>
     
    </div>
  )
}

export default Message
