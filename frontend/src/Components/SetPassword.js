import React from 'react'
import { useEffect,useState } from 'react'
import {Button,Input, OutlinedInput, TextField }from '@mui/material';

const SetPassword = (props) => {
    const [data,setData]=useState(props.data);
    const[page,setPage]=useState(props.page);

    const handleChange=(e)=>{
      const tempObj=data;
      tempObj[e.target.name]=e.target.value;
      setData((prev)=>({...prev,[e.target.name]:e.target.value}));
      props.newData(tempObj);
    }
  return (
    <div>
         <div>
          <TextField
          name="password"
          label="Set Password"
          value={data.password}
          type='password'
          hidden={true}
          onChange={(e)=>handleChange(e)}
          />
           <div>
          <span id="errorPwd" style={{color:'red'}}></span>
          </div>

        </div>
        <div style={{marginTop:'5px'}}>
          <TextField
          name="confirmPassword"
          label="Confirm Password"
          value={data.confirmPassword}
          type="password"
          onChange={(e)=>handleChange(e)}
          />
           <div>
          <span id="errorConfirmPwd" style={{color:'red'}}></span>
          </div>

        </div>
    </div>
  )
}

export default SetPassword
