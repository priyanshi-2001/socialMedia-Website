import React from 'react'
import { useEffect,useState } from 'react'
import {Button,Input, OutlinedInput, TextField }from '@mui/material';
const ProfilePicUpload = (props) => {
  const [data,setData]=useState(props.data);
  const[page,setPage]=useState(props.page);

  const[base64String,setBase64String]=useState([]);
  const[blobPdfUrl, setBlobPdfUrl]=useState([]);
  const[imagesBlobUrl,setImagesBlobUrl]=useState([]);
  const [videoBlobUrl,setVideoBlobUrl]=useState([]);
  const[mappings,setMappings]=useState([]);


  const[showPreview,setPreview]=useState(false);
    

  const [files,setFiles]=useState([]);//store encoded form of the doc here

  const handleChange=async(e)=>{
    var temp=Array.prototype.slice.call(e.target.files);
    setFiles(temp);
   
    await showPreviewForFiles(temp);
        
        if(base64String!==[]){
            setPreview(true)
       }  
    setData((prev)=>({...prev,[e.target.name]:e.target.files[0]}));

  }
  const showPreviewForFiles =async(temp)=>{
    var obj=[];
    var j=0;
    while(j<temp.length){
        obj.push(temp[j]);
        const base64Temp=await getBase64(temp[j]);    
        j++; 
    }
  

}

const getBase64=async(file) =>{
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload =async function () {
    await conditionsPeview(reader.result,file);
    const tempData=data;
    tempData['profilePic']=reader.result;
    // setData((prev)=>({...prev,profilePic:reader.result}));

    props.newData(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

const conditionsPeview=async(base64Temp,file)=>{
  var tempBase64=[...base64String,base64Temp];
  setBase64String((prev)=>[...prev,base64Temp]);
  let temporaryarray = [...mappings];
  temporaryarray[mappings.length]={};
  temporaryarray[mappings.length]['name'] = file.name;
  temporaryarray[mappings.length]['value'] = base64Temp;
  setMappings(temporaryarray);

  if(base64Temp.startsWith("data:image/png;base64,")){
      setImagesBlobUrl((prev)=>[...prev,base64Temp]);
  }

}

const downloadFileObject=(base64String)=>{
  const linkSource = base64String;
  const downloadLink = document.createElement("a");
  var fileName;
  if(base64String.startsWith("data:image/png;base64,")){
      fileName='Certificate.png';
  }
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

const handleDeleteFiles=(val,a)=>{
  if(a==imagesBlobUrl){
      setImagesBlobUrl(imagesBlobUrl.filter((o)=>o!=val));
      setBase64String(base64String.filter((o)=>o!=val));
  }

}

  

  return (
    <div>
      Profiles with profile pictures gain 80% more views from recruiters!
      <div>
      <label> Upload Profile Picture
      <input type="file" accept="image/png;application/pdf" name="profilePic"  onChange={(e)=>{handleChange(e)}}/>
      </label>
      </div>
      <div>
      {base64String.length>0 && files.length>0 && showPreview ?(
        <div  style={{display:'flex',flexDirection:'row',gap:'60px'}}>
           <div style={{display:'flex',flexDirection:'column',gap:'60px'}}>

                {imagesBlobUrl.map((o)=>{
                  return(
                      <div>
                      <img src={o} height={500} width={500} /> 
                      <div>
                      <Button onClick={()=>{downloadFileObject(o)}}>Download</Button>
                      <Button onClick={()=>{handleDeleteFiles(o,imagesBlobUrl)}}>Delete</Button>
                      </div>
                      </div>
                  )
                })}

                </div>

        </div>
      ):(null)}
      </div>
    </div>
  )
}

export default ProfilePicUpload
