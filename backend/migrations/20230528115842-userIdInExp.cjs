module.exports={
    async up(db, client) {
  
   
   await db.collection('experience').updateMany({},{$set:{userId:""}});
  

},

async down(db, client) {
   
   await db.collection('experience').updateMany({},{$set:{userId:""}});
  
}
}
