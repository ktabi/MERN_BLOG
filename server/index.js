const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');


const User = require('./models/User');
const Post = require('./models/Post');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'})
//we use fs to help us rename the file being received in the backend
const fs = require('fs');
const { json } = require('body-parser');



// strict query warning keeping it at true
mongoose.set('strictQuery', true)

const secret = "asdfghjklqwertyuopzxcvbnm123456789";
// const secret = bcrypt.genSaltSync(10);

//Middleware
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
// app.use(cors());
app.use(express.json());

const salt = bcrypt.genSaltSync(10);
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));


//connecting to mongoose
 mongoose.connect('mongodb+srv://lilslam:"password"@cluster0.f5zjbaj.mongodb.net/?retryWrites=true&w=majority')

 //register
app.post('/register', async(req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password, salt)});
        res.cookie('token', token).json('ok');
    }catch(e){
        res.status(400).json('wrong credentials');
    }
});

//login
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    //finding if user exist in db
    const userDoc = await User.findOne({username:username})
    //comparing hashed passoword with provided password.
    const passOk = bcrypt.compareSync(password, userDoc.password)
     if (passOk){
        //logged in
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            // setting cookie to token
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        } );
     } else {
         res.status(400).json('wrong credentials!');
     }
})

//Endpoint to return profile info
app.get('/profile', (req, res) => {
    const {token} = req.cookies
    // const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    });

    res.json(req.cookies );

})

//Enpoint for Createing a Post 
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    // uploading file
    const {originalname, path} = req.file;
    const parts =  originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath = path+'.'+ext
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        //Saving it to database
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
    })
        res.json(postDoc);
    });


})

//Endpoint for getting a single post details by id
app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
                                            //Only want the author's username not the password.
    const postDoc = await (await Post.findById(id)).populate('author', ['username']);
    res.json(postDoc);
})


// Fetching all posts
app.get('/post', async (req, res) => {
    // since we used ref to reference ref User in Post, we can use Populate.
   res.json(await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(30));
   
});

//Enpoint for Updtaing Post
app.put('/post', uploadMiddleware.single('file'),async (req, res) => {
    let newPath = null;
    if (req.file) {
        const {originalname, path} = req.file;
        const parts =  originalname.split('.');
        const ext = parts[parts.length -1];
        newPath = path+'.'+ext
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id,title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor) {
           return res.status(400).json('you are not the author');
        }
        await postDoc.update({
            title, 
            summary, 
            content,
            cover: newPath ? newPath : postDoc.cover,
    });
        res.json(postDoc);
    });
})



// logout Endpoint
app.post('/logout', (req, res) => {
    // setting cookie to empty string/clearing
    res.cookie('token', "").json('ok');
})


app.listen(3001);
