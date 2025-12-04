const multer = require ('multer')
const crypto = require('crypto')
const path = require('path')

// diskstorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgaes/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(13, function(err, name){ // hame har file ka naam badlna hai taki koi file overwrite na ho 
        const fn = name.toString("hex") + path.extname(file.originalname)
//ye jo name(filename) hai ek buffer hai isliye ise hex me chnage ; extname -: orignial file ke naam me se naam hata ke sirf extension rakhta hai like .jpeg, .jpg
        cb(null, fn)
    })
  }
})

const upload = multer({ storage: storage }) 
module.exports = upload;
//export  upload variable