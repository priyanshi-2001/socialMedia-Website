module.exports={async up(db, client){
    await db.collection("email").updateMany({},{$set:{email:''}});

    },
    async down(db, client){
        await db.collection("email").updateMany({},{$set:{email:''}});

    }
    
    }
    