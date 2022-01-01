const express = require('express')
const app = express()
const cors = require('cors')
const bodyparser = require('body-parser');
const { json } = require('express/lib/response')
const mongoose = require("mongoose");
const e = require('express');
mongoose.connect("mongodb://localhost:27017/exerciseDB",{useNewUrlParser: true,})
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
      res.json(   
          result
        
      )
    }
  })
})










app.post('/api/users/:_id/exercises',(req,res)=>{
  var today = new Date()
    var d = req.body.date;
    if(d == ""){
      d = today.toDateString()
    }else{
      var d = new Date(req.body.date).toDateString();
    }

  User.findById({_id:req.body._id},function (err,u) {
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
        User.updateOne({_id:req.body._id},{log:e},function (err) {
          if(err){
            console.log(err)
          }
          else{
            console.log("successfully added")
          }
        })

        res.json({
          username:u.username,
          description:  req.body.description,
          duration: parseInt(req.body.duration),
          date: d,
          _id: req.body._id ,          
        })

      }
  })
 
})


app.get("/api/users/:_id/logs",(req,res)=>{
  const {from,to,limit} = req.query
  var  user_id = req.params._id
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
       res.json(
        {
          username:user.name,
          count: user.log.length,
          _id:user._id,
          log:user.log
        }
       )
      
      }
  })

 


 
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
