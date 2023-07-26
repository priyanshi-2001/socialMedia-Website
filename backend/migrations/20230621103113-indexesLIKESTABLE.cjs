module.exports={
    async up(db, client){
        await db.collection('likes').dropIndex('user_1');
    },

    async down(db, client){
    
    }
}

