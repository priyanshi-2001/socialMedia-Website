import {React}from 'react'
import { useState,useEffect ,useRef} from 'react';
import {CardActionArea,Input, Modal, OutlinedInput, TextField }from '@mui/material';
import {Image, Video, Transformation,CloudinaryContext} from 'cloudinary-react';
import Avatar from '@mui/material/Avatar';
import { Document, Page,pdfjs } from 'react-pdf';
import { Snackbar , Alert,Box} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CardMedia,
  CardHeader
} from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment'
import io from 'socket.io-client';
pdfjs.GlobalWorkerOptions.workerSrc = 
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const  url="http://localhost:8000/"

const Tree = ({ comment, onUpdate, onDelete,parentId,onAddComment ,successfullyUpdated,userId ,parentCommentId}) => {
  const[editId,setEditId]=useState('');
  const[editedVal,setEditedVal]=useState('');
  const[parentCId,setParentCId]=useState('');
  const [newText, setNewText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleUpdate = (id,parentCommentId) => {
    setEditId(id);
    setParentCId(parentCommentId);
   
  };


  const handleDelete = (parentId) => {
    onDelete(comment._id,parentId);
  };


  const submitEditedValue=()=>{
    onUpdate(comment._id, editedVal);
  }

 

  const handleCancel=()=>{
    setEditId('');
    setEditedVal('');
    setParentCId('');
  }

 
  const handleAddComment = () => {
    setIsAddingComment(true);
  };

  const handleConfirmAddComment = () => {
    onAddComment(comment._id, newCommentText);
    setNewCommentText('');
    setIsAddingComment(false);
  };

 
  return(
    <li>
    <div style={{ display: 'flex' }}>
      <div>
        {comment._id}&nbsp;&nbsp;
        {comment.description}&nbsp;&nbsp;
        parent is{parentId}
      </div>
      <div>&nbsp;&nbsp;&nbsp;{comment.path}</div>
    </div>
    {comment.userId==localStorage.getItem("userId")?('YOUR COMMENT'):(null)}
    {/* <button onClick={()=>{handleUpdate()}}>Update</button> */}
              {
                editId!=='' && editId==comment._id && !successfullyUpdated ?(
                  <div> 
                  <Input type='text' value={editedVal} onChange={(e)=>{setEditedVal(e.target.value)}} defaultValue={comment.description} />
                  <Button style={{backgroundColor:'pink'}} onClick={()=>{submitEditedValue()}}>Edit</Button>
                  <Button style={{backgroundColor:'pink',marginLeft:'3px'}} onClick={()=>{handleCancel()}}>Cancel</Button>
                  </div>
                ):(null)
                }

            {/* {comment.userId==userId?( */}
              <div>
                <Button style={{backgroundColor:'pink'}} onClick={() => handleUpdate(comment._id,comment.ref1)}>Update</Button>
                {/* <button onClick={() => handleDelete(comment._id,comment.ref1)}>Delete</button> */}
              </div>
           {/* ):(null)} */}
    <Button style={{backgroundColor:'pink',marginTop:'3px'}} onClick={()=>{handleDelete(parentId)}}>Delete</Button>
    {isAddingComment ? (
      <div>
        <input type="text" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} />
        <Button style={{backgroundColor:'pink',marginLeft:'3px'}} onClick={()=>{handleConfirmAddComment()}}>Add Comment</Button>
      </div>
    ) : (
      <Button style={{backgroundColor:'pink',marginLeft:'3px'}} onClick={()=>{handleAddComment()}}>Add Comment</Button>
    )}
    {comment.immediateChilds && comment.immediateChilds.length > 0 && (
      <ul>
        {comment.immediateChilds.map((child) => (
          <Tree
            key={child.children._id}
            comment={child.children}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAddComment={onAddComment}
            parentId={comment._id}
          />
        ))}
      </ul>
    )}
  </li>
  )
};

