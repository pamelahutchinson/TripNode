
const express = require ('express')
const mustacheExpress = require('mustache-express')
let bodyParser = require ('body-parser')
let session = require('express-session')
const app = express()

let users = [];
var trips = [];
var userTrips = []


// get the guid
function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

//setting up middleware to use the session
app.use(session({
    secret: 'santaisawesome123',
    resave:false,
    saveUninitialized:false
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// setting the templating engine to use mustache
app.engine('mustache',mustacheExpress())
// setting the mustache pages directory
app.set('views','./views')
// set the view engine to mustache
app.set('view engine','mustache')

app.listen(3000, ()=>{
    console.log('I SERVER WORKING')
})

// app.get('/login', (req,res)=>{
//     res.render("login")
// })

// app.get('/home', (req,res)=>{
//     console.log(req.session.username)
//     console.log(guid())
//     res.render('home', {username: req.session.username})
// })

 function validateLogin(req,res,next){
    if(req.session.username){
        next()
    }else{
        res.redirect('/')
    }
}




app.all('/admin/*',validateLogin,(req,res,next)=>{
    next()
})

// app.get('/admin/reports',(req,res)=>{
//     res.render ('admin/reports')
// })
// app.get('/admin/dashboard',(req,res)=>{
//     res.render('admin/dashboard')
// })

app.post('/login',(req,res)=>{
    let username = req.body.username
    let password = req.body.password

    if(req.session){
        req.session.username = username
    }
    userTrips = []
    res.redirect('/admin/index')
})
app.get('/admin/index',(req,res)=>{
    res.render('index')
})

app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/admin/trips',(req,res)=>{
    //render the mustache page called trips
    userTrips = []
    console.log(req.session.username)
    userTrips = trips.filter(function(trip){
        if(req.session.username){

            var username = req.session.username 
            if(trip.createdBy === username){
                console.log(trip)
                return trip 
            }
            
        }
        
    })
    res.render('trips',{tripListing : userTrips})
})

app.post('/deleteTrip',(req,res)=>{
    let tripId = req.body.tripId

    trips = trips.filter,(trip)=>{
        return trip.tripId != tripId
    }
    userTrips = userTrips.filter,(trip)=>{
        return trip.tripId != tripId
    }
    res.render('trips',{tripListing:userTrips})
})

//post route for trips
app.post('/admin/trips',(req,res)=>{
    
    let tripId = guid()
    let title = req.body.title
    let imageURL = req.body.imageURL
    let dateOfDeparture = req.body.dateOfDeparture
    let dateOfReturn = req.body.dateOfReturn
    console.log(req.session, req.session.user)
    if(req.session && req.session.username){
       
    
        var newTrip = {tripId: tripId, tripTitle: title, tripImageURL: imageURL, tripDateOfDeparture: dateOfReturn, tripdateOfReturn: dateOfReturn, createdBy: req.session.username }
    //being able to add new trip to trips array
        trips.push(newTrip)
        userTrips.push(newTrip)
        //render the mustache page called trips
        res.render('trips',{tripListing: userTrips})

    }
})




