module.exports={
    async up(db, client) {
      await db.collection('auth').updateMany({}, { $set: { userId: "",ref1:"",ref2:"",ref3:"",password:"" } });
      await db.collection('notification').updateMany({}, { $set: { userId: "",ref1:"",ref2:"",ref3:"",name:"",description:"",dateTime:"" } });

    },
  
    async down(db, client) {
        await db.collection('auth').updateMany({}, { $set: { userId: "",ref1:"",ref2:"",ref3:"",password:"" } });
        await db.collection('notification').updateMany({}, { $set: { userId: "",ref1:"",ref2:"",ref3:"",name:"",description:"",dateTime:"" } });

    }
  }
  