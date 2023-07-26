module.exports={
     async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection('authUser').updateMany({},{$set:{Name:"",email:"",password:"",date:"",phNum:"",gender:"",country:"",organization:""}});
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
},

async down(db, client) {
    await db.collection('authUser').updateMany({},{$set:{Name:"",email:"",password:"",date:"",phNum:"",gender:"",country:"",organization:""}});

    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
}
}
