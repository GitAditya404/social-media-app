const mongoose = require('mongoose')
 //no need to connect b/c already connected in usermodel
 
const postSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date : {
        type: Date,
        default :Date.now
    },
    content :String,
    likes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ]
})

module.exports = mongoose.model('post',postSchema)