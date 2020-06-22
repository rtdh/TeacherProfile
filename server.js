const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors')

const app = express();
const port = process.env.port || 5000;
require('dotenv/config')

//DB Config
const mongodb = require('./config/keys').mongoURI

//MongoDB connection
mongoose
    .connect(mongodb,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false})
    .then(()=>console.log(`MongoDB Connection successful...`))
    .catch(()=>console.log(`Error in mongoDB Connection...`))

// Passport middleware
app.use(passport.initialize())

// Passport Config
require('./config/passport')(passport)



// Routes
const connectionRoutes = require('./routes/connection')
const sampleRoutes = require('./routes/sample')
const userRoutes = require('./routes/users')
const teacherRoutes = require('./routes/teacher')

//Middleware for bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

app.get('/',(req,res)=>{
    res.json({"Title" : "Welcome to MERN Project"})
})

// Routes
app.use(connectionRoutes)
app.use(sampleRoutes)
app.use(userRoutes)
app.use(teacherRoutes)

app.listen(port, ()=>console.log(`Teacher Profile Server started at port ${port}`));