const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const path = require("path")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const userModel = require('./models/usermodel')
const postModel = require('./models/postmodel')
const crypto = require('crypto') // built in package in node js used to give unique name
const upload = require('./config/multerconfig')
const usermodel = require('./models/usermodel')

app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())

app.get("/",(req,res) => {
    res.render("index")
})

app.post("/register",async (req,res) => {
    let {password,email,age,name,username} = req.body;

    let user = await userModel.findOne({email})  // it is same as {email: email}
    if(user) return res.status(500).send("user already present")

    let saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt,async function(err, hash) {
            // Store hash in your password DB.
               let createdUser = await userModel.create({
                username,email,
                password:hash,
                age,name
            }
            
        )
            const token = jwt.sign({email:email, userid :createdUser._id}, "secretword")
            res.cookie("token",token)
            res.send(createdUser);
    }); 
    });
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.post("/login",async (req,res) => {
    let {password,email} = req.body;

    const user = await userModel.findOne({email:email})
    if(!user) return res.send("email not valid")

    bcrypt.compare(password,user.password , function(err, result) {
        if(!result) return res.send("password not valid")
        
        const token = jwt.sign({email:email,userid:user._id},"secretword")
        res.cookie("token",token)
        // res.send("You are logged In")
        res.redirect('/profile')
    });

})

app.get('/profile', isLoggedIn,async (req,res) => {    //protected route
    // console.log(req.user)
    // res.send("you can see your profile")
    let user = await userModel.findOne({email:req.user.email}).populate('posts')  //finding user on the basis of email 
    
    res.render('profile', {user:user}) 
})

app.get('/profile/upload', (req,res) => {
    res.render('profileUpload')
})

app.post('/profile/upload',isLoggedIn, upload.single('image'),async (req,res) => {
    // console.log(req.file)
   await usermodel.findOneAndUpdate({_id:req.user.userid} , {profilepic: req.file.filename} , {new: true})
    res.redirect('/profile')
})

function isLoggedIn(req,res,next){
    // console.log(req.cookies.token)
    // if(req.cookies.token ==='')  return res.send("you must login first")
      if (!token) {
    // no token -> redirect to login (web app flow)
    return res.redirect('/login');
  }

    let data = jwt.verify(req.cookies.token,"secretword") //verify karo token ko secretword ke basis par , aur agar sahi ho toh token me jo data banate time tha (email,userid) usko data variable me daal do
    req.user = data;  //req me ek user naam ka field bana ke usme data dal do
    next()
}


app.post('/post',isLoggedIn ,async (req,res) => {
    let user = await userModel.findOne({email:req.user.email})

    let {content} = req.body;

    let post =await postModel.create({
        user: user._id,
        content: content,
    })

    user.posts.push(post._id)
    await user.save()
    res.redirect('/profile');
})

app.get('/like/:_id', isLoggedIn ,async (req, res) => {
    let post = await postModel.findOne({_id:req.params._id}).populate('user') // populate kiya taki ObjectId  ke jagah par user ka actual id aa jaye -> ✔ populate() replaces ObjectId with actual document data
    // Populate = "Go to the user collection and fetch real docs for these IDs."
    // console.log(req.user)
    // console.log(req.user.userid)
    if(post.likes.indexOf(req.user.userid)  ===-1)  // indexOf returns -1 if no user present
        post.likes.push(req.user.userid) 
    else
        post.likes.splice(post.likes.indexOf(req.user.userid), 1); // splice matlab hatao -> post.likes array me se iss index ke bande ko hatao , 1 bande ko hatana hai

    await post.save()
    res.redirect('/profile')
})

app.get('/edit/:id' , isLoggedIn ,async (req,res) => {
    let post  = await postModel.findOne({_id:req.params.id})
    res.render('edit', {post:post})
})

app.post('/update/:_id', isLoggedIn ,async (req,res) => {
    await postModel.findOneAndUpdate({_id:req.params._id},{content:req.body.editedContent},{new:true})
    res.redirect('/profile')
})

app.get('/logout',(req,res) => {
    res.cookie('token','')
    res.redirect('/login')
})

app.listen(3000)
