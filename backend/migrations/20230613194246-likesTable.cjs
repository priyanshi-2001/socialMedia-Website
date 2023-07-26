module.exports={async up(db, client){
    await db.collection("userActivity").updateMany({},{$set:{postId:'',user:'',likes:'',comments:'',dateTime:'',ref1:'',ref2:''}});
    await db.collection("likes").updateMany({},{$set:{postId:'',user:'',reactionType:'',time:''}});

    },
    async down(db, client){
        await db.collection("userActivity").updateMany({},{$set:{postId:'',user:'',likes:'',comments:'',dateTime:'',ref1:'',ref2:''}});
        await db.collection("likes").updateMany({},{$set:{postId:'',user:'',reactionType:'',time:''}});

    }
    
    }
    