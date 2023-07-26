module.exports={async up(db, client){
    await db.collection("comments").updateMany({},{$set:{immediateChilds:[]}});
        
    },
    async down(db, client){
        await db.collection("comments").updateMany({},{$set:{immediateChilds:[]}});
    
    }
    
    }
    