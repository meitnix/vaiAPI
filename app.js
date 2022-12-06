require("./database/db");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model('user');
mongoose.set('strictQuery', true);
const auth = require("./authentication/auth");

const app = express();

app.use(express.json({ limit: "50mb" }));

//signup
app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    console.log(encryptedPassword);
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    const token = jwt.sign(
      { user_id: user._id, email },
      "task1 vai",
      {
        expiresIn: "2m",
      }
    );
    user.token = token;
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});
//login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        "task1 vai",
        {
          expiresIn: "2m",
        }
      );
      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});
//view data
app.get('/userdata',auth,(req,res) =>{
  User.findById(req.body._id, (err, docs)=>{
      if(!err){
          res.send(docs);
      } else {
          console.log('Error in retrieval :'+err)
      }
  })
})
//update everything except email
app.post('/update',auth,(req,res) =>{
  User.findOneAndUpdate({email: req.body.email}, { $set: {password: bcrypt.hashSync(req.body.password, 10),first_name:req.body.first_name,last_name:req.body.last_name} }, {new: true}, (err, doc) =>{
    if(!err){
        res.status(201).json({msg:"Updated"});
    } else{
        console.log("Error during update:" +err);
    }
})
})
//for wrong methods
app.use("*", (req, res) => {
  res.status(404).json({
      message: "Using wrong method",
  });
});

module.exports = app;
