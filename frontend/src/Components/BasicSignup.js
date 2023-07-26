import React from 'react'
import { useEffect,useState } from 'react'
import {Button,Input, OutlinedInput,TextField,FormControl, FormLabel,FormControlLabel,Radio,RadioGroup}from '@mui/material';
const BasicSignup = (props) => {
    const[page,setPage]=useState(props.page);
    const[pageNames,setPagenames]=useState(props.pageNames);
    const[data,setData]=useState(props.data);
    
      
    
    const handleChange=(e)=>{
      const tempObj=data;
      console.log("temp",tempObj,"ppp")
      tempObj[e.target.name]=e.target.value;
        setData((prev)=>({...prev,[e.target.name]:e.target.value}));
        props.newData(tempObj);
    }
    
  return (
    <div style={{display:'flex',gap:'10px',flexDirection:'column'}}>

        <div 
        style={{display:'flex',flexDirection:'row',gap:'270px'}}
        >
          <div>Enter Name</div>
          <div>
          <TextField
          value={data.name}
          name="name"
          label="Name"
          onChange={(e)=>handleChange(e)}
          />
          <span id="errorName" style={{color:'red'}}></span>
          </div>
        

        </div>

        <div style={{display:'flex',flexDirection:'row',gap:'270px'}}>
          <div>Enter Email</div>
          <div>
          <TextField
          value={data.email}
          name="email"
          label="Email"
          onChange={(e)=>handleChange(e)}
          />
           <span id="errorEmail" style={{color:'red'}}></span>
          </div>

        </div>

        <div style={{display:'flex',flexDirection:'row',gap:'210px'}}>
          <div>Enter Phone Number:</div>
          <div>
          <TextField
          value={data.phNum}
          name="phNum"
          label="Phone Number"
          onChange={(e)=>handleChange(e)}
          />
           <span id="errorPhNum" style={{color:'red'}}></span>
          </div>
          
        </div>

        <div >
        <FormControl style={{display:'flex',flexDirection:'row',gap:'248px'}}>

          <FormLabel id="demo-controlled-radio-buttons-group"> Select Gender</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="gender"
            // value={value}
            row
            
            onChange={(e)=>{handleChange(e)}}
          >
            <FormControlLabel value="M" checked={data.gender=="M"} control={<Radio />} label="Male" />
            <FormControlLabel value="F" checked={data.gender=="F"} control={<Radio />} label="Female" />

          </RadioGroup>
          </FormControl> 

           <div>
          <span id="errorGender" style={{color:'red'}}></span>
          </div>
        </div>

    </div>
  )
}

export default BasicSignup
