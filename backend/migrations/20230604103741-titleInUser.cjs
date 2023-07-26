module.exports={
    async up(db, client) {
  
   
   await db.collection('authUser').updateMany({},{$set:{headline:"",bannerImage:"",openToWork:"",currentLoc:"",numOfConnections:"",numOfFollowers:"",ref1:"",ref2:"",ref3:"",ref4:""}});
  

},

async down(db, client) {
   
    await db.collection('authUser').updateMany({},{$set:{headline:"",bannerImage:"",openToWork:"",currentLoc:"",numOfConnections:"",numOfFollowers:"",ref1:"",ref2:"",ref3:"",ref4:""}});
  
}
}
