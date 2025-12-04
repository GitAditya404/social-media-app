const mongoose  = require('mongoose')

mongoose.connect("mongodb://localhost/miniProj1")

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