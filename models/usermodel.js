const mongoose  = require('mongoose')

mongoose.connect("mongodb+srv://adityawork404_db_user:QFiBsm72ltei3UAa@chatterboxcluster.i7s0idb.mongodb.net/?appName=ChatterboxCluster")

const userSchema = mongoose.Schema({
    username : String,
    name : String,
    age: Number,
    email: String,
    password : String,
    posts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    profilepic : {
        type: String,
        default:'defaultimg'
    }
})

module.exports = mongoose.model('user',userSchema);
