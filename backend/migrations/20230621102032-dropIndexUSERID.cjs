module.exports={
    async up(db, client){
    await db.collection('likes').dropIndex({ userId: 1 });
},

async down(db, client){
   
}
}
