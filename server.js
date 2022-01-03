const express = require('express')
const app = express()
const cors = require('cors')
const bodyparser = require('body-parser');
const { json } = require('express/lib/response')
const mongoose = require("mongoose");
const e = require('express');
let url = "mongodb+srv://htet:"+"30221018"+"@freecodecamp.kq9tf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(url, {useNewUrlParser : true});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB database!");
});
require('dotenv').config()


exerciseschema = {
  description:{
    type:String,
    require:true
  },
  duration:{
    type:Number,
    require:true
  },
  date:String
}

const Exercise = mongoose.model("Exercise",exerciseschema)

const userschema = {
  name:{
    type:String,
    require:true,
  },
  log:[exerciseschema]
}
 

const User = mongoose.model("User",userschema)





app.use(bodyparser.urlencoded({extended:true}))

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});









app.post('/api/users',(req,res)=>{
  var user = new User({
    name:req.body.username
  })
  user.save()
 
  res.json(
    {
      username:user.name,
      _id :user._id
    }
  )

 

})

app.get('/api/users',(req,res)=>{
  User.find({},function (err,result) {
    if(err){
      console.log(err)
    }
    else{
        let users = []
        result.forEach(function (user) {
          n =  {
            username:user.name,
            _id:user._id
          }
          users.push(n)
           
          
          })  
          res.json(users)
        
  
   
    }
  })
})










app.post('/api/users/:_id/exercises',(req,res)=>{

  let post_id = mongoose.Types.ObjectId(req.params._id);
 
  if(req.body.duration == "" || req.body.description == ""){
    res.send("not found")
  }
  else{
    var today = new Date()
    
    var d = req.body.date;
    if(d == ""){
      d = today.toString().substring(0,15)
    }else{  
       d = new Date(req.body.date).toString().substring(0,15);
    }

  User.findById({_id:post_id},function (err,u) {
      if(err){
        console.log(err)
      }
      else{
          let e = new Exercise({
            description:req.body.description,
            duration:req.body.duration,
            date: d,    
          })
          e.save()
      
          User.findOne({_id:post_id},function (err,result) {
            if(!err){
              result.log.push(e);
              result.save()
              console.log(typeof(d))
              res.json({
                username:result.name,
                description:  req.body.description,
                duration: parseInt(req.body.duration),
                date: d,
                _id: post_id,          
              })
            }
          })
  
      
        
 

      }
  })
  }



 
})


app.get("/api/users/:_id/logs",(req,res)=>{
  const {from,to,limit} = req.query
  var  user_id = mongoose.Types.ObjectId(req.params._id);
  User.findById({_id:user_id},function (err,user) {
      if(err){
        console.log(err)
      }
      else{
        if(from){
          fromdate = new Date(from)
          user.log = user.log.filter(exe => new Date(exe.date) > fromdate)
        }
        if(to){
          todate = new Date(to)
          user.log = user.log.filter(exe => new Date(exe.date) < todate)
        }
        if(limit){
          user.log = user.log.slice(0,+limit)
          
        }
        let m = []
        user.log.forEach(function (w) {
           let a = {
              description:w.description,
              duration:w.duration,
              date:w.date,
            }
     
            m.push(a)
        })
     
       res.json(
         
        {
          _id:user._id,
          username:user.name,
          count: user.log.length,
          log:m
        }
       )
      
      }
  })

 


 
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
