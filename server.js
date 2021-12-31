const express = require('express')
const app = express()
const cors = require('cors')
const bodyparser = require('body-parser');
const { json } = require('express/lib/response')
require('dotenv').config()




app.use(bodyparser.urlencoded({extended:true}))

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


var users = []

function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+S4()+S4()+S4()+S4());
}





app.get('/api/users',(req,res)=>{
  res.send(users)
})

app.post('/api/users',(req,res)=>{
  var guui = guidGenerator()
  users.push({
    username:req.body.username,
    _id :guui
  })
    res.json(
      {
        username:req.body.username,
        _id :guui
      }
    )
})



var l = []

app.post('/api/users/:_id/exercises',(req,res)=>{
  var today = new Date()
    var d = req.body.date;
    if(d == ""){
      d = today.toDateString()
    }else{
      var d = new Date(req.body.date).toDateString();
    }

  const user = users.filter(user => user._id == req.body._id);
    l.push(
      {
        description:  req.body.description,
        duration: parseInt(req.body.duration),
        date: d,           
      }
    )
    user[0].logs = l


    res.json({
      username: user.username,
      description:  req.body.description,
      duration: parseInt(req.body.duration),
      date: d,
      _id: req.body._id ,          
    })

    // users.forEach(function(user){
    //   if (user._id == req.body._id ){
    //     l.push(
    //       {
    //         description:  req.body.description,
    //         duration: parseInt(req.body.duration),
    //         date: d,           
    //       }
    //     )
    //     user.logs = l
      
    
     
    //   }
    // })



})


app.get("/api/users/:_id/logs",(req,res)=>{
  const {from,to,limit} = req.query
  var  user_id = req.params._id
  const user = users.filter(user => user._id == user_id);
 
  if(from){
    fromdate = new Date(from)
    user[0].logs = user[0].logs.filter(exe => new Date(exe.date) > fromdate)
  }
  if(to){
    todate = new Date(to)
    user[0].logs = user[0].logs.filter(exe => new Date(exe.date) < todate)
  }
  if(limit){
    user[0].logs = user[0].logs.slice(0,+limit)
    
  }
 res.json(
  {
    username:user[0].username,
    count: user[0].logs.length,
    _id:user[0]._id,
    log:user[0].logs
  }
 )


  // users.forEach(function(user){
  //   if(user._id == user_id){
  //     if(from){
  //       fromdate = new Date(from)
  //       user.logs = user.logs.filter(exe => new Date(exe.date) > fromdate)
  //     }
  //     if(to){
  //       todate = new Date(to)
  //       user.logs = user.logs.filter(exe => new Date(exe.date) < todate)
  //     }
  //     if(limit){
  //       user.logs = user.logs.slice(0,+limit)
        
  //     }
  //    res.json(
  //     {
  //       username:user.username,
  //       count: user.logs.length,
  //       _id:user._id,
  //       log:user.logs
  //     }
  //    )
  //   }
  // })
})









const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
