module.exports={
    async up(db, client) {
  
   await db.collection('authUser').updateMany({},{$set:{occupation:"",profilePic:"",isFresher:"",skills:""}});
   await db.collection('certifications').updateMany({},{$set:{userId:"",company:"",link:"",fileUploaded:"",skill:"",date:""}});
   await db.collection('chats').updateMany({},{$set:{receiver:"",sender:"",msg:"",date:""}});
   await db.collection('comments').updateMany({},{$set:{postId:"",ref1:"",userId:"",description:"",ref2:"",ref3:""}});
   await db.collection('company').updateMany({},{$set:{locationId:"",name:"",description:""}});
   await db.collection('connections').updateMany({},{$set:{receiver:"",sender:"",status:"",date:""}});
   await db.collection('country').updateMany({},{$set:{name:""}});
   await db.collection('education').updateMany({},{$set:{userId:"",location:"",name:"",startDate:"",endDate:"",courseName:"",marksCategory:"",instCategory:"",marks:""}});
   await db.collection('authUser').updateMany({},{$set:{occupation:"",profilePic:"",isFresher:"",skills:""}});
   await db.collection('experience').updateMany({},{$set:{Status:"",title:"",companyId:"",locationId:"",workDescription:"",startDate:"",enddate:""}});
   await db.collection('followers').updateMany({},{$set:{follower:"",followedBy:""}});
   await db.collection('location').updateMany({},{$set:{countryId:"",name:""}});
   await db.collection('posts').updateMany({},{$set:{userId:"",title:"",body:"",files:"",ref1:"",ref2:"",createdDate:"",modifiedDate:"",isActive:""}});
   await db.collection('skills').updateMany({},{$set:{name:""}});

},

async down(db, client) {
    await db.collection('authUser').updateMany({},{$set:{occupation:"",profilePic:"",isFresher:"",skills:""}});
   await db.collection('certifications').updateMany({},{$set:{userId:"",company:"",link:"",fileUploaded:"",skill:"",date:""}});
   await db.collection('chats').updateMany({},{$set:{receiver:"",sender:"",msg:"",date:""}});
   await db.collection('comments').updateMany({},{$set:{postId:"",ref1:"",userId:"",description:"",ref2:"",ref3:""}});
   await db.collection('company').updateMany({},{$set:{locationId:"",name:"",description:""}});
   await db.collection('connections').updateMany({},{$set:{receiver:"",sender:"",status:"",date:""}});
   await db.collection('country').updateMany({},{$set:{name:""}});
   await db.collection('education').updateMany({},{$set:{userId:"",location:"",name:"",startDate:"",endDate:"",courseName:"",marksCategory:"",instCategory:"",marks:""}});
   await db.collection('authUser').updateMany({},{$set:{occupation:"",profilePic:"",isFresher:"",skills:""}});
   await db.collection('experience').updateMany({},{$set:{Status:"",title:"",companyId:"",locationId:"",workDescription:"",startDate:"",enddate:""}});
   await db.collection('followers').updateMany({},{$set:{follower:"",followedBy:""}});
   await db.collection('location').updateMany({},{$set:{countryId:"",name:""}});
   await db.collection('posts').updateMany({},{$set:{userId:"",title:"",body:"",files:"",ref1:"",ref2:"",createdDate:"",modifiedDate:"",isActive:""}});
   await db.collection('skills').updateMany({},{$set:{name:""}});
}
}
