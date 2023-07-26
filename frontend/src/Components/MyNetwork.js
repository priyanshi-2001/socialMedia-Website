import React from 'react'
import { useState,useEffect } from 'react'
import io from 'socket.io-client';
import { Button } from '@mui/material';
const url="http://localhost:8000/"
const MyNetwork = () => {
const socket=io.connect('http://localhost:8000');
const[connections,setConnections]=useState('');
const[knownPeople,SetKnownPeople]=useState('');
const userId=localStorage.getItem("userId");
const companyNames=localStorage.getItem("companyNames");
const[showAll,setShowAll]=useState(new Map());

    useEffect(()=>{
        (async()=>{
            await fetchConnections()

        })()
    },[])
 
    const handleWithdrawConnectionReq=async(id,companyName)=>{
        try{
           
            const resp=await fetch(url+"withdrawConnectionRequest",{
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
                const updatedConnections = { ...connections }; 
                const temp = [...updatedConnections.data[companyName]]; 
            
                temp.forEach((o) => {
                  if (o._id === id) {
                    o.ConnectionReqPending = false;
                  }
                });
            
                updatedConnections.data[companyName] = temp; 
                setConnections(updatedConnections); 
    
            }
            if(res.error=='Invalid token' || res.error=='Authentication required'){
              window.location='/login';
             }
  

        }
        catch(err){
            console.log("err",err);
        }
    }

    const sendConnectionRequest=async(id,companyName,profilePic,headline)=>{
        try{
           

            // const updatedConnections = { ...connections }; 
            // const temp = [...updatedConnections.data[companyName]]; 
        
            // temp.forEach((o) => {
            //   if (o._id === id) {
            //     o.ConnectionReqPending = true;
            //   }
            // });
        
            // updatedConnections.data[companyName] = temp; 
            // setConnections(updatedConnections); 
           
          
        const resp=await fetch(url+"sendConnectionRequest",{
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
            const updatedConnections = { ...connections }; 
            const temp = [...updatedConnections.data[companyName]]; 
        
            temp.forEach((o) => {
              if (o._id === id) {
                o.ConnectionReqPending = true;
              }
            });
        
            updatedConnections.data[companyName] = temp; 
            setConnections(updatedConnections); 
            await socket.emit('recieve_connReq', {
              id: socket.id,
              socketID: socket.id,
              receiver:id,
              sender:userId,
              profilePic:profilePic,
              headline:headline,
              name:localStorage.getItem('Name')
            });

         }
        }
        catch(err){
            console.log("err",err);
        }
    }

  const fetchConnections=async()=>{
    try{
       const resp=await fetch(url+"fetchConnectionsAndKnownPeople/"+userId+"/"+companyNames,{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
        },
        method:'GET',
       })
       const res=await resp.json();
       if(res.Error=='NA'){
        setConnections(res);

       }
       if(res.error=='Invalid token' || res.error=='Authentication required'){
        window.location='/login';
       }


    }
    catch(err){
        console.log("err",err);
    }
  }

  const handleSeeAll=(p)=>{
    const newMap=new Map(showAll);
    newMap.set(p,true);
    setShowAll(newMap);
  }

  const handleSeeLess=(p)=>{
    const newMap=new Map(showAll);
    newMap.delete(p);
    setShowAll(newMap);
  }

 const handleRemoveConnection=async(sender,receiver,id)=>{
    try{
       
         
        const resp=await fetch(url+"removeConnection",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify({
                sender:sender,
                receiver:receiver
            })
        })
        const res=await resp.json();
        if(res.Error=='NA'){
            const tempData={...connections};
            const temp=[...tempData.connection];
            var updatedData=temp.filter((o)=>o._id!=id);
            tempData.connection=updatedData;
            setConnections(tempData);
            // console.log("tempo is",temp,"t is",updatedData,"tempData is",tempData);
        }
        if(res.error=='Invalid token' || res.error=='Authentication required'){
          window.location='/login';
         }

    }
    catch(err){
        console.log("err",err);

    }
 }

 const unFollowUser=async(id)=>{
    try{
       
       const resp=await fetch(url+"unfollowUser",{
      method:'POST',
      body:JSON.stringify({
        follower:id,
        followedBy:userId
      }),
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem("token")}`
      }
       })
       const res=await resp.json();
       if(res.Error=='NA'){
        const tempData={...connections};
        const temp=[...tempData.followersData];
        var updatedData=temp.filter((o)=>o.follower._id!=id);
        tempData.followersData=updatedData;
        setConnections(tempData);
        console.log("tempo is",temp,"t is",updatedData,"tempData is",tempData);
       }
       if(res.error=='Invalid token' || res.error=='Authentication required'){
        window.location='/login';
       }

    }
    catch(err){
        console.log("err",err);
    }
 }

  const followUser=async(id,companyName)=>{
    try{
    console.log("id in followUser is",id);
   
     const res=await fetch(url+"followUser",{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
        },
        body:JSON.stringify({
            follower:id,//person who is followed
            followedBy:userId//person who follows
        })
     })

     const resp=await res.json();
     if(resp.Error=='NA'){
        var tempConnections={...connections};
        // console.log("tempConnections",tempConnections);
        var tempConnectionsData=tempConnections.data[companyName];
        var updatedConnections=tempConnectionsData.filter((o)=>o._id!=id);
        tempConnections.data[companyName]=updatedConnections;
        // console.log("updatedConnections",updatedConnections,"tempConnections is",tempConnections);
        var temp=tempConnections.followersData;
        temp.push(resp.status);
        tempConnections.followersData=temp;
        setConnections(tempConnections);

     }
     if(resp.error=='Invalid token' || resp.error=='Authentication required'){
      window.location='/login';
     }

    }
    catch(err){
        console.log("err is",err);
    }

  }

  return (
    // <div>MyNetwork

    //     {connections?(

    //         <div> 
    //             {connections.followersData.length>0?(
    //                 <div>
    //             People You Follow
    //         <div style={{display:'flex',flexWrap:'wrap',marginTop:'10px'}}>
    //             {  
    //              (showAll.get('following')==undefined || showAll.get('following')==false) && Array.from(connections.followersData.slice(0,3)).map((o)=>{
    //                     return(
    //                       <div  style={{flexBasis:'25%',backgroundColor:'pink',marginRight:'5px'}}>
    //                         <div >{o.follower.Name}</div>&nbsp;&nbsp;{o.follower._id}
    //                         <div>{o.follower.headline}</div>
    //                         <div style={{cursor:'pointer'}} onClick={()=>{window.location.href=`/viewProfile/${o.follower._id}/${userId}`}}><img src={o.follower.profilePic} width={50} height={50}/></div>
    //                         <div><Button onClick={()=>{unFollowUser(o.follower._id)}}>Unfollow</Button></div>
    //                         </div>
                        
    //                     )
    //                 })
    //             }

    //             {
    //                  (showAll.get('following')==true) && connections.followersData.map((o)=>{
    //                         return(
    //                           <div  style={{flexBasis:'25%',backgroundColor:'pink'}}>
    //                             <div>{o.follower.Name}</div>&nbsp;&nbsp;{o.follower._id}
    //                             <div>{o.follower.headline}</div>
    //                             <div style={{cursor:'pointer'}} onClick={()=>{window.location.href=`/viewProfile/${o.follower._id}/${userId}`}}><img src={o.follower.profilePic} width={50} height={50}/></div>
    //                             <div><Button onClick={()=>{unFollowUser(o.follower._id)}}>Unfollow</Button></div>
    //                             </div>
                            
    //                         )
                            
    //                     })

    //             }

    //         </div>

    //         {
    //             (showAll.get('following')==undefined || showAll.get('following')==false)?(
    //                 <Button onClick={()=>{handleSeeAll('following')}}>See All</Button>
    //             ):(<Button onClick={()=>{handleSeeLess('following')}}>See Less</Button>)
    //         }

    //                 </div>
    //             ):(null)}
          

    //     <div>    
    //                 Connections

    //     <div style={{display:'flex',flexWrap:'wrap'}}>
    //         {
    //             connections.connection.map((o)=>{
    //                 return(
    //                     <div style={{flexBasis:'25%'}}>
                           
    //                          {
    //             o.receiver._id!==userId?(
    //               <div  style={{backgroundColor:'pink'}}>
    //                 <div>{o.receiver.Name}</div>&nbsp;&nbsp;{o._id}
    //                 <div>{o.receiver.headline}</div>
    //                 <div style={{cursor:'pointer'}} onClick={()=>{window.location.href=`/viewProfile/${o.receiver._id}/${userId}`}}><img src={o.receiver.profilePic} width={50} height={50}/></div>
    //                 <div><Button onClick={()=>{handleRemoveConnection(o.sender._id,o.receiver._id,o._id)}}>Remove Connection</Button></div>
    //               </div>
    //             ):(
    //               <div  style={{backgroundColor:'pink'}}>
    //                 <div>{o.sender.Name}</div>&nbsp;&nbsp;{o._id}
    //                 <div>{o.sender.headline}</div>
    //                 <div style={{cursor:'pointer'}} onClick={()=>{window.location.href=`/viewProfile/${o.sender._id}/${userId}`}}><img src={o.sender.profilePic} width={50} height={50}/></div>
    //                 <div><Button onClick={()=>{handleRemoveConnection(o.sender._id,o.receiver._id,o._id)}}>Remove Connection</Button></div>

    //             </div>
    //             )
    //           }
    
                            
    //                     </div>
    //                 )
    //             })
    //         }
    //       </div>


    //       <div>
    //         {
    //             connections.companyIdsList.map((p)=>{
    //                 return(
                       
    //                     <div>
    //                          {console.log("hh",connections,"p is",p)}
    //                         { 
                            
    //                             connections.data[p]!=undefined?(
    //                                 <div> People you may know from {p}
    //                                 <div  style={{display:'flex',flexWrap:'wrap',marginTop:'10px'}}>
    //                                     {
    //                                          (showAll.get(p)==undefined || showAll.get(p)==false) && connections.data[p].slice(0,3).map((i)=>{
    //                                             return(
    //                                             <div  style={{flexBasis:'25%',backgroundColor:'pink',marginRight:'5px'}}>
    //                                                 <div>{i.Name}</div>&nbsp;&nbsp;{i._id}
    //                                                 <div>{i.headline}</div>
    //                                                 <div style={{cursor:'pointer'}} onClick={()=>{window.location.href=`/viewProfile/${i._id}/${userId}`}}><img src={i.profilePic} width={50} height={50}/></div>
    //                                                 <div>{i.followed==false ?(<Button onClick={()=>{followUser(i._id,p)}}>Follow</Button>):(null)}</div>
    //                                                 <div>{i.ConnectionReqPending?(
    //                                                     <Button onClick={()=>{handleWithdrawConnectionReq(i._id,p)}}>Pending</Button>
    //                                                 ):(<Button onClick={()=>{sendConnectionRequest(i._id,p,i.profilePic,i.headline)}}>Connect</Button>)}</div>
    //                                             </div>
    //                                             )
    //                                         })
    //                                     }
                                        

    //                                         {showAll.get(p)==true && connections.data[p].map((i)=>{
    //                                             return(
    //                                             <div onClick={()=>{window.location.href=`/viewProfile/${i._id}/${userId}`}} style={{flexBasis:'25%',backgroundColor:'pink',marginRight:'5px',cursor:'pointer'}}>
    //                                                 <div>{i.Name}</div>&nbsp;&nbsp;{i._id}
    //                                                 <div>{i.headline}</div>
    //                                                 <div><img src={i.profilePic} width={50} height={50}/></div>
    //                                                 <div>{i.followed==false ?(<Button onClick={()=>{followUser(i._id)}}>Follow</Button>):(null)}</div>
    //                                                 <div>{i.ConnectionReqPending?(
    //                                                     <Button onClick={()=>{handleWithdrawConnectionReq(i._id,p)}}>Pending</Button>
    //                                                 ):(<Button onClick={()=>{sendConnectionRequest(i._id,p,i.profilePic,i.headline)}}>Connect</Button>)}</div>
    //                                             </div>
    //                                             )
    //                                         })
    //                                     }

    //                                 </div>

    //                                 {
    //                                         (showAll.get(p)==undefined || showAll.get(p)==false)?(
    //                                             <Button onClick={()=>{handleSeeAll(p)}}>See All</Button>
    //                                         ):(<Button onClick={()=>{handleSeeLess(p)}}>See Less</Button>)
    //                                     }
    //                                 </div>
    //                             ):(null)
  
                               
    //                         }
    //                     </div>
    //                 )
    //             })
    //         }
    //     </div>
    //     </div>
    //     </div>
    //     ):(null)}
       
    // </div>
//     <div style={{ backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '10px' }}>
//   <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>My Network</h2>

//   {connections ? (
//     <div>
//       {connections.followersData.length > 0 ? (
//         <div>
//           <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>People You Follow</h3>
//           <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
//             {(showAll.get('following') === undefined || showAll.get('following') === false) &&
//               Array.from(connections.followersData.slice(0, 3)).map((o) => (
//                 <div
//                   style={{
//                     flexBasis: '25%',
//                     backgroundColor: 'pink',
//                     marginRight: '5px',
//                     padding: '10px',
//                     borderRadius: '5px',
//                   }}
//                 >
//                   <div style={{ fontWeight: 'bold' }}>{o.follower.Name}</div>
//                   <div>{o.follower._id}</div>
//                   <div>{o.follower.headline}</div>
//                   <div style={{ cursor: 'pointer' }} onClick={() => { window.location.href = `/viewProfile/${o.follower._id}/${userId}` }}>
//                     <img src={o.follower.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} />
//                   </div>
//                   <div><Button onClick={() => { unFollowUser(o.follower._id) }}>Unfollow</Button></div>
//                 </div>
//               ))}
//             {showAll.get('following') === true &&
//               connections.followersData.map((o) => (
//                 <div
//                   style={{
//                     flexBasis: '25%',
//                     backgroundColor: 'pink',
//                     padding: '10px',
//                     borderRadius: '5px',
//                   }}
//                 >
//                   <div style={{ fontWeight: 'bold' }}>{o.follower.Name}</div>
//                   <div>{o.follower._id}</div>
//                   <div>{o.follower.headline}</div>
//                   <div style={{ cursor: 'pointer' }} onClick={() => { window.location.href = `/viewProfile/${o.follower._id}/${userId}` }}>
//                     <img src={o.follower.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} />
//                   </div>
//                   <div><Button onClick={() => { unFollowUser(o.follower._id) }}>Unfollow</Button></div>
//                 </div>
//               ))}
//           </div>

//           {(showAll.get('following') === undefined || showAll.get('following') === false) ? (
//             <Button onClick={() => { handleSeeAll('following') }}>See All</Button>
//           ) : (
//             <Button onClick={() => { handleSeeLess('following') }}>See Less</Button>
//           )}
//         </div>
//       ) : null}

//       <div>
//         <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }}>Connections</h3>
//         <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//           {connections.connection.map((o) => (
//             <div
//               style={{
//                 flexBasis: '25%',
//                 backgroundColor: 'pink',
//                 padding: '10px',
//                 borderRadius: '5px',
//                 marginBottom: '10px',
//               }}
//             >
//               {o.receiver._id !== userId ? (
//                 <div>
//                   <div style={{ fontWeight: 'bold' }}>{o.receiver.Name}</div>
//                   <div>{o._id}</div>
//                   <div>{o.receiver.headline}</div>
//                   <div style={{ cursor: 'pointer' }} onClick={() => { window.location.href = `/viewProfile/${o.receiver._id}/${userId}` }}>
//                     <img src={o.receiver.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} />
//                   </div>
//                   <div><Button onClick={() => { handleRemoveConnection(o.sender._id, o.receiver._id, o._id) }}>Remove Connection</Button></div>
//                 </div>
//               ) : (
//                 <div>
//                   <div style={{ fontWeight: 'bold' }}>{o.sender.Name}</div>
//                   <div>{o._id}</div>
//                   <div>{o.sender.headline}</div>
//                   <div style={{ cursor: 'pointer' }} onClick={() => { window.location.href = `/viewProfile/${o.sender._id}/${userId}` }}>
//                     <img src={o.sender.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} />
//                   </div>
//                   <div><Button onClick={() => { handleRemoveConnection(o.sender._id, o.receiver._id, o._id) }}>Remove Connection</Button></div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {connections.companyIdsList.map((p) => (
//           <div key={p}>
//             {connections.data[p] !== undefined ? (
//               <div>
//                 <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }}>People you may know from {p}</h3>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
//                   {(showAll.get(p) === undefined || showAll.get(p) === false) &&
//                     connections.data[p].slice(0, 3).map((i) => (
//                       <div
//                         style={{
//                           flexBasis: '25%',
//                           backgroundColor: 'pink',
//                           marginRight: '5px',
//                           padding: '10px',
//                           borderRadius: '5px',
//                           cursor: 'pointer',
//                         }}
//                         onClick={() => { window.location.href = `/viewProfile/${i._id}/${userId}` }}
//                       >
//                         <div style={{ fontWeight: 'bold' }}>{i.Name}</div>
//                         <div>{i._id}</div>
//                         <div>{i.headline}</div>
//                         <div><img src={i.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} /></div>
//                         <div>{i.followed === false ? (<Button onClick={() => { followUser(i._id, p) }}>Follow</Button>) : null}</div>
//                         <div>
//                           {i.ConnectionReqPending ? (
//                             <Button onClick={() => { handleWithdrawConnectionReq(i._id, p) }}>Pending</Button>
//                           ) : (
//                             <Button onClick={() => { sendConnectionRequest(i._id, p, i.profilePic, i.headline) }}>Connect</Button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   {showAll.get(p) === true &&
//                     connections.data[p].map((i) => (
//                       <div
//                         key={i._id}
//                         style={{
//                           flexBasis: '25%',
//                           backgroundColor: 'pink',
//                           marginRight: '5px',
//                           padding: '10px',
//                           borderRadius: '5px',
//                           cursor: 'pointer',
//                         }}
//                         onClick={() => { window.location.href = `/viewProfile/${i._id}/${userId}` }}
//                       >
//                         <div style={{ fontWeight: 'bold' }}>{i.Name}</div>
//                         <div>{i._id}</div>
//                         <div>{i.headline}</div>
//                         <div><img src={i.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} /></div>
//                         <div>{i.followed === false ? (<Button onClick={() => { followUser(i._id) }}>Follow</Button>) : null}</div>
//                         <div>
//                           {i.ConnectionReqPending ? (
//                             <Button onClick={() => { handleWithdrawConnectionReq(i._id, p) }}>Pending</Button>
//                           ) : (
//                             <Button onClick={() => { sendConnectionRequest(i._id, p, i.profilePic, i.headline) }}>Connect</Button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                 </div>

//                 {(showAll.get(p) === undefined || showAll.get(p) === false) ? (
//                   <Button onClick={() => { handleSeeAll(p) }}>See All</Button>
//                 ) : (
//                   <Button onClick={() => { handleSeeLess(p) }}>See Less</Button>
//                 )}
//               </div>
//             ) : null}
//           </div>
//         ))}
//       </div>
//     </div>
//   ) : null}
// </div>

<div style={{ backgroundColor: '#CBE5F3', padding: '20px', borderRadius: '10px' }}>
  <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>My Network</h2>

  {connections ? (
    <div>
      {connections.followersData.length > 0 ? (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>People You Follow</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px',marginBottom:'8px' }}>
            {(showAll.get('following') === undefined || showAll.get('following') === false) && Array.from(connections.followersData.slice(0, 3)).map((o) => (
              <div
                style={{
                  flexBasis: '25%',
                  backgroundColor: '#27CAF1',
                  marginRight: '5px',
                  padding: '10px',
                  borderRadius: '5px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px',textTransform:'capitalize'  }}>{o.follower.Name}</div>
                <div style={{maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '5px'}}>{o.follower.headline}</div>
                <div
                  style={{ cursor: 'pointer', marginTop: '10px' }}
                  onClick={() => { window.location.href = `/viewProfile/${o.follower._id}/${userId}` }}
                >
                  <img src={o.follower.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} />
                </div>
                 <div>
                  <Button style={{backgroundColor:'pink'}}onClick={() => { unFollowUser(o.follower._id) }}>Unfollow</Button>
                 </div>
               </div> 
         
            ))}
            {(showAll.get('following') === true) && connections.followersData.map((o) => (
              <div
                style={{
                  flexBasis: '25%',
                  backgroundColor: '#27CAF1',
                  padding: '10px',
                  borderRadius: '5px',
                  marginRight: '5px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px',textTransform:'capitalize'  }}>{o.follower.Name}</div>
                <div>{o.follower.headline}</div>
                <div
                  style={{ cursor: 'pointer', marginTop: '10px' }}
                  onClick={() => { window.location.href = `/viewProfile/${o.follower._id}/${userId}` }}
                >
                  <img src={o.follower.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} />
                </div>
                <div>
                  <Button style={{backgroundColor:'pink'}} onClick={() => { unFollowUser(o.follower._id) }}>Unfollow</Button>
                </div>
              </div>
            ))}
          </div>

          {(showAll.get('following') === undefined || showAll.get('following') === false) ? (
            <Button style={{backgroundColor:'pink'}} onClick={() => { handleSeeAll('following') }}>See All</Button>
          ) : (
            <Button style={{backgroundColor:'pink'}} onClick={() => { handleSeeLess('following') }}>See Less</Button>
          )}
        </div>
      ) : null}

      <div>
        {connections.connection && connections.connection.length>0?(
          <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }}>Connections</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {connections.connection.map((o) => (
                  <div
                    style={{
                      flexBasis: '25%',
                      backgroundColor: '#27CAF1',
                      padding: '10px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {o.receiver._id !== userId ? (
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px',textTransform:'capitalize'  }}>{o.receiver.Name}</div>
                        <div>{o.receiver.headline}</div>
                        <div
                          style={{ cursor: 'pointer', marginTop: '10px' }}
                          onClick={() => { window.location.href = `/viewProfile/${o.receiver._id}/${userId}` }}
                        >
                          <img src={o.receiver.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} />
                        </div>
                        <div>
                          <Button style={{backgroundColor:'pink'}} onClick={() => { handleRemoveConnection(o.sender._id, o.receiver._id, o._id) }}>Remove Connection</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px',textTransform:'capitalize'  }}>{o.sender.Name}</div>
                        <div>{o.sender.headline}</div>
                        <div
                          style={{ cursor: 'pointer', marginTop: '10px' }}
                          onClick={() => { window.location.href = `/viewProfile/${o.sender._id}/${userId}` }}
                        >
                          <img src={o.sender.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} />
                        </div>
                        <div>
                          <Button style={{backgroundColor:'pink'}} onClick={() => { handleRemoveConnection(o.sender._id, o.receiver._id, o._id) }}>Remove Connection</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </div>
        ):(null)}
       

        {connections.companyIdsList.map((p) => (
          <div key={p}>
            {connections.data[p] !== undefined ? (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }}>
                  {connections.data[p].length>0 && connections.data[p]!==[null]? `People you may know from ${p}`:''}
                  </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                 
                  {(showAll.get(p) === undefined || showAll.get(p) === false) && connections.data[p].slice(0, 3).map((i) => (
                    i!=null && i!=undefined?(
                      <div
                      style={{
                          flexBasis: '25%',
                          backgroundColor: '#27CAF1',
                          padding: '10px',
                          borderRadius: '5px',
                          marginBottom: '10px',
                          marginRight: '5px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          
                      }}
                      >
                      <div style={{ fontWeight: 'bold', marginBottom: '5px',textTransform:'capitalize' }}>{i.Name}</div>
                      <div style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '5px' }}>{i.headline}</div>
                      <div style={{ cursor: 'pointer', marginTop: '10px' }}>
                          <img src={i.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%',cursor:'pointer' }} 
                          onClick={()=>{window.location.href=`/viewProfile/${i._id}/${userId}`}}
                          
                          />
                      </div>
                      {/* <div>
                          <Button style={{backgroundColor:'pink'}} onClick={() => { sendConnectionRequest(i._id, p, i.profilePic, i.headline) }}>Connect</Button>
                      </div> */}
                      {i.ConnectionReqPending?(
                  <Button style={{backgroundColor:'pink'}} onClick={()=>{handleWithdrawConnectionReq(i._id,p)}}>Pending</Button>
              ):(<Button  style={{backgroundColor:'pink'}} onClick={()=>{sendConnectionRequest(i._id,p,i.profilePic,i.headline)}}>Connect</Button>)}</div>
                    ):(null)
                
            
            ))}
             
                  {(showAll.get(p) === true) && connections.data[p].map((i) => (
                    i!=null && i!=undefined?(
                      <div
                      key={i._id}
                      style={{
                        flexBasis: '25%',
                        backgroundColor: '#27CAF1',
                        padding: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '5px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                      
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '5px',textTransform:'capitalize'  }}>{i.Name}</div>
                      <div>{i.headline}</div>
                      <div style={{ cursor: 'pointer', marginTop: '10px' }}>
                        <img src={i.profilePic} width={50} height={50} alt="Profile Pic" style={{ borderRadius: '50%' }} 
                         onClick={()=>{window.location.href=`/viewProfile/${i._id}/${userId}`}}
                        />
                      </div>
                      <div>
                      <Button style={{backgroundColor:'pink'}} onClick={() => { sendConnectionRequest(i._id, p, i.profilePic, i.headline) }}>Connect</Button>
                      </div>
                      {(showAll.get(p) === undefined || showAll.get(p) === false) ? (
                  <Button style={{backgroundColor:'pink'}} onClick={() => { handleSeeAll(p) }}>See All</Button>
                ) : (
                  <Button style={{backgroundColor:'pink'}} onClick={() => { handleSeeLess(p) }}>See Less</Button>
                )}
                    </div>

                    ):(null) 
                  
                  ))}
                </div>

               
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>No connections available.</div>
  )}
</div>


  )
}

export default MyNetwork