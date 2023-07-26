module.exports={
  async up(db, client) {
    await db.collection('authUser').updateMany({}, { $unset: { password: 1 } });
  },

  async down(db, client) {
    await db.collection('authUser').updateMany({}, { $set: { password: null } });
  }
}
