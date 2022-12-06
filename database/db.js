const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/task1',{
    useNewUrlParser: true,useUnifiedTopology: true,
},
err => {
    if(!err){
        console.log('Connection succeeded')
    } else {
        console.log('Error in connection' +err)
    }
})
require('../model/user')