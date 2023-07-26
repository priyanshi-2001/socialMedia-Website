import React from 'react'
import { useEffect,useState } from 'react'
import {Button,Input, OutlinedInput, TextField }from '@mui/material';
import {FormControl,FormData,Typography,Radio,CardHeader,Card,CardContent,FormLabel,RadioGroup,FormControlLabel} from '@mui/material';

const AddEducation = (props) => {
  console.log("props",props);
  const [education,setEducation]=useState([{
    category:"",
    categoryOptions:"",//S for school, C for college
    name:"",
    locationCity:"",
    startDate:"",
    endDate:"",
    marks:"",
    courseName:"",
    marksCategory:"" //marks,percentage
     
  }])

  const handleChange=(e,i)=>{
    const{name,value}=e.target;
    const tempObj=[...education];
    tempObj[i][name]=value;
    setEducation(tempObj);
    props.newData(tempObj);
    console.log(education,"educ",tempObj);
   
}

const removeEduc=(i)=>{
       
  const tempObj=[...education];
 
  tempObj.splice(i,1);
  
  setEducation(tempObj);
  console.log(education,"deletion")
}

const handleAddEduc=()=>{
  setEducation([...education,
     {
      categoryOptions:"",
      name:"",
      locationCity:"",
      startDate:"",
      endDate:"",
      marks:"",
      courseName:"",
      marksCategory:""
     }
  ]);
  console.log("addition",education);
}

  return (
    <div>
 {education.map((x,i)=>{
            return(
           <div>
              <Card key={i}>
                    <CardHeader> &#xf3e0; Education {i} </CardHeader>
                    <CardContent>
                      <Typography>
                        <div>
                        <FormControl>

                        <FormLabel id="demo-controlled-radio-buttons-group"> Select Category</FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="categoryOptions"
                          // value={value}
                          row
                          onChange={(e)=>{handleChange(e,i)}}
                        >
                          <FormControlLabel value="S" checked={education[i].categoryOptions=="S"} control={<Radio />} label="School" />
                          <FormControlLabel value="C" checked={education[i].categoryOptions=="C"} control={<Radio />} label="College" />

                        </RadioGroup>
                        </FormControl> 
                        </div>
                     
                        <div>
                        <label>Name of &nbsp; {education[i].categoryOptions=='S'?'School':'College'}:
                       
                          <input type="text" placeholder={"Enter "+`${education[i].categoryOptions=='S'?'School':'College'}`} name='name' value={education[i].name} onChange={(e)=>handleChange(e,i)}/>
  
                        </label>
                        </div>
                        <div>
                        <label> Location:
                        <input type="text" placeholder='Enter Location City' name='locationCity'  value={education[i].locationCity} onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                        <div>
                        <label> Joining Date:
                        <input type="date" placeholder='Start Date'  name='startDate' value={education[i].startDate} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div>
                        <label> Ending Date:
                        <input type="date" placeholder='End Date'  name='endDate' value={education[i].endDate} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div>
                        <label> CourseName:
                        <input type="text" placeholder='Enter Course Name' name='courseName'value={education[i].courseName}  onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                       <div>
                        <FormControl>

                        <FormLabel id="demo-controlled-radio-buttons-group"> Select Category Of Marks</FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="marksCategory"
                          // value={value}
                          row
                          onChange={(e)=>{handleChange(e,i)}}
                        >
                          <FormControlLabel value="M" checked={education[i].marksCategory=="M"} control={<Radio />} label="Marks" />
                          <FormControlLabel value="P" checked={education[i].marksCategory=="P"} control={<Radio />} label="Percentage" />

                        </RadioGroup>
                        </FormControl> 
                        </div>
                        <div>
                        <label> Enter {education[i].marksCategory=="M"?'Marks':'Percentage'}
                        <input type="text" placeholder={"Enter "+`${education[i].marksCategory=='M'?'Marks':'Percentage'}`} name='marks'value={education[i].marks}  onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>

                                              
                        <div>
                       
                        {education.length!==1 &&
                            <Button onClick={()=>removeEduc(i)}>Remove</Button>
                        }
                        {
                            education.length-1===i &&
                            <Button onClick={()=>{handleAddEduc()}}>Add Education</Button>
                            
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

export default AddEducation
