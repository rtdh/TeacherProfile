const express = require('express')
const  mysql = require('mysql')
const app = express.Router()
const passport = require('passport')

const Teacher = require('../models/Teacher')


// Multer and Cloudinary Middlewaree

// Multer and Cloudinay

const multer = require('multer');
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dkblawqru', 
  api_key: '628672329365769', 
  api_secret: 'h2wOcQu1YozmkvtyzsD6cvRfVMU'
});

//@route    post /addteacher
//desc      CREATE - Adding teacher to the db
//@access   Public

app.post('/addteacher', upload.single('photo'), passport.authenticate('jwt' , {session: false}),(req, res)=>{
    //console.log('add teacher route')
    //console.log(req.body.subjects)
    console.log(req.body)
    console.log(req.file)
    console.log(req.user)
    cloudinary.v2.uploader.upload(req.file.path, async (err, result)=> {
            
            if(err) throw err

            const teacher = new Teacher()
            teacher.user = req.user._id
            teacher.mandal = req.body.mandal;
            teacher.mandalcode = (req.body.school).substr(0,6)
            teacher.school = req.body.school;
            teacher.udisecode = (req.body.school).substr(0,11)
            teacher.name = req.body.name;
            teacher.cfmsid = req.user.cfmsid

            teacher.designation = req.body.designation;
            teacher.dob = req.body.dob;
            teacher.dojs = req.body.dojs;

            teacher.retirementAge = req.body.retirementAge;
            teacher.dor = req.body.dor;
            teacher.gender = req.body.gender;
            teacher.photo = result.secure_url;

            teacher.subjects = req.body.subjects;
            teacher.moleone = req.body.moleone;
            teacher.moletwo = req.body.moletwo;

            teacher.confirmedbyuser = 'No'
            teacher.confirmedbymeo = 'No'

            await teacher.save((err, teacher)=>{
                if(err) {
                    console.log(err)
                    res.json({"errorMessage" : "Something went wrong..."})
                } else {
                    console.log('teacher inserted successfully!!!')
                    res.json(teacher)
                }
            })
        })   
    })


//@route    GET /teacherslist
//desc      READ - teacherslist
//@access   Public

app.get('/teacherslist', passport.authenticate('jwt' , {session: false}), (req, res)=>{
    console.log(req.user)
    if (req.user.role === 'user') {
        Teacher.find({cfmsid : req.user.cfmsid}, (err, teachers)=>{
            if(err) {
                console.log(err)
            } else {
                //console.log(teachers)
                res.json(teachers)
            }
        })
    } else {
        Teacher.find({mandalcode :  req.user.mandalcode, confirmedbyuser: 'Yes'}, (err, teachers)=>{
            if(err) {
                console.log(err)
            } else {
                //console.log(teachers)
                res.json(teachers)
            }
        })
    }
})

//@route    GET /showteacher
//desc      READ - Individual Teacher Profile
//@access   Public

app.get('/showteacher/:id', passport.authenticate('jwt' , {session: false}), (req, res)=>{
    Teacher.findById(req.params.id, (err, teacher)=>{
        if(err) throw err
        res.send(teacher)
    })
})

//@route    POST /updateteacher
//desc      Update Individual Teacher Profile
//@access   Private

app.post('/updateteacher/:id', upload.single('photoUpload'), passport.authenticate('jwt' , {session: false}), (req, res)=>{
    //console.log(req.body)
    //console.log(req.file)
    console.log(req.user)
    cloudinary.v2.uploader.upload(req.file.path, async (err, result)=> {
        req.body.photo = result.secure_url
        if(req.user.role === 'user'){
            req.body.confirmedbyuser = 'Yes'
        }
        
        if(req.user.role === 'meo') {
            req.body.confirmedbymeo = 'Yes'
        }
        
        console.log(req.body)
         
        if(err) throw err
        await Teacher.findByIdAndUpdate(req.params.id, req.body, (err, updatedTeacher)=>{
            if(err) throw err
            //console.log(updatedTeacher)
            res.send(updatedTeacher)
        })
    })
    
})


//@route    delete /deleteteacher
//desc      DELETE - Deleting teacher from db
//@access   Public

app.delete('/deleteteacher/:id', passport.authenticate('jwt' , {session: false}), (req, res)=>{
    console.log('record deleted in route...')
    Teacher.findByIdAndRemove(req.params.id, (err)=>{
        if(err) throw err
        //res.redirect('/teacherslist')
        console.log('record deleted...')
        res.json({'msg': 'deletion success'})
    })
})




module.exports = app;