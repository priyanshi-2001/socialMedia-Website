module.exports={
    async up(db, client) {
      await db.collection('likes').updateMany({}, { $set: { userId: "" }});
      await db.collection('likes').updateMany({}, { $unset: { "userId.$unique": true } });
    },
  
    async down(db, client) {
        await db.collection('likes').updateMany({}, { $set: { userId: "" }});

    }
  }
  