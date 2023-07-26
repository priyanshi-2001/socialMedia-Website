import React from 'react'
import { useEffect,useState } from 'react'
import {useParams} from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import {FormControl,FormData,Input,Select,MenuItem,Typography,Radio,CardHeader,Card,CardContent,FormLabel,RadioGroup,FormControlLabel} from '@mui/material';

const url="http://localhost:8000"
const MyProfile = () => {
  const [data,setData]=useState([]);
  const[skillsData,setSkillsData]=useState([]);
  const[educationData,setEducationData]=useState([]);
  const[experienceData,setExperienceData]=useState([]);
  const[certificationsData,setCertificationsData]=useState([]);
  const[showEducationData,setShowEducationData]=useState(false);
  const[showExperienceData,setShowExperienceData]=useState(false);
  const[showSkillsData,setShowSkillsData]=useState(false);
  const[showCertificationsData,setShowCertificationsData]=useState(false);
  // const[editedData,setEditedData]=useState();
  const[companyNames,setCompanyNames]=useState(new Map());
  const[options,setOptions]=useState([]);
  const[editedEdValue,setEditedEdValue]=useState([]);
  const[editedExpValue,setEditedExpValue]=useState([]);
  const[editedCertifValue,setEditedCertifValue]=useState([]);
  const[editedSkillsValue,setEditedSkillsValue]=useState([]);

  const[editEducation,setEditEducation]=useState(false);
  const[editExperience,setEditExperience]=useState(false);
  const[editCertif,setEditCertif]=useState(false);
  const[editSkills,setEditSkills]=useState(false);

  const[educationEditId,setEducationEditId]=useState('');
  const[certifEditId,setCertifEditId]=useState('');
  const[expEditId,setExpEditId]=useState('');
  const[skillsEditId,setSkillsEditId]=useState('');


  const [locationOptions,setLocationOptions]=useState();
  const[location,setLocation]=useState();
    useEffect(()=>{
      (async()=>{
        await fetchCompanies();

      })()
    },[])

    useEffect(()=>{
      (async()=>{
        await fetchLocation();

      })()
    },[])
    

    useEffect(()=>{
     (async()=>{
       await fetchUserDetails(localStorage.getItem("userId"))
     })()
    },[])

    const fetchCompanies=async()=>{
      try{
        const res=await fetch(url+"/getCompanies",{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          }
        })
        const resp=await res.json();
        if(resp.Error=='NA'){
          const temp = new Map();

          resp.results.forEach(obj => {
            temp.set(obj._id, obj.name);
          });
        
          
          setCompanyNames(temp);
          const tempOptions = resp.results.map(item => ({
            label: item.name,
            value: item._id
          }));
          setOptions(tempOptions);
        }
        if(resp.error=='Invalid token' || resp.error=='Authentication required'){
          window.location='/login';
         }


      }
      catch(err){
        console.log("err",err);
      }
    }

    const fetchLocation=async()=>{
      try{
        const res=await fetch(url+"/getLocation",{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`

          }
        })
        const resp=await res.json();
        if(resp.Error=='NA'){
          const temp = new Map();

          resp.results.forEach(obj => {
            temp.set(obj._id, obj.name);
          });
        
          
          setLocation(temp);
          const tempOptions = resp.results.map(item => ({
            label: item.name,
            value: item._id
          }));
          setLocationOptions(tempOptions);
        }
        if(resp.error=='Invalid token' || resp.error=='Authentication required'){
          window.location='/login';
         }


      }
      catch(err){
        console.log("err",err);
      }
    }

    const fetchUserDetails=async(id)=>{
        try{
          const resp=await fetch(url+`/getProfileDetails/${id}/${id}`,{
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            method:'GET'
            
          })
          const res=await resp.json();
          if(res.Error=='NA'){
            localStorage.setItem("Name",res.userData.Name);
            setData(res.userData);
            setSkillsData(res.skillsData);
            setEducationData(res.educationDetails);
            setExperienceData(res.experienceDetails);
            setCertificationsData(res.certificationsData);
          }
          if(res.error=='Invalid token' || res.error=='Authentication required'){
            window.location='/login';
           }
  
        }
        catch(err){
          console.log("err",err);
        }
      }

      const handleChangeEducation=(e)=>{
        const{name,value}=e.target;
        const tempObj={...editedEdValue};
        tempObj[name]=value;
        setEditedEdValue(tempObj);
       
    }
    const handleChangeExperience=(e)=>{
      const{name,value}=e.target;
      const tempObj={...editedExpValue};
      tempObj[name]=value;
      setEditedExpValue(tempObj);
     
  }
  const handleChangeCertifications=(e)=>{
    const{name,value}=e.target;
    const tempObj={...editedCertifValue};
    tempObj[name]=value;
    setEditedCertifValue(tempObj);
   
  }

    const removeEduc=()=>{
      setEditedEdValue([]);
      setEditEducation(false);
      setShowEducationData(false);
    }

    const removeExp=()=>{
      setEditedExpValue([]);
      setEditExperience(false);
      setShowExperienceData(false);
    }
    const removeCertif=()=>{
      setEditedCertifValue([]);
      setEditCertif(false);
      setShowCertificationsData(false);
    }

    const editEducationData=async(id,details,flag)=>{
      try{
        const resp=await fetch(url+"/editEducationData",{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          },
          body:JSON.stringify({
            id,details,flag,
            userId:localStorage.getItem("userId")

          })
        })

        const res=await resp.json();
        return res;

      }
      catch(err){
        console.log("err",err);
      }
    }

    const editExperienceData=async(id,details,flag)=>{
      try{
        const resp=await fetch(url+"/editExperienceData",{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          },
          body:JSON.stringify({
            id,details,flag,
            userId:localStorage.getItem("userId")

          })
        })

        const res=await resp.json();
        return res;

      }
      catch(err){
        console.log("err",err);
      }
    }

    const editCertificationData=async(id,details,flag)=>{
      try{
        const resp=await fetch(url+"/editCertificationsData",{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          },
          body:JSON.stringify({
            id,details,flag,
            userId:localStorage.getItem("userId")

          })
        })

        const res=await resp.json();
        return res;

      }
      catch(err){
        console.log("err",err);
      }
    }

    const handleAddEduc=async()=>{
      const res=await editEducationData('',editedEdValue,"add");
        const tempObj=[...educationData];
        if(res !=undefined && res.Error=='NA'){
        tempObj.push(res.data);
       setEducationData(tempObj);
        }
       setEditedEdValue([]);
       setEditEducation(false);
       setShowEducationData(false);
    }

    const handleAddExp=async()=>{
      const tempObj=[...experienceData];
      const res=await editExperienceData('',editedExpValue,"add")
      if(res !=undefined && res.Error=='NA'){
      tempObj.push(res.data);
     setExperienceData(tempObj);
      }
     setEditedExpValue([]);
     setEditExperience(false);
     setShowExperienceData(false);
  }

  const handleAddCertifications=async()=>{
    const tempObj=[...certificationsData];
    const res=await editCertificationData('',editedCertifValue,"add")
    if(res !=undefined &&  res.Error=='NA'){
    tempObj.push(res.data);
   setCertificationsData(tempObj);
    }
   setEditedCertifValue([]);
   setEditCertif(false);
   setShowCertificationsData(false);
  }



    const handleChange=(name,id,property,newValue)=>{
      if(name=='education'){
        const tempObj = { ...editedEdValue, [property]: newValue };
        setEditedEdValue(tempObj);
        


      }
      if(name=='experience'){
        
        const tempObj = { ...editedExpValue, [property]: newValue };
        setEditedExpValue(tempObj);
      
      }
      if(name=='certification'){
        const tempObj = { ...editedCertifValue, [property]: newValue };
        setEditedCertifValue(tempObj);
       
      }
      if(name=='skills'){
        const tempObj = { ...editedSkillsValue, [property]: newValue };
        setEditedSkillsValue(tempObj);
      
      }
    }

    const handleSaveChanges=async(name)=>{
      if(name=='education'){
        const res=await editEducationData(educationEditId,editedEdValue,"edit")
        if(res.Error=='NA'){
        var tempObj=[...educationData];
        var updatedArray = tempObj.map((obj) => (obj._id === educationEditId ? res.data : obj));
        setEducationData(updatedArray);
        }
        setEducationEditId('');setEditEducation(false);setEditedEdValue([])
      }
      if(name=='skills'){
        // const res=await editCertificationData(skillsEditId,editedSkillsValue,"edit")
        // if(res.Error=='NA'){
        // var tempObj=[...skillsData];
        // var updatedArray = tempObj.map((obj) => (obj._id === skillsEditId ? editedSkillsValue : obj));
        // setSkillsData(updatedArray);
        // }
        setSkillsEditId('');setEditSkills(false);setEditedSkillsValue([])
      }
      if(name=='experience'){
        const res=await editExperienceData(expEditId,editedExpValue,"edit")
        if(res.Error=='NA'){
        var tempObj=[...experienceData];
        var updatedArray = tempObj.map((obj) => (obj._id === expEditId ? res.data : obj));
        setExperienceData(updatedArray);
        }
        setExpEditId('');setEditExperience(false);setEditedExpValue([])
      }
      if(name=='certification'){
        const res=await editCertificationData(certifEditId,editedCertifValue,"edit")
        if(res.Error=='NA'){
        var tempObj=[...certificationsData];
        var updatedArray = tempObj.map((obj) => (obj._id === certifEditId ? res.data : obj));
        setCertificationsData(updatedArray);
        }
        setCertifEditId('');setEditCertif(false);setEditedCertifValue([])
      }

    }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#D8EDF1'
    }}>
      <div style={{
        padding: '20px',
        backgroundColor: '#15B1D8',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <div style={{ textTransform: 'capitalize', fontSize: '24px', fontWeight: 'bold' }}>{data.Name}</div>
        <div style={{ marginTop: '15px' }}>
          <img src={data.profilePic} width={75} height={75} style={{ borderRadius: '50%' }} alt="Profile" />
        </div>
        <div style={{ marginTop: '10px', fontSize: '18px' }}>{data.headline}</div>
        <div style={{ marginTop: '10px', fontSize: '16px' }}>{data.organization}</div>
        <div style={{ marginTop: '20px' }}>
          <button style={{ backgroundColor: '#D8EDF1', color: '#000', fontWeight: 'bold', borderRadius: '4px', padding: '10px 20px', fontSize: '16px' }} onClick={() => { window.location = '/MyNetwork' }}>
            My Network
          </button>
        </div>
  
        <div style={{ marginTop: '30px' }}>
          <div style={{ backgroundColor: '#D8EDF1',display:'flex',padding: '10px', fontWeight: 'bold', borderRadius: '4px' }}>
            <div>Experience</div>
            <div style={{marginLeft:'50%'}}><Button onClick={()=>{setShowExperienceData(!showExperienceData)}}>&#x2295;</Button></div>
            
          </div>
            {
              showExperienceData?(
                <div>
                      <div>
                          <label>Id:
                          
                          <input type="number" name='_id'  onChange={(e)=>handleChangeExperience(e)}/>

                        </label>
                          </div>
                        <div>
                        <label>Job Title
                       
                          <input type="text"  placeholder='Job Title' name='title'  onChange={(e)=>handleChangeExperience(e)}/>
  
                        </label>
                        </div>
                        <div>
                        <Select
                        variant="outlined"
                        options={options}
                        name="companyName"
                        onChange={(e)=>handleChangeExperience(e)}
                      >
                        {options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                        </div>
                       
                        <div>
                        <label> Work Description:
                        <input type="text"  placeholder='Work Description' name='workDescription' onChange={(e)=>handleChangeExperience(e)} />
                        </label>
                        </div>
                        <div>
                        <label> Joining Date:
                        <input type="date"  placeholder='Joining Date'  name='startDate'  onChange={(e)=>handleChangeExperience(e)}/>
                        </label>
                        </div>
                        <div>
                        <label> Ending Date:
                        <input type="date"  placeholder='Ending Date'  name='endDate' onChange={(e)=>handleChangeExperience(e)}/>
                        </label>
                        </div>
                        
                        <div>
               
             
                        <Button onClick={()=>removeExp()}>Cancel</Button>
                  
                        <Button onClick={()=>{handleAddExp()}}>Add Experience</Button>
                        
                    
                    </div>

                </div>
              ):(null)

            }
          {experienceData.length > 0 ? (
            experienceData.map((o) => (
              <div key={o.id} style={{ marginTop: '20px', backgroundColor: '#D8EDF1', borderRadius: '4px', padding: '10px' }}>
                {o.startDate && <div>{o.startDate.toLocaleString()}-{o.Status === 'P' ? o.endDate.toLocaleString() : 'Present'}</div>}
                <div style={{ marginTop: '10px', fontSize: '18px', fontWeight: 'bold' }}>
                title &nbsp;{o.title}
                <TextField name='title' onChange={(e)=>{handleChange('experience',o._id,e.target.name,e.target.value)}} 
                  value={expEditId==o._id?editedExpValue.title:o.title} 
                  disabled={expEditId!==o._id} 
                  />
                  
                  </div>

                  <div>
                  <TextField type='date' name="startDate" onChange={(e)=>{handleChange('experience',o._id,e.target.name,e.target.value)}} 
                  value={
                    expEditId === o._id && editedExpValue.startDate
                      ? editedExpValue.startDate.substring(0, 10)
                      : o.startDate
                        ? o.startDate.substring(0, 10)
                        : ''
                  }
                  disabled={expEditId!==o._id} 
                  />
                  </div>

                  <div>
                  <TextField type='date' name="endDate" onChange={(e)=>{handleChange('experience',o._id,e.target.name,e.target.value)}} 
                  value={
                    expEditId === o._id && editedExpValue.endDate
                      ? editedExpValue.endDate.substring(0, 10)
                      : o.endDate
                        ? o.endDate.substring(0, 10)
                        : ''
                  }
                  disabled={expEditId!==o._id} 
                  />
                  </div>

                <div style={{ marginTop: '10px', fontSize: '16px' }}>
                  workDescription&nbsp;{o.workDescription}
                  <TextField name='workDescription' onChange={(e)=>{handleChange('experience',o._id,e.target.name,e.target.value)}} 
                  value={expEditId==o._id?editedExpValue.workDescription:o.workDescription} 
                  disabled={expEditId!==o._id} 
                  />
                  </div>
                  <div>
                <Select
                variant="outlined"
                options={options}
                name="companyName"
                defaultValue={companyNames.get(o.companyName)}
                value={expEditId==o._id?companyNames.get(editedExpValue.companyName):companyNames.get(o.companyName)} 
                disabled={educationEditId!==o._id} 
                onChange={(e)=>handleChange('experience',o._id,e.target.name,e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
                </div>
                
                <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
                companyName&nbsp;{o.companyName}
                  <TextField name='companyName' onChange={(e)=>{handleChange('experience',o._id,e.target.name,e.target.value)}} 
                  value={expEditId==o._id?companyNames.get(editedExpValue.companyName):companyNames.get(o.companyName)} 
                  disabled={expEditId!==o._id} 
                  />
                  </div>
                <div style={{ marginTop: '5px', fontSize: '14px', color: '#888' }}>
                  companyId&nbsp;{o.companyId}
                  <TextField name='companyId' onChange={(e)=>{handleChange('experience',o._id,e.target.name,e.target.value)}} 
                  value={expEditId==o._id?editedExpValue.companyId:o.companyId} 
                  disabled={expEditId!==o._id} 
                  />
                  </div>
                <div style={{ marginTop: '10px', fontSize: '16px' }}><Button onClick={()=>{setExpEditId(o._id);setEditExperience(true)}}> Edit</Button></div>
                
                {editExperience && expEditId===o._id?(
                  <div>
                  <Button onClick={()=>{handleSaveChanges('experience')}}>Save Changes</Button>
                  
                  <Button onClick={()=>{setEditExperience(false);setExpEditId('');                  
                  setEditedExpValue([])
                } }>Cancel</Button>
                 
                  </div>
                ):(null)}

              </div>
            ))
          ) : (
            <div>No Experience Added</div>
          )}
        </div>
        <div style={{ marginTop: '30px' }}>
          <div style={{ backgroundColor: '#D8EDF1', padding: '10px', fontWeight: 'bold', borderRadius: '4px',display:'flex' }}>
            <div>Education</div>
            <div style={{marginLeft:'50%'}}><Button onClick={()=>{setShowEducationData(!showEducationData)}}>&#x2295;</Button></div>
            </div>
            {
              showEducationData?(
                <Typography>
                <div>
                <FormControl>
  
                <FormLabel id="demo-controlled-radio-buttons-group"> Select Category</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="categoryOptions"
                  row
                  onChange={(e)=>{handleChangeEducation(e)}}
                >
                  <FormControlLabel value="S"  control={<Radio />} label="School" />
                  <FormControlLabel value="C"  control={<Radio />} label="College" />
  
                </RadioGroup>
                </FormControl> 
                </div>
               <div>
               <label>Id:
               
               <input type="number" name='_id'  onChange={(e)=>handleChangeEducation(e)}/>

             </label>
               </div>
               <div>
                <Select
                variant="outlined"
                options={options}
                name="name"
                onChange={(e)=>handleChangeEducation(e)}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
                </div>
              
                <div>
                <label> Location:
                <Select
                variant="outlined"
                options={options}
                name="locationCity"
                onChange={(e)=>handleChangeEducation(e)}
              >
                {locationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
                {/* <input type="text" placeholder='Enter Location City' name='locationCity'  onChange={(e)=>handleChangeEducation(e)} /> */}
                </label>
                </div>
                <div>
                <label> Joining Date:
                <input type="date" placeholder='Start Date'  name='startDate'  onChange={(e)=>handleChangeEducation(e)}/>
                </label>
                </div>
                <div>
                <label> Ending Date:
                <input type="date" placeholder='End Date'  name='endDate'  onChange={(e)=>handleChangeEducation(e)}/>
                </label>
                </div>
                <div>
                <label> CourseName:
                <input type="text" placeholder='Enter Course Name' name='courseName'   onChange={(e)=>handleChangeEducation(e)} />
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
                  onChange={(e)=>{handleChangeEducation(e)}}
                >
                  <FormControlLabel value="M"  control={<Radio />} label="Marks" />
                  <FormControlLabel value="P"  control={<Radio />} label="Percentage" />
  
                </RadioGroup>
                </FormControl> 
                </div>
                <div>
                <label> Enter Marks/Percentage
                <input type="text"  name='marks' onChange={(e)=>handleChangeEducation(e)} />
                </label>
                </div>
  
                                      
                <div>
               
             
                    <Button onClick={()=>removeEduc()}>Cancel</Button>
              
                    <Button onClick={()=>{handleAddEduc()}}>Add Education</Button>
                    
                
                </div>
  
              </Typography>
  
              ):(null)
            }
          
          {educationData.length > 0 ? (
            educationData.map((o) => (
              <div 
              key={o._id} 
              style={{ marginTop: '20px', backgroundColor: '#D8EDF1', borderRadius: '4px', padding: '10px' }}>
                <div>
                  Name
                <Select
                variant="outlined"
                options={options}
                name="name"
                value={companyNames.get(o.name)} 
                disabled={educationEditId!==o._id} 
                onChange={(e)=>handleChange('education',o._id,e.target.name,e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
                </div>

              
                 <div>
                  Location
                <Select
                variant="outlined"
                options={options}
                name="locationId"
                value={location.get(o.locationId)}
                disabled={educationEditId!==o._id} 
                onChange={(e)=>handleChange('education',o._id,e.target.name,e.target.value)}
              >
                {locationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
                </div>
               
                <div style={{ marginTop: '10px', fontSize: '16px' }}>startDate

                <TextField type='date' name="startDate" onChange={(e)=>{handleChange('education',o._id,e.target.name,e.target.value)}} 
                  value={
                    educationEditId === o._id && editedEdValue.startDate
                      ? editedEdValue.startDate.substring(0, 10)
                      : o.startDate
                        ? o.startDate.substring(0, 10)
                        : ''
                  }
                  disabled={educationEditId!==o._id} 
                  /> &nbsp;-&nbsp;
                 
                  </div>
                  <div>endDate
                     <TextField type='date' name="endDate" onChange={(e)=>{handleChange('education',o._id,e.target.name,e.target.value)}} 
                     value={
                      educationEditId === o._id && editedEdValue.startDate
                      ? editedEdValue.endDate.substring(0, 10)
                      : o.endDate
                        ? o.endDate.substring(0, 10)
                        : ''
                     }
                     disabled={educationEditId!==o._id} 
                     />
                    
                  </div>
                <div style={{ marginTop: '10px', fontSize: '16px' }}>courseName
                <TextField name='courseName' onChange={(e)=>{handleChange('education',o._id,e.target.name,e.target.value)}} 
                  value={educationEditId==o._id?editedEdValue.courseName:o.courseName} 
                  disabled={educationEditId!==o._id} 
                  />
                  {/* {o.courseName} */}
                  </div>
                <div style={{ marginTop: '10px', fontSize: '16px' }}>Marks
                  {o.marksCategory === 'P' ? 'Percentage' : 'Marks'} - 
                  <TextField name='marks' onChange={(e)=>{handleChange('education',o._id,e.target.name,e.target.value)}} 
                  value={educationEditId==o._id?editedEdValue.marks:o.marks} 
                  disabled={educationEditId!==o._id} 
                  />
                  </div>
                <div style={{ marginTop: '10px', fontSize: '16px' }}><Button onClick={()=>{setEducationEditId(o._id);setEditEducation(true)}}> Edit</Button></div>
               {editEducation && educationEditId===o._id?(
                <div>
                <Button onClick={()=>
                {handleSaveChanges('education')}}>Save Changes</Button>
                <Button onClick={()=>{setEditEducation(false);setEducationEditId('');setEditedEdValue([])}}>Cancel</Button>
                </div>
               ):(null)}
              </div>
            ))
          ) : (
            <div>No Education Data Found</div>
          )}
        </div>
  
        <div style={{ marginTop: '30px' }}>
          <div style={{ backgroundColor: '#D8EDF1',display:'flex', padding: '10px', fontWeight: 'bold', borderRadius: '4px' }}>Certifications
          <div style={{marginLeft:'50%'}}><Button onClick={()=>{setShowCertificationsData(!showCertificationsData)}}>&#x2295;</Button></div>
        
          </div>

          {
            showCertificationsData?(
              <div>
                <div>
                  <label>Enter id<input type="number" name="_id" onChange={(e)=>handleChangeCertifications(e)}/></label>
                </div>

              
                        <div>
                        <label> Certification Link:
                        <input type="text" placeholder='Enter certification Link'  name='link' onChange={(e)=>handleChangeCertifications(e)}/>
                        </label>
                        </div>
                        <div>
                        <label> Skill
                        <input type="text" placeholder='Enter Skill'  name='skill'  onChange={(e)=>handleChangeCertifications(e)}/>
                        </label>
                        </div>
                        <div>
                        <label> Date:
                        <input type="date" placeholder='Enter Certification Date' name='date' onChange={(e)=>handleChangeCertifications(e)} />
                        </label>
                        </div>
                        <div>Certification Organization/Company:
                        <Select
                        variant="outlined"
                        options={options}
                        name="company"
                        onChange={(e)=>handleChangeCertifications(e)}
                      >
                        {options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      
             
                    <Button onClick={()=>removeCertif()}>Cancel</Button>
              
                    <Button onClick={()=>{handleAddCertifications()}}>Add certification</Button>
                    
                
                </div>
                           </div>

            ):(null)
          }

          {certificationsData.length > 0 ? (
            certificationsData.map((o) => (
              <div key={o._id} style={{ marginTop: '20px', backgroundColor: '#D8EDF1', borderRadius: '4px', padding: '10px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Skill
                  <input type="text" 
                  name="skill"
                  onChange={(e)=>{handleChange('certification',o._id,e.target.name,e.target.value)}} 
                  value={certifEditId==o._id?editedCertifValue.skill:o.skill} 
                  disabled={certifEditId!==o._id} /> </div>
               
                <div>Link
                <TextField name='link' onChange={(e)=>{handleChange('certification',o._id,e.target.name,e.target.value)}} 
                  value={certifEditId==o._id?editedCertifValue.link:o.link} 
                  disabled={certifEditId!==o._id} 
                  />
                </div>
                <div>Company
                <Select
                variant="outlined"
                options={options}
                name="company"
                disabled={certifEditId!==o._id} 
                onChange={(e)=>handleChange('certification',o._id,e.target.name,e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
                </div>
               
                <div style={{ marginTop: '10px', fontSize: '16px' }}>Date
                <TextField type='date' name="date" onChange={(e)=>{handleChange('certification',o._id,e.target.name,e.target.value)}} 
                   value={
                    certifEditId === o._id && editedCertifValue.date
                      ? editedCertifValue.date.substring(0, 10)
                      : o.date
                        ? o.date.substring(0, 10)
                        : ''
                  }
                  disabled={certifEditId!==o._id} 
                  /> 
                  
                  
                  </div>

                
                

                <div style={{ marginTop: '10px', fontSize: '16px' }}><Button onClick={()=>{setCertifEditId(o._id);setEditCertif(true)}}> Edit</Button></div>
                
                {editCertif && certifEditId===o._id?(
                  <div>
                  <Button onClick={()=>
                  {handleSaveChanges('certification')}}>Save Changes</Button>
                  <Button onClick={()=>{setEditCertif(false);setCertifEditId('');setEditedCertifValue([])}}>Cancel</Button>
                  </div>
                ):(null)}
              </div>
            ))
          ) : (
            <div>No Certifications Data Found</div>
          )}
        </div>
      </div>
    </div>

    
  )
}

export default MyProfile