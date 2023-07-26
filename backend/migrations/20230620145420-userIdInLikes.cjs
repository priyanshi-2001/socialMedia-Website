module.exports={
    async up(db, client) {
      await db.collection('likes').updateMany({}, { $set: { userId: "" }});

    },
  
    async down(db, client) {
        await db.collection('likes').updateMany({}, { $set: { userId: "" }});

    }
  }
  