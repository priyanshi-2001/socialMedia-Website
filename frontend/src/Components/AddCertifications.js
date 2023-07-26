import React from 'react'
import { useEffect,useState } from 'react'
import {Button,Input, OutlinedInput, TextField }from '@mui/material';
import {FormControl,FormData,Typography,Radio,CardHeader,Card,CardContent,FormLabel,RadioGroup,FormControlLabel} from '@mui/material';

const AddCertifications = (props) => {
  console.log("props",props);
  const [certifications,setCertifications]=useState([{
    name:"",
    link:"",
    skill:"",
    date:"",
    providedByOrg:"",
    certifFile:""

  }]);
  const[base64String,setBase64String]=useState([]);
  const[blobPdfUrl, setBlobPdfUrl]=useState([]);
  const[imagesBlobUrl,setImagesBlobUrl]=useState([]);
  const [videoBlobUrl,setVideoBlobUrl]=useState([]);
  const[mappings,setMappings]=useState([]);


  const[showPreview,setPreview]=useState(false);

  const handleChange=(e,i)=>{
    console.log("e is",e,"i is",i);
    const{name,value}=e.target;
    const tempObj=[...certifications];
    tempObj[i][name]=value;
    setCertifications(tempObj);
    props.newData(tempObj);
    console.log(certifications,"certif");
   
}

const handleFileChange=async(e,i)=>{
  
    await showPreviewForFiles(e.target.files,i);
        console.log("here innn blobPdfUrl is->",base64String,blobPdfUrl,"imagesBlobUrl",imagesBlobUrl,videoBlobUrl);
        
    

}

const showPreviewForFiles =async(temp,i)=>{
  var obj=[];
  var j=0;
  while(j<temp.length){
      obj.push(temp[j]);
      const base64Temp=await getBase64(temp[j],i);        
      j++; 
  }


}

const getBase64=async(file,i) =>{
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload =async function () {
    await conditionsPeview(reader.result,file);
    const tempObj=[...certifications];
    tempObj[i]['certifFile']=reader.result;
    // console.log("heer22",tempObj);
    setCertifications(tempObj);
    props.newData(tempObj);
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
  if(base64Temp.startsWith("data:image/png;base64,")){
    setImagesBlobUrl((prev)=>[...prev,base64Temp]);
}

}

const removeCertif=(i)=>{
       
  const tempObj=[...certifications];
 
  tempObj.splice(i,1);
  
  setCertifications(tempObj);
  console.log(certifications,"deletion")
}

const handleAddCertif=()=>{
  setCertifications([...certifications,
     {
      name:"",
      link:"",
      skill:"",
      date:"",
      providedByOrg:"",
      certifFile:""

     }
  ]);
  console.log("addition",certifications);
}

const handleDeleteFiles=(i)=>{
        
  var tempObj=[...certifications];
  tempObj[i]['certifFile']=''
  console.log("iside delete certif",tempObj);
  setCertifications(tempObj);
  props.newData(tempObj);

}

const downloadFileObject=(base64String)=>{
  const linkSource = base64String;
  const downloadLink = document.createElement("a");
  var fileName;
  if(base64String.startsWith("data:application/pdf;base64,")){

  
   fileName = "CertificatePdf.pdf";
  }
  if(base64String.startsWith("data:image/png;base64,")){
      fileName='CertificateImage.png';
  }
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}


  return (
    <div>
      {certifications.map((x,i)=>{
            return(
           <div>
              <Card key={i}>
                    <CardHeader> &#xf3e0; Certification {i} </CardHeader>
                    <CardContent>
                      <Typography>
            
                        <div>
                        <label> Name:
                        <input type="text" placeholder='Enter Certification Name' name='name'  value={certifications[i].name} onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                        <div>
                        <label> Certification Link:
                        <input type="text" placeholder='Enter certification Link'  name='link' value={certifications[i].link} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div>
                        <label> Skill
                        <input type="text" placeholder='Enter Skill'  name='skill' value={certifications[i].skill} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div>
                        <label> Date:
                        <input type="date" placeholder='Enter Certification Date' name='date'value={certifications[i].date}  onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                        <div>
                          <label> Certification Organization/Company:
                            <input type="text" name="providedByOrg" value={certifications[i].providedByOrg}  onChange={(e)=>handleChange(e,i)} />
                          </label>
                        </div>
                        {certifications[i].certifFile==''?(
                           <div>
                           <label> Certificate File:
                           <input type="file" name='certifFile' accept="image/png;application/pdf" value={certifications[i].certifFile}  onChange={(e)=>handleFileChange(e,i)} />
                           </label>
   
                           </div>
                        ):(null)}
                        
                        {certifications[i].certifFile!==''?(
                            <div>
                               {certifications[i].certifFile.startsWith("data:application/pdf;")?(
                                <div>
                                  <embed src={certifications[i].certifFile} height={95} width={95} />
                                  <Button onClick={()=>{downloadFileObject(certifications[i].certifFile)}}>Download</Button>
                                  <Button onClick={()=>{handleDeleteFiles(i)}}>Delete</Button>
                                  </div>
                               ):(null)}
                               {certifications[i].certifFile.startsWith("data:image/png;base64,")?(
                                <div>
                                  <img src={certifications[i].certifFile} height={95} width={95} />
                                  <Button onClick={()=>{downloadFileObject(certifications[i].certifFile)}}>Download</Button>
                                  <Button onClick={()=>{handleDeleteFiles(i)}}>Delete</Button>
                                  </div>
                               ):(null)

                               }
                                
                                
                              


                            </div>
                        ):(null)}
                       
                                              
                        <div>
                       
                        {certifications.length!==1 &&
                            <Button onClick={()=>removeCertif(i)}>Remove</Button>
                        }
                        {
                            certifications.length-1===i &&
                            <Button onClick={()=>{handleAddCertif()}}>Add Certification</Button>
                            
                        }
                        </div>

                      </Typography>
                    </CardContent>

                 
              </Card>

           </div>
            )
            })}


    </div>
  )
}

export default AddCertifications
