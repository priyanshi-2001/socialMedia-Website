module.exports={
    async up(db, client) {
  
   
   await db.collection('comments').updateMany({},{$set:{ref1:""}});
  

},

async down(db, client) {
   
    await db.collection('comments').updateMany({},{$set:{ref1:""}});
  
}
}
