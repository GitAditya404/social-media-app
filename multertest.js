// const multer = require('multer') // we use multer when we need to upload file like whatsapp

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/imgaes/uploads')  //images iss folder me save hongi
//   },
//   filename: function (req, file, cb) {   //filename fn-> kis naam se file upload hogi
//                                         //destination -> kis folder me upload hongi
//     crypto.randomBytes(12, function(err, bytes ){
//         const fn = bytes.toString("hex")  + path.extname(file.originalname)
//         cb(null, fn )
//     })  // this line is used to make file name unique
//   }
// })

// app.get('/test', (req,res) => {
//     res.render('test')
// })

// const upload = multer({ storage:storage })

// app.post('/upload',upload.single('image'), (req,res) => {
//     // console.log(req.file)
// })