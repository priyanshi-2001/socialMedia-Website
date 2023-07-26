module.exports={
    async up(db, client) {
  
   
   await db.collection('comments').updateMany({},{$set:{path:""}});
  

},

async down(db, client) {
   
    await db.collection('comments').updateMany({},{$set:{path:""}});
  
}
}
