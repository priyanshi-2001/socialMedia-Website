import React from 'react'
import { useEffect,useState } from 'react'
import {Button,Input, OutlinedInput, TextField }from '@mui/material';
import {FormControl,FormData,Typography,Radio,CardHeader,Card,CardContent,FormLabel,RadioGroup,FormControlLabel} from '@mui/material';
import CreatableSelect from 'react-select/creatable';
const url="http://localhost:8000/"
const AddSkills = (props) => {
  const [skills,setSkills]=useState([]);
  const [options, setOptions] = useState([]);

  useEffect(()=>{
    (async()=>{
      await fetchSkills()
    })()
  },[])
   
  const fetchSkills=async()=>{
    try{
      const res=await fetch(url+"fetchSkills",{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          // 'Authorization':`Bearer ${localStorage.getItem("token")}`
        },

      },
      );
      const resp=await res.json();
      if(resp.Error=='NA'){
        var tempSkills=resp.Skills;
        tempSkills.forEach(i=>{i.value=i.name;i.label=i.name});
        setOptions(tempSkills);
      }
      


    }
    catch(err){
      console.log("err",err);
    }
  }

  const handleOptionChange = (selectedValues) => {
    setSkills(selectedValues);
    props.newData(selectedValues);
  };

  const handleCreateOption = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setOptions((prevOptions) => [...prevOptions, newOption]);
    setSkills((prevSelectedOptions) => [...prevSelectedOptions, newOption]);
    props.newData((prevSelectedOptions) => [...prevSelectedOptions, newOption]);
  };

  
  
  return (
    <div>
      {options.length>0 && (
        <CreatableSelect
        isMulti
        options={options}
        value={skills}
        onChange={handleOptionChange}
        onCreateOption={handleCreateOption}
        placeholder="Select skills or create a new one"
        isClearable
      />
      )}
       
    

    </div>
  )
}

export default AddSkills
