import React from 'react'
import { useEffect,useState } from 'react'
import {Button,Input, OutlinedInput, TextField }from '@mui/material';
const CurrentJob = (props) => {
  console.log("props",props);
  const [data,setData]=useState(props.data);
  const[page,setPage]=useState(props.page);
  const handleChange=(e)=>{
    const tempObj=data;
    tempObj[e.target.name]=e.target.value;
    setData((prev)=>({...prev,[e.target.name]:e.target.value}));
    props.newData(tempObj);

}

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
      <div>
      <TextField
      label="Enter Current Job Title"
      name="currentJobTitle"
      value={data.currentJobTitle}
      onChange={(e)=>handleChange(e)}
      />
          <div>
          <span id="errorcurrentJobTitle" style={{color:'red'}}></span>
          </div>
      </div>
      <div>
      <TextField
      label="Enter Current Company's Name"
      name="currentJobCompany"
      value={data.currentJobCompany}
      onChange={(e)=>handleChange(e)}
      />
          <div>
          <span id="errorcurrentJobCompany" style={{color:'red'}}></span>
          </div>
      </div>
       <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
        <div>Enter your  Joining Date in this Company

       <TextField
        name="currentJobStartDate"
        type="date"
        value={data.currentJobStartDate}
        onChange={(e)=>handleChange(e)}
        />
          <div>
          <span id="errorcurrentJobStartDate" style={{color:'red'}}></span>
          </div>
          </div>
       </div>
        <div>
       <TextField
        label="Enter Work Description in this Company"
        name="workDesc"
        value={data.workDesc}
        onChange={(e)=>handleChange(e)}
        />
          <div>
          <span id="errorworkDesc" style={{color:'red'}}></span>
          </div>
      </div>
      <div>
       <TextField
        label="Enter Location of this Company"
        name="curentJobLoc"
        value={data.curentJobLoc}
        onChange={(e)=>handleChange(e)}
        />
          <div>
          <span id="errorcurentJobLoc" style={{color:'red'}}></span>
          </div>
      </div>
      

    </div>
  )
}

export default CurrentJob
