import React from 'react'
import { useState,useEffect } from 'react'
import { Button } from '@mui/material'
const url="http://localhost:8000";

const MessagesMainWindow = () => {
const[chatIds,setChatIds]=useState([]);
const userId=localStorage.getItem('userId');
const[connections,setConnections]=useState([]);

  useEffect(()=>{
    (async()=>{
      await fetchChatsUsers();

    })()

  },[])

  useEffect(()=>{
    (async()=>{
      await fetchConnections()

    })()
  },[])

  const fetchConnections=async()=>{
    try{
       const resp=await fetch(url+`/fetchConnections/${localStorage.getItem('userId')}`,{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`
        },
        method:'GET'
       })
       const res=await resp.json();
       if(res.Error=='NA'){
        setConnections(res.connection);
       }
       if(res.error=='Invalid token' || res.error=='Authentication required'){
        window.location='/login';
       }

    }
    catch(err){
      console.log("err",err);
    }
  }

  const fetchChatsUsers=async()=>{
    try{
        const resp=await fetch(url+`/fetchChatsUsers/${localStorage.getItem("userId")}`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          }
        })
        const res=await resp.json();
        if(res.Error=='NA'){
          setChatIds(res.users);
        }
        if(res.error=='Invalid token' || res.error=='Authentication required'){
          window.location='/login';
         }

    }
    catch(err){
      console.log("err",err);
    }
  }

  return (
    <div>
          
{
  chatIds.length > 0 ? (
    <div style={{ backgroundColor: 'pink', width: '40%', padding: '20px', borderRadius: '10px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Your Chats</h2>
      {chatIds.map((o) => (
        <div
          key={o._id}
          style={{
            cursor: 'pointer',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => { window.location = `/Messages?userId=${o._id}` }}
        >
          <div style={{ marginRight: '10px' }}>
            <img
              src={o.profilePic}
              alt="Profile Pic"
              style={{ width: '85px', height: '85px', borderRadius: '50%' }}
            />
          </div>
          <div>
            <h3 style={{ marginBottom: '5px', fontSize: '18px', fontWeight: 'bold' }}>{o.Name}</h3>
            <p style={{ marginBottom: '5px', fontSize: '14px', color: 'gray' }}>{o.headline}</p>
            <p style={{ fontSize: '14px', color: 'gray' }}>{o._id}</p>
          </div>
        </div>
      ))}
    </div>
  ) : null
}

       
    


    </div>
  )
}

export default MessagesMainWindow