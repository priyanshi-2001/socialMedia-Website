import React from 'react'
import { useEffect,useState } from 'react'
import {Button,Input, OutlinedInput, TextField }from '@mui/material';
import {FormControl,FormData,Typography,CardHeader,Card,Radio,CardContent,FormLabel,RadioGroup,FormControlLabel} from '@mui/material';

const AddExperience = (props) => {
  console.log("props",props);
  const[page,setPage]=useState(props.page);
  const[experience,setExperience]=useState([{
    title:"",
    companyName:"",
    joiningDate:"",
    endDate:"",
    workDesc:"",
    locationCity:""
  }]);
  const[isFresher,setFresher]=useState(false);

  const handleChangeFresher=(e)=>{
    setFresher(e.target.value);
    props.handleFresher(e.target.value);

  }

  const handleChange=(e,i)=>{
    const{name,value}=e.target;
    const tempObj=[...experience];
    tempObj[i][name]=value;
    setExperience(tempObj);
    props.newData(tempObj);
   
}


const removeExp=(i)=>{
       
  const tempObj=[...experience];
 
  tempObj.splice(i,1);
  
  setExperience(tempObj);
  console.log(experience,"deletion")
}

const handleAddExp=()=>{
  setExperience([...experience,
     {
      title:"",
      companyName:"",
      joiningDate:"",
      endDate:"",
      workDesc:"",
      locationCity:""
     }
  ]);
  console.log("addition",experience);
}

  return (
    <div>
      {console.log("exp",experience)}
       {experience.map((x,i)=>{
            return(
           <div>
              <Card key={i}>
                    <CardHeader> &#xf3e0; Experience {i} </CardHeader>
                    <CardContent>
                      <Typography>
                     
                        <div>
                        <label>Job Title
                       
                          <input type="text"  placeholder='Job Title' name='title' value={experience[i].title} onChange={(e)=>handleChange(e,i)}/>
  
                        </label>
                        </div>
                        <div>
                        <label> Company Name:
                        <input type="text"  placeholder='Company Name' name='companyName'  value={experience[i].companyName} onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                        <div>
                        <label> Work Description:
                        <input type="text"  placeholder='Work Description' name='workDesc'value={experience[i].workDesc}  onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                        <div>
                        <label> Joining Date:
                        <input type="date"  placeholder='Joining Date'  name='joiningDate' value={experience[i].joiningDate} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div>
                        <label> Ending Date:
                        <input type="date"  placeholder='Ending Date'  name='endDate' value={experience[i].endDate} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div>
                        {experience.length!==1 &&
                            <Button onClick={()=>removeExp(i)}>Remove</Button>
                        }
                        {
                            experience.length-1===i &&
                            <Button onClick={()=>{handleAddExp()}}>Add Experience</Button>
                            
                        }
                        </div>

                      </Typography>
                     
                    </CardContent>

                 
              </Card>
               
             
           </div>
            )
            })}


              <FormControl>

              <FormLabel id="demo-controlled-radio-buttons-group">Fresher?</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="isFresher"
                // value={value}
                row
                onChange={(e)=>{handleChangeFresher(e)}}
              >
                <FormControlLabel value={true} checked={isFresher==true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} checked={isFresher==false} control={<Radio />} label="No" />

              </RadioGroup>
              </FormControl> 

              <Typography>
                <span id="errorExperience"></span>
              </Typography>

    </div>
  )
}

export default AddExperience
