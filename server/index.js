const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');

const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// strict query warning keeping it at true
mongoose.set('strictQuery', true)

//Middleware
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
// app.use(cors());
app.use(express.json());

const salt = bcrypt.genSaltSync(10);
app.use(cookieParser());
// const secret = "asdfghjklqwertyuopzxcvbnm123456789";
const secret = bcrypt.genSaltSync(10);

 mongoose.connect('mongodb+srv://lilslam:Application1@cluster0.f5zjbaj.mongodb.net/?retryWrites=true&w=majority')

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
            res.cookie('token', token).json('ok');
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

app.listen(3001);