const HomeScreen = () => {



  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: theme.palette.grey[100],
    },
    postContainer: {
      maxWidth: 600,
      width: '100%',
    },
    card: {
      marginBottom: theme.spacing(2),
      borderRadius: theme.spacing(1),
      overflow: 'hidden',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease-in-out',
      '&:hover': {
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
      },
    },
    postInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginRight: theme.spacing(1),
    },
    image: {
      height: 200,
      objectFit: 'cover',
    },
    postActions: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.grey[200],
      display: 'flex',
      justifyContent: 'space-between',
      borderRadius:'15px'
    },
    actionButton: {
      textTransform: 'none',
      borderRadius: theme.spacing(1),
      padding: theme.spacing(1.5, 2),
      transition: 'background-color 0.3s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    },
  }));

  const classes = useStyles();
  const socket=io.connect('http://localhost:8000');
  const[data,setData]=useState();
  const[dataByExp,setDataByExp]=useState();
  const[extraData,setExtraData]=useState();
  const[showReaction,setShowReaction]=useState(false);
  const[reactionId,setReactionId]=useState('');
  // const[companyNames,setCompanyNames]=JSON.parse(localStorage.getItem("companyNames"));
  // const[locationCity,setLocationCity]=JSON.parse(localStorage.getItem("locationCity"));
  // const[educationInst,setEducationInst]=JSON.parse(localStorage.getItem("educationInst"));
  const[showComments,setShowComments]=useState(false);
  const[commentsData,setCommentsData]=useState([]);
  const[postId,setPostId]=useState('');//stores postId for which we are showing comments
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const[reactionsData,setReactionsData]=useState([]);
  const[reactionsDataPostId,setReactionsDataPostId]=useState('');
  const[profilePic,setProfilePic]=useState('');
  const[successfullyUpdated,setSuccessfullyUpdated]=useState(false);
  const[showNotification,setShowNotification]=useState(false);
  const[notificationMsg,setNotificationMsg]=useState('');
  const[showSearch,setShowSearch]=useState(false);
  const[searchItem,setSearchItem]=useState('');
  const[showSearchedData,setShowSearchedData]=useState(false);
  const reactionMap = new Map([
    ['L', 'Like'],
    ['S', 'Support'],
    ['LV', 'Love'],
    ['LG', 'Laugh']
  ]);
  const[searchedData,setSearchedData]=useState({});
  const [selectedReaction, setSelectedReaction] = useState(null);
  const[averageButtonWidth,setAverageButtonWidth]=useState(0);
  const [showCommentInput,setShowCommentInput] =useState(false);
  const[newComment,setNewComment]=useState('');

  const [isOpen, setIsOpen] = useState(false);

  const handleReactionClick = (reaction) => {
    setSelectedReaction(reaction.reactionType);
  };


  useEffect(() => {
    
    socket.on("receive_message", (data) => {
      // console.log("data we got is",data);

    });
    
  
  }, []);

  useEffect(()=>{
    socket.on("receive_connReqNotif",(data)=>{
      setShowNotification(true);
      setNotificationMsg(data.notification.description);
      // console.log("data in receive_connReqNotif",data);
    })
  },[])

  useEffect(()=>{
    socket.on("connectionRequestAcceptedNotify",(data)=>{
      setShowNotification(true);
      setNotificationMsg(data.notification.description);
      // console.log("data in connectionRequestAcceptedNotify",data);
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

  const onDocumentLoadSuccess=({ numPages }) =>{
    console.log("numPages",numPages);
    setNumPages(numPages);
    setPageNumber(1);
  }
  
  const changePage=(offset)=> {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }
  
  const previousPage=() =>{
    changePage(-1);
  }
  
  const nextPage=()=> {
    changePage(1);
  }

  useEffect(()=>{
    (async()=>{
      await fetchRelatedData();

    })()

  },[])

  const fetchComments=async(postId)=>{
    try{
      const resp=await fetch(url+'getComments/'+postId,{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`

        },
        method:'GET'
      })
      const response=await resp.json()
      if(response.Error=='NA'){
       setCommentsData( response.comments );
      }
      if(response.error=='Invalid token' || response.error=='Authentication required'){
        window.location='/login';
       }

    }
    catch(err){
      console.log("error is",err);
    }
  }

  const handleCommentpopup=async(id)=>{
    // console.log("id is",id,"postid state",postId,"commentsData",commentsData)
    setShowCommentInput(true);
    if(commentsData.length==0 || postId!=id){

    await fetchComments(id);
    if(showComments===false){setPostId(id)}
    else{setPostId('')}
    setShowComments(!showComments);

   
    }

    else{
      if(showComments==false){setPostId(id)}
      else{setPostId(''); setCommentsData([])}
      setShowComments(!showComments);
     

    }
  
   
  }

  const fetchRelatedData=async()=>{
    try{

      const response=await fetch(url+"fetchMostRelatedPosts",{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`
        },
        body:JSON.stringify({
          companyNames:JSON.parse(localStorage.getItem("companyNames")),
          locationCity:JSON.parse(localStorage.getItem("locationData")),
          educationInst:JSON.parse(localStorage.getItem("educationInst")),
          userId:localStorage.getItem("userId")
        })
      })

      const res=await response.json();
      if(res.Error=='NA'){
        // console.log("fff",res.postsDataByCurrColleagues);
        setData(res.postsDataByCurrColleagues);
        setExtraData(res.postsDataByEducation);
        setDataByExp(res.postsDataByExperience);
        setProfilePic(res.profilePic);
      }
      if(res.error=='Invalid token' || res.error=='Authentication required'){
        window.location='/login';
       }
      // setExtraData(res.ExtraData);



    }
    catch(err){
      console.log("err",err);
    }
  }

  const handleSavePosts=(id)=>{
// console.log("user saving posts",id);
  }



      const handleClose=()=>{
        setShowNotification(false);
        setNotificationMsg('');
      }

      const handleReaction=async(reactionName,postId)=>{
          try{
           

           const resp=await fetch(url+"reactOnPost",{
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            method:'POST',
            body:JSON.stringify({
              postId:postId,
              userId:localStorage.getItem("userId"),
              reaction:reactionName
            })
           });
           const res=await resp.json();
           if(res.Error=='NA'){
              console.log("data is",data);
              // var tempdata=data;
              // var tempDataToUpdate=tempdata.filter((o)=>o._id==postId);
              // console.log("tempDataToUpdate is",tempDataToUpdate[0].likesData,"oiuuu",tempDataToUpdate);
              // var updatedPost=tempDataToUpdate[0].likesData.map((o) => {
              //   if (o.hasOwnProperty(reactionName)) {
              //     o[reactionName] += 1;
              //   }
              // });
              // console.log("pp",updatedPost);
              // setData(tempDataToUpdate);
            // var tempReactions=likesData.map((o)=>o.hasOwnProperty(reactionName)?o.reactionName+=1:null);
            // console.log("kk",tempReactions);
            // setReactionsData(tempReactions);
           }
           if(res.error=='Invalid token' || res.error=='Authentication required'){
            window.location='/login';
           }
         

          }
          catch(err){
            console.log("err is",err);
          }
      }

      const showReactions=async(postId)=>{
        try{
          if(reactionsDataPostId==''){
          const resp=await fetch(url+`getReactionsOnAPost/${postId}`,{
            method:'GET',
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            }
          });
          const res=await resp.json();
          if(res.error=='Invalid token' || res.error=='Authentication required'){
            window.location='/login';
           }
          if(res.Error=='NA'){
            if(res.reactions!=[]){
              setReactionsData(res.reactions);
              setReactionsDataPostId(postId);
              setSelectedReaction(res.reactions[0].reactionType)
              setAverageButtonWidth(100 / res.reactions.length);
              
  
  
            }
           
            else{
              setReactionsData([]);
              setReactionsDataPostId('');
            }
          }

        }
        else{
          setReactionsData([]);
          setReactionsDataPostId('');
          setSelectedReaction([])
          setAverageButtonWidth(0);
        }

        }
        catch(err){
          console.log("err",err);
        }
      }

      const handleSearch=async()=>{
        try{
          const resp=await fetch(url+`search/${searchItem}`,{
            method:'GET',
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            }
          })

          const res=await resp.json();
          if(res.Error=='NA'){
            setShowSearch(false)
            setShowSearchedData(true);
            setSearchedData(res.data);
          }
          if(res.error=='Invalid token' || res.error=='Authentication required'){
            window.location='/login';
           }


        }
        catch(err){
          console.log("err",err);
        }
      }
      const clearSearch=()=>{
        setShowSearchedData(false);
        setSearchedData([]);
        setSearchItem('');
      }
      const handleKeyPress = async(e) => {
        if (e.key === 'Enter') {
          await handleSearch();//to handle when user hits enter msg
        }
      };
      const deleteObjectById = (obj, id) => {
        if (obj._id === id) {
          return null;
        }
    
        if (obj.immediateChilds && Array.isArray(obj.immediateChilds)) {
          const updatedChilds = obj.immediateChilds.map((child) => {
            const updatedChild = deleteObjectById(child.children, id);
            if (updatedChild) {
              return { ...child, children: updatedChild };
            }
            return null;
          });
    
          return {
            ...obj,
            immediateChilds: updatedChilds.filter((child) => child !== null),
          };
        }
    
        return obj;
      };
    
      const handleUpdate = async(id, newText) => {
        try{  
          const res=await fetch(url+"updateComment",{
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify({
              updatedComment:newText,
              commentId:id
            }),
            method:'POST'
    
    
          })
          const response=await res.json();
          if(response.Error=='NA'){
              const updatedData = commentsData.map((o) => updateItem(o, id, newText));
              setCommentsData(updatedData);
          }
          if(response.error=='Invalid token' || response.error=='Authentication required'){
            window.location='/login';
           }

        }
        catch(err){
          console.log("err",err);
        }
      };
    
      const handleDelete = async(id,parentCommentId) => {
        try{
           
            const response=await fetch(url+"deleteComments",{
              headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem("token")}`
              },
              body:JSON.stringify({
                commentId:id,
                parentCommentId:parentCommentId
              }),
              method:'POST'
            })
            const res=await response.json();
            if(res.Error=='NA'){
                const deleted = commentsData.map((o) => deleteObjectById(o, id)).filter(Boolean);
                setCommentsData(deleted);
            }
            if(res.error=='Invalid token' || res.error=='Authentication required'){
              window.location='/login';
             }
  
        }
        catch(err){
          console.log("err",err);
        }
      };
    
      const updateItem = (obj, id, newText) => {
        if (obj._id === id) {
          return { ...obj, description: newText };
        }
    
        if (obj.immediateChilds && Array.isArray(obj.immediateChilds)) {
          const updatedChilds = obj.immediateChilds.map((child) => {
            const updatedChild = updateItem(child.children, id, newText);
            if (updatedChild) {
              return { ...child, children: updatedChild };
            }
            return child;
          });
    
          return {
            ...obj,
            immediateChilds: updatedChilds,
          };
        }
    
        return obj;
      };
    
      const handleAddComment = async(id, commentText) => {
        try{
          const resp=await fetch(url+"addComment",{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify({
                postId:postId,
                userId:localStorage.getItem("userId"),
                comment:commentText,
                parentCommentId:id
            })
          });
          const res=await resp.json();
          if(res.Error=='NA'){
          const updatedData = commentsData.map((o) => addItem(o, id, commentText,res.newComment._id));
          setCommentsData(updatedData);
          }
          if(res.error=='Invalid token' || res.error=='Authentication required'){
            window.location='/login';
           }


        }
        catch(err){
          console.log("err is",err);
        }
        
      };
    
      const addItem = (obj, id, commentText,newCommentId) => {
        if (obj._id === id) {
          const newComment = {
            _id: newCommentId,
            description: commentText,
            immediateChilds: [],
          };
          return {
            ...obj,
            immediateChilds: [...obj.immediateChilds, { children: newComment }],
          };
        }
    
        if (obj.immediateChilds && Array.isArray(obj.immediateChilds)) {
          const updatedChilds = obj.immediateChilds.map((child) => {
            const updatedChild = addItem(child.children, id, commentText);
            if (updatedChild) {
              return { ...child, children: updatedChild };
            }
            return child;
          });
    
          return {
            ...obj,
            immediateChilds: updatedChilds,
          };
        }
    
        return obj;
      };
    const handleCancel=()=>{
      setShowCommentInput(false);
      setNewComment('');
    }

    const handleAddNewComment=async()=>{
      try{
        const resp=await fetch(url+"addComment",{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          },
          body:JSON.stringify({
              postId:postId,
              userId:localStorage.getItem("userId"),
              comment:newComment,
              parentCommentId:""
          })
        });
        const res=await resp.json();
        if(res.Error=='NA'){
          const tempComments=[...commentsData];
          tempComments.push(res.newComment);
          setCommentsData(tempComments);
        }
        if(res.error=='Invalid token' || res.error=='Authentication required'){
          window.location='/login';
         }



      }
      catch(err){
        console.log("err",err);
      }
    }
    
    const handleLogout=async()=>{
      
          localStorage.clear();
          window.location="login"

    }
  return (
    <div>
  
      <Snackbar style={{vertical: 'top',
          horizontal: 'center',}} open={showNotification} autoHideDuration={6000} onClose={()=>{handleClose()}}>
      <Alert onClose={()=>{handleClose()}} severity="success" sx={{ width: '100%' }}>
        {notificationMsg}
      </Alert>
      </Snackbar>
      <div style={{display:'flex',flexDirection:'row'}}>
      <Button onClick={()=>{setIsOpen(!isOpen)}}>&#8801;
       
      </Button>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '200px',
            height: '100vh',
            backgroundColor: '#f2f2f2',
            padding: '20px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Button onClick={()=>{setIsOpen(!isOpen)}}>
            <span>&#8801;</span> 
          </Button>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
          <Button onClick={()=>{window.location='/viewMyProfile'}}><img src={profilePic} height={35} width={35}/>View My Profile</Button>
            </li>
            <li>
              <Button onClick={()=>{handleLogout()}}>Logout</Button>
            </li>  
          </ul>
        </div>
      )}
        {/* <Button onClick={()=>{window.location='/viewMyProfile'}}><img src={profilePic} height={35} width={35}/></Button> */}
      <Button  style={{flex:2,backgroundColor:'#99ceff'}} >Home</Button>
    
      <Typography>
            <Input type="text" placeholder='Search'  value={searchItem} onChange={(e)=>{setSearchItem(e.target.value)}} onKeyDown={handleKeyPress} ></Input>
          </Typography>
          <Typography>
            <Button onClick={()=>{handleSearch()}}>&#128270;</Button>
            <Button onClick={()=>{clearSearch()}}>&#10062;</Button>
          </Typography>
        {/* <Button  style={{flex:6,backgroundColor:'grey' }} onClick={()=>{setShowSearch(true);}}>Search</Button> */}
        <Button  style={{flex:2,backgroundColor:'#99ceff'}} onClick={()=>{window.location='/messagesWindow'}}>Messages</Button>

      </div >
      {!showSearchedData?(
      
      <div style={{width:'100%',height:'650px',backgroundColor:'#ccdcff',overflow: 'auto',
                  
                  }}>
      
          {data?(
            <div style={{marginLeft:'28%',marginRight:'28%'}}>
             
              {data.map((o,index)=>{
                return(
                <Card sx={{ backgroundColor:'',border:'2px solid yellow',marginTop: index > 0 ? '20px' : '0', }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{}} aria-label="recipe" >
                     {o.userId && o.userId.profilePic!==''?
                    <Button onClick={()=>{o.userId._id!=localStorage.getItem("userId") ? window.location.href=`/viewProfile/${o.userId._id}/${localStorage.getItem("userId")}`:window.location='/viewMyProfile'}} >
                     <img src={o.userId.profilePic} height='100%' width='100%'/>
                     </Button>
                     :o.userId.Name[0]} 
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon onClick={()=>{handleSavePosts(o._id)}}/>
                    </IconButton>
                  }
                  title={o.userId.Name}
                  subheader={o.userId.headline}
                
                />
                
                <CardMedia sx={{}}>
                  <div style={{marginLeft:'18px'}}>{moment.utc(o.createdDate).local().startOf('seconds').fromNow()}</div>
                  {/* <div style={{marginLeft:'18px'}}>{o._id}</div> */}
                  </CardMedia>
                <CardContent>
                  <div style={{backgroundColor:'#66c2ff',border:'2px solid #4CCDE7',marginTop:'16px',width:'90%',borderRadius:'14px',padding:'3px'}}>
                  <div>{o.body}</div>
                  <div>
                
                  </div>
                  {o.files!==''?(<div>
                 

                     
                     {JSON.parse(o.files).map((k)=>{
                       return(
                         <div >
                          
                           {k.substr(k.length - 3)=='pdf'?(
                        
                      <div>
                   
                    <div>
                     
                      <div><embed src={k} height={450} width={450}>
                      </embed></div>
                    </div>
                    </div>
                 
                           ):(
                            <Image cloudName={JSON.stringify(k).split("res.cloudinary.com")[1].split("/")[1]} version={JSON.stringify(k).split("/v")[1].split("/")[0]} publicId={'/Posts/'+JSON.stringify(k).split("/Posts/")[1].replace('"',"")} >
                            <Transformation angle="-45"/>
                             <Transformation effect="trim" angle="45" crop="scale" width="645"/>
                      </Image>
                           )}
                         </div>


                       )
                     })}
                    
                   
                   </div>):(null)}
                   <div style={{display:'flex',flexDirection:'column'}}>
                   

                    <div>
                      {parseInt(o.likesData)>0?(
                           <div style={{display:'flex',flexDirection:'row'}}>
                            <Button onClick={()=>{showReactions(o._id)}} style={{backgroundColor:'pink'}} >
                              {o.likesData}&#128516;&#128151;&#128079;
                            <a href="https://img.icons8.com/?size=512&id=yeicDsknq50G&format=png" target='_blank'>
                              <img src='https://img.icons8.com/?size=512&id=yeicDsknq50G&format=png' style={{width: '18px', height: '18px',verticalAlign: 'middle', marginLeft: '4px'}}/>
                            </a>
                            </Button> 

                           
                           
                           </div>
                      ):(null)}

                     
                    </div>

                    <div>
                        {reactionsDataPostId==o._id && reactionsData && reactionsData.length>0?(
                          <div>
                           {
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {reactionsData.map((o) => {
                              const reactionHeight = o.likes.length * 60 + 40; // Calculate height based on number of likes
                          
                              return (
                                <div
                                  key={o.reactionType}
                                  style={{
                                    marginRight: '10px',
                                    width: `${averageButtonWidth}%`,
                                  }}
                                >
                                  <button
                                    style={{
                                      background: selectedReaction === o.reactionType ? 'blue' : 'gray',
                                      color: 'white',
                                      padding: '5px 10px',
                                      border: 'none',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      width: '100%',
                                    }}
                                    onClick={() => handleReactionClick(o)}
                                  >
                                    {reactionMap.get(o.reactionType)}
                                  </button>
                                  {selectedReaction === o.reactionType && (
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: `${reactionHeight}px`, // Set the calculated height
                                      }}
                                    >
                                      {o.likes.map((k) => (
                                        <div
                                          key={k._id}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                            height: '60px', // Fixed height for each like row
                                          }}
                                        >
                                          <div style={{ flex: '0 0 60px', marginRight: '10px' }}>
                                            <img
                                              src={k.userId.profilePic}
                                              width={60}
                                              height={60}
                                              alt="Profile"
                                              style={{ objectFit: 'cover' }}
                                            />
                                          </div>
                                          <div style={{ flex: '1', overflow: 'hidden' }}>
                                            <div
                                              style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                              }}
                                            >
                                              {k.userId._id==localStorage.getItem("userId")?'You':k.userId.Name}
                                              {/* {k.userId.Name} */}
                                            </div>
                                            <div
                                              style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                              }}
                                            >
                                              {k.userId.headline}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                           }

                          </div>
                        ):(null)}
                    </div>
                    <div className={classes.postActions} > 
                    <div><Button style={{backgroundColor:'pink'}} onClick={()=>{setShowReaction(!showReaction); setReactionId(o._id)}}>React</Button></div>
                    {showReaction && reactionId==o._id?(
                      <div>
                        <Button onClick={()=>{handleReaction('like',o._id)}}>Like</Button>
                        <Button onClick={()=>{handleReaction('love',o._id)}}>Love</Button>
                        <Button onClick={()=>{handleReaction('laugh',o._id)}}>Laugh</Button>
                        <Button onClick={()=>{handleReaction('support',o._id)}}>Support</Button>
                      </div>
                    ):(null)}
                    <Button style={{backgroundColor:'pink'}} onClick={()=>{handleCommentpopup(o._id)}}>Comment</Button>
                    <div><Button style={{backgroundColor:'pink'}} >Repost</Button></div>
                    </div>
                   </div>
                   {showComments && postId==o._id ?(
                    <div>
                      <div>
                      {
                        showCommentInput?(
                          <div>
                          <Input type="text" value={newComment} onChange={(e)=>{setNewComment(e.target.value)}}/>
                          <Button style={{backgroundColor:'pink'}} onClick={()=>{handleAddNewComment()}}>Add Comment</Button>
                          <Button style={{backgroundColor:'pink'}} onClick={()=>{handleCancel()}}>Cancel</Button>
                          </div>
                        ):(null)

                      }

                    </div>
     

                       <div>
                      <ul>
                        {commentsData.map((comment) => (
                          <Tree
                            key={comment._id}
                            comment={comment}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            onAddComment={handleAddComment}
                            successfullyUpdated={successfullyUpdated} userId={localStorage.getItem("userId")} parentCommentId=''
                            parentId={comment._id}
                          />
                        ))}
                      </ul>
                    </div>
                     

                    </div>

                   ):(null)}
                 
                  </div>
                  </CardContent>
                  </Card>
                  
                )
              })}

            
            </div>

          ):(null)}
          {


            extraData?(
              <div>
                {extraData.map((o)=>{
                return(
           
                  <div style={{marginLeft:'30%',marginRight:'30%'}}>
             
                  {data.map((o,index)=>{
                    return(
                    <Card sx={{ backgroundColor:'',border:'2px solid yellow',marginTop: index > 0 ? '20px' : '0', }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{}} aria-label="recipe" >
                         {o.userId && o.userId.profilePic!==''?
                        <Button onClick={()=>{o.userId._id!=localStorage.getItem("userId") ? window.location.href=`/viewProfile/${o.userId._id}/${localStorage.getItem("userId")}`:window.location='/viewMyProfile'}} >
                         <img src={o.userId.profilePic} height='100%' width='100%'/>
                         </Button>
                         :o.userId.Name[0]} 
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreVertIcon onClick={()=>{handleSavePosts(o._id)}}/>
                        </IconButton>
                      }
                      title={o.userId.Name}
                      subheader={o.userId.headline}
                    
                    />
                    
                    <CardMedia sx={{}}>
                      <div style={{marginLeft:'18px'}}>{moment.utc(o.createdDate).local().startOf('seconds').fromNow()}</div>
                      {/* <div style={{marginLeft:'18px'}}>{o._id}</div> */}
                      </CardMedia>
                    <CardContent>
                      <div style={{backgroundColor:'#66c2ff',border:'2px solid #4CCDE7',marginTop:'16px',width:'90%',borderRadius:'14px',padding:'3px'}}>
                      <div>{o.body}</div>
                      <div>
                    
                      </div>
                      {o.files!==''?(<div>
                     
    
                         
                         {JSON.parse(o.files).map((k)=>{
                           return(
                             <div >
                              
                               {k.substr(k.length - 3)=='pdf'?(
                            
                          <div>
                       
                        <div>
                         
                          <div><embed src={k} height={450} width={450}>
                          </embed></div>
                        </div>
                        </div>
                     
                               ):(
                                <Image cloudName={JSON.stringify(k).split("res.cloudinary.com")[1].split("/")[1]} version={JSON.stringify(k).split("/v")[1].split("/")[0]} publicId={'/Posts/'+JSON.stringify(k).split("/Posts/")[1].replace('"',"")} >
                                <Transformation angle="-45"/>
                                 <Transformation effect="trim" angle="45" crop="scale" width="645"/>
                          </Image>
                               )}
                             </div>
    
    
                           )
                         })}
                        
                       
                       </div>):(null)}
                       <div style={{display:'flex',flexDirection:'column'}}>
                       
    
                        <div>
                          {parseInt(o.likesData)>0?(
                               <div style={{display:'flex',flexDirection:'row'}}>
                                <Button onClick={()=>{showReactions(o._id)}} style={{backgroundColor:'pink'}} >
                                  {o.likesData}&#128516;&#128151;&#128079;
                                <a href="https://img.icons8.com/?size=512&id=yeicDsknq50G&format=png" target='_blank'>
                                  <img src='https://img.icons8.com/?size=512&id=yeicDsknq50G&format=png' style={{width: '18px', height: '18px',verticalAlign: 'middle', marginLeft: '4px'}}/>
                                </a>
                                </Button> 
    
                               
                               
                               </div>
                          ):(null)}
    
                         
                        </div>
    
                        <div>
                            {reactionsDataPostId==o._id && reactionsData && reactionsData.length>0?(
                              <div>
                               {
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                {reactionsData.map((o) => {
                                  const reactionHeight = o.likes.length * 60 + 40; // Calculate height based on number of likes
                              
                                  return (
                                    <div
                                      key={o.reactionType}
                                      style={{
                                        marginRight: '10px',
                                        width: `${averageButtonWidth}%`,
                                      }}
                                    >
                                      <button
                                        style={{
                                          background: selectedReaction === o.reactionType ? 'blue' : 'gray',
                                          color: 'white',
                                          padding: '5px 10px',
                                          border: 'none',
                                          borderRadius: '5px',
                                          cursor: 'pointer',
                                          width: '100%',
                                        }}
                                        onClick={() => handleReactionClick(o)}
                                      >
                                        {reactionMap.get(o.reactionType)}
                                      </button>
                                      {selectedReaction === o.reactionType && (
                                        <div
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: `${reactionHeight}px`, // Set the calculated height
                                          }}
                                        >
                                          {o.likes.map((k) => (
                                            <div
                                              key={k._id}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: '10px',
                                                height: '60px', // Fixed height for each like row
                                              }}
                                            >
                                              <div style={{ flex: '0 0 60px', marginRight: '10px' }}>
                                                <img
                                                  src={k.userId.profilePic}
                                                  width={60}
                                                  height={60}
                                                  alt="Profile"
                                                  style={{ objectFit: 'cover' }}
                                                />
                                              </div>
                                              <div style={{ flex: '1', overflow: 'hidden' }}>
                                                <div
                                                  style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                  }}
                                                >
                                                  {k.userId._id==localStorage.getItem("userId")?'You':k.userId.Name}
                                                  {/* {k.userId.Name} */}
                                                </div>
                                                <div
                                                  style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                  }}
                                                >
                                                  {k.userId.headline}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              
                               }
    
                              </div>
                            ):(null)}
                        </div>
                        <div className={classes.postActions} > 
                        <div><Button style={{backgroundColor:'pink'}} onClick={()=>{setShowReaction(!showReaction); setReactionId(o._id)}}>React</Button></div>
                        {showReaction && reactionId==o._id?(
                          <div>
                            <Button onClick={()=>{handleReaction('like',o._id)}}>Like</Button>
                            <Button onClick={()=>{handleReaction('love',o._id)}}>Love</Button>
                            <Button onClick={()=>{handleReaction('laugh',o._id)}}>Laugh</Button>
                            <Button onClick={()=>{handleReaction('support',o._id)}}>Support</Button>
                          </div>
                        ):(null)}
                        <Button style={{backgroundColor:'pink'}} onClick={()=>{handleCommentpopup(o._id)}}>Comment</Button>
                        <div><Button style={{backgroundColor:'pink'}} >Repost</Button></div>
                        </div>
                       </div>
                       {showComments && postId==o._id ?(
                        <div>
                          <div>
                          {
                            showCommentInput?(
                              <div>
                              <Input type="text" value={newComment} onChange={(e)=>{setNewComment(e.target.value)}}/>
                              <Button style={{backgroundColor:'pink'}} onClick={()=>{handleAddNewComment()}}>Add Comment</Button>
                              <Button style={{backgroundColor:'pink'}} onClick={()=>{handleCancel()}}>Cancel</Button>
                              </div>
                            ):(null)
    
                          }
    
                        </div>
         
    
                           <div>
                          <ul>
                            {commentsData.map((comment) => (
                              <Tree
                                key={comment._id}
                                comment={comment}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                                onAddComment={handleAddComment}
                                successfullyUpdated={successfullyUpdated} userId={localStorage.getItem("userId")} parentCommentId=''
                                parentId={comment._id}
                              />
                            ))}
                          </ul>
                        </div>
                         
    
                        </div>
    
                       ):(null)}
                     
                      </div>
                      </CardContent>
                      </Card>
                      
                    )
                  })}
    
                
                </div>
                  
                )
              })}

                </div>

            ):(null)
          }

          {
            dataByExp?(
              <div style={{marginLeft:'30%',marginRight:'30%'}}>
             
              {data.map((o,index)=>{
                return(
                <Card sx={{ backgroundColor:'',border:'2px solid yellow',marginTop: index > 0 ? '20px' : '0', }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{}} aria-label="recipe" >
                     {o.userId && o.userId.profilePic!==''?
                    <Button onClick={()=>{o.userId._id!=localStorage.getItem("userId") ? window.location.href=`/viewProfile/${o.userId._id}/${localStorage.getItem("userId")}`:window.location='/viewMyProfile'}} >
                     <img src={o.userId.profilePic} height='100%' width='100%'/>
                     </Button>
                     :o.userId.Name[0]} 
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon onClick={()=>{handleSavePosts(o._id)}}/>
                    </IconButton>
                  }
                  title={o.userId.Name}
                  subheader={o.userId.headline}
                
                />
                
                <CardMedia sx={{}}>
                  <div style={{marginLeft:'18px'}}>{moment.utc(o.createdDate).local().startOf('seconds').fromNow()}</div>
                  {/* <div style={{marginLeft:'18px'}}>{o._id}</div> */}
                  </CardMedia>
                <CardContent>
                  <div style={{backgroundColor:'#66c2ff',border:'2px solid #4CCDE7',marginTop:'16px',width:'90%',borderRadius:'14px',padding:'3px'}}>
                  <div>{o.body}</div>
                  <div>
                
                  </div>
                  {o.files!==''?(<div>
                 

                     
                     {JSON.parse(o.files).map((k)=>{
                       return(
                         <div >
                          
                           {k.substr(k.length - 3)=='pdf'?(
                        
                      <div>
                   
                    <div>
                     
                      <div><embed src={k} height={450} width={450}>
                      </embed></div>
                    </div>
                    </div>
                 
                           ):(
                            <Image cloudName={JSON.stringify(k).split("res.cloudinary.com")[1].split("/")[1]} version={JSON.stringify(k).split("/v")[1].split("/")[0]} publicId={'/Posts/'+JSON.stringify(k).split("/Posts/")[1].replace('"',"")} >
                            <Transformation angle="-45"/>
                             <Transformation effect="trim" angle="45" crop="scale" width="645"/>
                      </Image>
                           )}
                         </div>


                       )
                     })}
                    
                   
                   </div>):(null)}
                   <div style={{display:'flex',flexDirection:'column'}}>
                   

                    <div>
                      {parseInt(o.likesData)>0?(
                           <div style={{display:'flex',flexDirection:'row'}}>
                            <Button onClick={()=>{showReactions(o._id)}} style={{backgroundColor:'pink'}} >
                              {o.likesData}&#128516;&#128151;&#128079;
                            <a href="https://img.icons8.com/?size=512&id=yeicDsknq50G&format=png" target='_blank'>
                              <img src='https://img.icons8.com/?size=512&id=yeicDsknq50G&format=png' style={{width: '18px', height: '18px',verticalAlign: 'middle', marginLeft: '4px'}}/>
                            </a>
                            </Button> 

                           
                           
                           </div>
                      ):(null)}

                     
                    </div>

                    <div>
                        {reactionsDataPostId==o._id && reactionsData && reactionsData.length>0?(
                          <div>
                           {
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {reactionsData.map((o) => {
                              const reactionHeight = o.likes.length * 60 + 40; // Calculate height based on number of likes
                          
                              return (
                                <div
                                  key={o.reactionType}
                                  style={{
                                    marginRight: '10px',
                                    width: `${averageButtonWidth}%`,
                                  }}
                                >
                                  <button
                                    style={{
                                      background: selectedReaction === o.reactionType ? 'blue' : 'gray',
                                      color: 'white',
                                      padding: '5px 10px',
                                      border: 'none',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      width: '100%',
                                    }}
                                    onClick={() => handleReactionClick(o)}
                                  >
                                    {reactionMap.get(o.reactionType)}
                                  </button>
                                  {selectedReaction === o.reactionType && (
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: `${reactionHeight}px`, // Set the calculated height
                                      }}
                                    >
                                      {o.likes.map((k) => (
                                        <div
                                          key={k._id}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                            height: '60px', // Fixed height for each like row
                                          }}
                                        >
                                          <div style={{ flex: '0 0 60px', marginRight: '10px' }}>
                                            <img
                                              src={k.userId.profilePic}
                                              width={60}
                                              height={60}
                                              alt="Profile"
                                              style={{ objectFit: 'cover' }}
                                            />
                                          </div>
                                          <div style={{ flex: '1', overflow: 'hidden' }}>
                                            <div
                                              style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                              }}
                                            >
                                              {k.userId._id==localStorage.getItem("userId")?'You':k.userId.Name}
                                              {/* {k.userId.Name} */}
                                            </div>
                                            <div
                                              style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                              }}
                                            >
                                              {k.userId.headline}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                           }

                          </div>
                        ):(null)}
                    </div>
                    <div className={classes.postActions} > 
                    <div><Button style={{backgroundColor:'pink'}} onClick={()=>{setShowReaction(!showReaction); setReactionId(o._id)}}>React</Button></div>
                    {showReaction && reactionId==o._id?(
                      <div>
                        <Button onClick={()=>{handleReaction('like',o._id)}}>Like</Button>
                        <Button onClick={()=>{handleReaction('love',o._id)}}>Love</Button>
                        <Button onClick={()=>{handleReaction('laugh',o._id)}}>Laugh</Button>
                        <Button onClick={()=>{handleReaction('support',o._id)}}>Support</Button>
                      </div>
                    ):(null)}
                    <Button style={{backgroundColor:'pink'}} onClick={()=>{handleCommentpopup(o._id)}}>Comment</Button>
                    <div><Button style={{backgroundColor:'pink'}} >Repost</Button></div>
                    </div>
                   </div>
                   {showComments && postId==o._id ?(
                    <div>
                      <div>
                      {
                        showCommentInput?(
                          <div>
                          <Input type="text" value={newComment} onChange={(e)=>{setNewComment(e.target.value)}}/>
                          <Button style={{backgroundColor:'pink'}} onClick={()=>{handleAddNewComment()}}>Add Comment</Button>
                          <Button style={{backgroundColor:'pink'}} onClick={()=>{handleCancel()}}>Cancel</Button>
                          </div>
                        ):(null)

                      }

                    </div>
     

                       <div>
                      <ul>
                        {commentsData.map((comment) => (
                          <Tree
                            key={comment._id}
                            comment={comment}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            onAddComment={handleAddComment}
                            successfullyUpdated={successfullyUpdated} userId={localStorage.getItem("userId")} parentCommentId=''
                            parentId={comment._id}
                          />
                        ))}
                      </ul>
                    </div>
                     

                    </div>

                   ):(null)}
                 
                  </div>
                  </CardContent>
                  </Card>
                  
                )
              })}

            
            </div>

            ):(null)

          }
          

      </div>
    

      ):(
      
      <div>

        {
          <div>
            {searchedData.companies && searchedData.companies.length>0?(
                <div>
                  {
                    searchedData.companies.map((i)=>{
                      return(
                        <div>
                          {i.name}
                        </div>
                      )
                    })
                  }

                </div>
              ):(null)
            }

            {
              searchedData.postsData && searchedData.postsData.length>0?(
                <div>
                  {
                    searchedData.postsData.map((o)=>{
                      return(
                        <div>
                           <div style={{backgroundColor:'orange',border:'2px solid maroon',marginTop:'6px',width:'670px'}}>
                  <div>{o.body}</div>
                  <div>
                
                  </div>
                  {o.files!==''?(<div>
                 

                     
                     {JSON.parse(o.files).map((k)=>{
                       return(
                         <div >
                          
                           {k.substr(k.length - 3)=='pdf'?(
                       
                      <div>
                    
                    <div>
                     
                      <div><embed src={k} height={450} width={450}>
                      </embed></div>
                    </div>
                    </div>
                 
                           ):(
                            <Image cloudName={JSON.stringify(k).split("res.cloudinary.com")[1].split("/")[1]} version={JSON.stringify(k).split("/v")[1].split("/")[0]} publicId={'/Posts/'+JSON.stringify(k).split("/Posts/")[1].replace('"',"")} >
                            <Transformation angle="-45"/>
                             <Transformation effect="trim" angle="45" crop="scale" width="645"/>
                      </Image>
                           )}
                         </div>


                       )
                     })}
                    
                   
                   </div>):(null)}
                   <div style={{display:'flex',flexDirection:'column'}}>
                   

                    <div>
                      {parseInt(o.likesData)>0?(
                           <div style={{display:'flex',flexDirection:'row'}}>
                            <Button onClick={()=>{showReactions(o._id)}} >
                              {o.likesData}&#128516;&#128151;&#128079;
                            <a href="https://img.icons8.com/?size=512&id=yeicDsknq50G&format=png" target='_blank'>
                              <img src='https://img.icons8.com/?size=512&id=yeicDsknq50G&format=png' style={{width: '18px', height: '18px',verticalAlign: 'middle', marginLeft: '4px'}}/>
                            </a>
                            </Button> 

                           
                           
                           </div>
                      ):(null)}

                     
                    </div>

                    <div>
                        {reactionsDataPostId==o._id && reactionsData && reactionsData.length>0?(
                          <div>
                           {
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {reactionsData.map((o) => {
                              const reactionHeight = o.likes.length * 60 + 40; // Calculate height based on number of likes
                          
                              return (
                                <div
                                  key={o.reactionType}
                                  style={{
                                    marginRight: '10px',
                                    width: `${averageButtonWidth}%`,
                                  }}
                                >
                                  <button
                                    style={{
                                      background: selectedReaction === o.reactionType ? 'blue' : 'gray',
                                      color: 'white',
                                      padding: '5px 10px',
                                      border: 'none',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      width: '100%',
                                    }}
                                    onClick={() => handleReactionClick(o)}
                                  >
                                    {reactionMap.get(o.reactionType)}
                                  </button>
                                  {selectedReaction === o.reactionType && (
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: `${reactionHeight}px`, // Set the calculated height
                                      }}
                                    >
                                      {o.likes.map((k) => (
                                        <div
                                          key={k._id}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                            height: '60px', // Fixed height for each like row
                                          }}
                                        >
                                          <div style={{ flex: '0 0 60px', marginRight: '10px' }}>
                                            <img
                                              src={k.userId.profilePic}
                                              width={60}
                                              height={60}
                                              alt="Profile"
                                              style={{ objectFit: 'cover' }}
                                            />
                                          </div>
                                          <div style={{ flex: '1', overflow: 'hidden' }}>
                                            <div
                                              style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                              }}
                                            >
                                              {k.userId._id==localStorage.getItem("userId")?'You':k.userId.Name}
                                            </div>
                                            <div
                                              style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                              }}
                                            >
                                              {k.userId.headline}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                           }

                          </div>
                        ):(null)}
                    </div>

                    <div><Button style={{backgroundColor:'pink'}} onClick={()=>{setShowReaction(!showReaction); setReactionId(o._id)}}>React</Button></div>
                    {showReaction && reactionId==o._id?(
                      <div>
                        <button onClick={()=>{handleReaction('like',o._id)}}>Like</button>
                        <button onClick={()=>{handleReaction('love',o._id)}}>Love</button>
                        <button onClick={()=>{handleReaction('laugh',o._id)}}>Laugh</button>
                        <button onClick={()=>{handleReaction('support',o._id)}}>Support</button>
                      </div>
                    ):(null)}
                    <Button style={{backgroundColor:'pink'}} onClick={()=>{handleCommentpopup(o._id)}}>Comment</Button>
                   
                    <div><Button style={{backgroundColor:'pink'}} >Repost</Button></div>
                   </div>
                   {showComments && postId==o._id ?(
                      

                      <Tree data={commentsData} onUpdate={handleUpdate} onDelete={handleDelete} successfullyUpdated={successfullyUpdated} userId={localStorage.getItem("userId")} parentCommentId='' />


                   ):(null)}
                 
                        </div>
                        </div>
                      )
                    })
                  }
                </div>
              ):(null)
            }

            {
              searchedData.users && searchedData.users.length>0?(
                <div>
                  {
                    searchedData.users.map((o)=>{
                      return(
                        <div>
                           <div  style={{flexBasis:'25%',backgroundColor:'pink',marginRight:'5px'}}>
                            <div >{o.Name}</div>&nbsp;&nbsp;{o._id}
                            <div>{o.headline}</div>
                            <div style={{cursor:'pointer'}} onClick={()=>{o._id!=localStorage.getItem("userId")? window.location.href=`/viewProfile/${o._id}/${localStorage.getItem("userId")}` : window.location='/viewMyProfile'}} ><img src={o.profilePic} width={50} height={50}/></div>
                            </div>
                        </div>
                      )
                    })
                  }
                </div>
              ):(null)
            }
            </div>
          
        }

      </div>)}

      <div style={{display:'flex',flexDirection:'row'}}>
        
        <Button  onClick={()=>{window.location.href='/createPosts'}} style={{flex:2,backgroundColor:'#99ceff'}} >Post</Button>
        <Button  style={{flex:2,backgroundColor:'#cce6ff'}}  onClick={()=>{window.location='/MyNetwork'}} >My Network</Button>
        <Button  style={{flex:2,backgroundColor:'#99ceff'}} onClick={()=>{window.location=`/Notifications/${localStorage.getItem("userId")}`}} >Notifications</Button>
      </div>
    </div>
 
);
};
export default HomeScreen
