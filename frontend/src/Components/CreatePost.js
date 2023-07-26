import {React,useState,useEffect} from 'react'
import {Input,Button,TextField} from '@mui/material'
const url="http://localhost:8000/";
const CreatePost = () => {
    const [details,setDetails]=useState({
        body:'',
        userId:localStorage.getItem("userId")
        
    })
    const[base64String,setBase64String]=useState([]);
    const[blobPdfUrl, setBlobPdfUrl]=useState([]);
    const[imagesBlobUrl,setImagesBlobUrl]=useState([]);
    const [videoBlobUrl,setVideoBlobUrl]=useState([]);


    const[previewPdf,setPreviewPdf]=useState([]);
    const[previewImages,setPreviewImages]=useState([]);
    const[previewVideos,setPreviewVideos]=useState([]);

    const[mappings,setMappings]=useState([]);

    const[showPreview,setPreview]=useState(false);
    

    const [files,setFiles]=useState([]);//store encoded form of the doc here

    const handleDummy=()=>{
        
        var temp=[...previewPdf]
        temp[previewPdf.length]={};
        temp[previewPdf.length]['name']='pp'
        temp[previewPdf.length]['value']='ggg';
        console.log("temp",temp);
        setPreviewPdf(temp);
    }

    const handleFile=async(e)=>{
        // console.log(e,Array.prototype.slice.call(e.target.files));
        var temp=Array.prototype.slice.call(e.target.files);
        setFiles(temp);
        await showPreviewForFiles(temp);
            // console.log("here innn blobPdfUrl is->",base64String,blobPdfUrl,"imagesBlobUrl",imagesBlobUrl,videoBlobUrl);
            
            if(base64String!==[]){
                // console.log("base64inside condn",base64String)
                setPreview(true)
           }  
    }

    const showPreviewForFiles =async(temp)=>{
        var obj=[];
        var j=0;
        // console.log("j is",j);
        while(j<temp.length){
            obj.push(temp[j]);
            const base64Temp=await getBase64(temp[j]);   
           
           
            j++; 
        }
     
    }

    const conditionsPeview=async(base64Temp,file)=>{
            var tempBase64=[...base64String,base64Temp];
            // console.log("base64String inside conditionpreview",base64String,"tempBase64",tempBase64);
            setBase64String((prev)=>[...prev,base64Temp]);
            let temporaryarray = [...mappings];
            temporaryarray[mappings.length]={};
            temporaryarray[mappings.length]['name'] = file.name;
            temporaryarray[mappings.length]['value'] = base64Temp;
            setMappings(temporaryarray);
         
            // // console.log("blob",blob);
            if (base64Temp.startsWith("data:application/pdf;base64,")){
                
                setBlobPdfUrl((prev)=>[...prev,base64Temp]);
                // console.log("pdf",blobPdfUrl);
            }
            if(base64Temp.startsWith("data:image/png;base64,")){
              
                setImagesBlobUrl((prev)=>[...prev,base64Temp]);
                // console.log("images",imagesBlobUrl);
            }
            if(base64Temp.startsWith("PCF")){
                
                setVideoBlobUrl((prev)=>[...prev,base64Temp]);
            }
        
    }

    const createPost=async()=>{
        try{
            var formData=new FormData();
            for (let i = 0 ; i < files.length ; i++) {
                formData.append("files", files[i]);
            }
            formData.append("body",details.body); 
            formData.append("userId",details.userId);
            // console.log(JSON.stringify(formData.get("files")));
            // console.log(JSON.stringify(formData.get("details")));
            const res=await fetch(url+"createPost",{
            headers:{
                'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            method:'POST',
            body:formData
        })
        const resp=await res.json();
        // console.log("resp",resp);
        if(resp.Error=='NA'){
            localStorage.setItem("justCreatedPosts",resp.postsRec._id);
            setBase64String(resp['encodedData']);
            window.location.href="/homeScreen";

            // console.log("base64",resp['encodedData'],base64String);
            // for(let i=0;i<resp['encodedData'].length;i++){
            //     const blob = base64toBlob(resp['encodedData'][i]);
            //     console.log("blob",blob);
            //     const url = URL.createObjectURL(blob);
            //     if (resp['encodedData'][i].startsWith("JVB")){
            //         var temp=[...blobPdfUrl];
            //         temp.push(resp['encodedData'][i]);
            //         setBlobPdfUrl(temp);
            //         console.log("pdf",blobPdfUrl);
            //     }
            //     if(resp['encodedData'][i].startsWith("iVB")){
            //         var temp=[...imagesBlobUrl];
            //         temp.push(resp['encodedData'][i]);
            //         setImagesBlobUrl(temp);
            //         console.log("images",imagesBlobUrl);
            //     }
            //     if(resp['encodedData'][i].startsWith("PCF")){
            //         var temp=[...videoBlobUrl]
            //         temp.push(resp['encodedData'][i])
            //         setVideoBlobUrl(temp);
            //     }
            // }
           
        }


        }
        catch(err){
            console.log("err",err);
        }
    }

    const downloadAsPDF=(pdf) =>{

        var base64String = document.getElementById("Base64StringTxtBox").value;
      
        if (base64String.startsWith("JVB")) {
          base64String = "data:application/pdf;base64," + base64String;
          downloadFileObject(base64String);
        } else if (base64String.startsWith("data:application/pdf;base64")) {
          downloadFileObject(base64String);
        } else {
          alert("Not a valid Base64 PDF string. Please check");
        }
      
      }
      
    const downloadFileObject=(base64String)=>{
        const linkSource = base64String;
        const downloadLink = document.createElement("a");
        var fileName;
        if(base64String.startsWith("data:application/pdf;base64,")){

        
         fileName = "FilePdf.pdf";
        }
        if(base64String.startsWith("data:image/png;base64,")){
            fileName='FileImage.png';
        }
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }

    const handleDeleteFiles=(val,a)=>{
        
        if(a==blobPdfUrl){
            setBlobPdfUrl(blobPdfUrl.filter((o)=>o!=val));
            setBase64String(base64String.filter((o)=>o!=val));
            // console.log("map",mappings);
            // var toDeleteFileName=mappings.find((o)=>o.value==val);
            // console.log("nameOfFile",toDeleteFileName.name);
            // console.log("kkk",files.filter((o)=>o.name!=toDeleteFileName.name))
            // setFiles(files.filter((o)=>o.name!==toDeleteFileName.name));
        }
        if(a==imagesBlobUrl){
            setImagesBlobUrl(imagesBlobUrl.filter((o)=>o!=val));
            setBase64String(base64String.filter((o)=>o!=val));
            // console.log("map",mappings);
            // var toDeleteFileName=mappings.find((o)=>o.value==val);
            // console.log("nameOfFile",toDeleteFileName.name);
            // console.log("kkk",files.filter((o)=>o.name!=toDeleteFileName.name))
            // setFiles(files.filter((o)=>o.name!=toDeleteFileName.name));
        }


    }

    const handleChange=(e)=>{

        setDetails((prev)=>({...prev,[e.target.name]:e.target.value}));
        console.log("details",details);
    }

    const getBase64=async(file) =>{
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload =async function () {
            
        //   console.log("here in getbase64",reader.result);
          await conditionsPeview(reader.result,file);
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
     }

    const base64toBlob =async(data) => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        console.log("data",data);
        var base64WithoutPrefix;
        if(data.startsWith("data:application/pdf;base64,")){
         base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);
        }
        if(data.startsWith("data:image/png;base64,")){
         base64WithoutPrefix = data.substr('data:image/png;base64,'.length);
        }
        //add for videos also
    
        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);
    
        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }
    
        return new Blob([out], { type: 'application/pdf' });
    };


  return (
  
<div style={{backgroundImage: "url('https://example.com/your-image.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
  <div style={{textAlign: 'center', marginBottom: '20px'}}>
    <div>
      {console.log("previewPdf is", previewPdf)}
      {previewPdf.map((o, index) => {
        return (
          <div key={index} style={{marginBottom: '10px'}}>
            {o.name}&nbsp;&nbsp;{o.value}
          </div>
        )
      })}
    </div>
    <div>
      <TextField
        placeholder='Please enter Body of Post'
        name='body'
        value={details.body}
        rows={20}
        multiline
        sx={{width:'600px'}}
        onChange={(e) => {handleChange(e)}}
        style={{width: '600px'}}
      />
    </div>
    <div>
      <input type="file" multiple onChange={(e) => {handleFile(e)}} style={{marginTop: '10px'}}/>
    </div>
    <div>
      <Button onClick={() => {createPost()}} style={{marginTop: '10px'}}>Add</Button>
    </div>

    {console.log("ffff base64Stringis", base64String, "mappings", mappings, "showpreview", showPreview, "files", files, "blobPdfUrl", blobPdfUrl, "imageurls", imagesBlobUrl)}
    {base64String.length > 0 && files.length > 0 && showPreview ? (
      <div style={{display: 'flex', flexDirection: 'row', gap: '60px', marginTop: '20px'}}>
        {console.log("blobPdfUrl inside true", blobPdfUrl)}
        <div style={{display: 'flex', flexDirection: 'column', gap: '60px'}}>
          {blobPdfUrl.map((o, index) => {
            console.log("ppp pdf blobs url are", o);
            return (
              <div key={index}>
                <embed src={o} height={500} width={500} style={{marginBottom: '10px'}}/>
                <div>
                  <Button onClick={() => {downloadFileObject(o)}}>Download</Button>
                  <Button onClick={() => {handleDeleteFiles(o, blobPdfUrl)}}>Delete</Button>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '60px'}}>
          {imagesBlobUrl.map((o, index) => {
            console.log("image urls", o);
            return (
              <div key={index}>
                <img src={o} height={500} width={500} alt="Red dot" style={{marginBottom: '10px'}}/>
                <div>
                  <Button onClick={() => {downloadFileObject(o)}}>Download</Button>
                  <Button onClick={() => {handleDeleteFiles(o, imagesBlobUrl)}}>Delete</Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    ) : (null)}
  </div>
</div>


  )
}

export default CreatePost