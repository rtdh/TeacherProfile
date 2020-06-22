const express = require('express')
const  mysql = require('mysql')
const app = express.Router()

app.get('/sample', (req, res)=>{
    let sql = `SELECT distinct mandal from enrolment_1 GROUP BY mandal`
	db.query(sql, function(err, results){
		if(err){
			res.send({"msg": "failed fetching data"})
		} else {
			res.send(results)
		}
	})
})

app.get('/loaddistricts', (req, res)=>{
	let sql = `SELECT district from zone_2 GROUP BY district`;
	db.query(sql, (err, results)=>{
		if(err) throw err
		console.log(results)
		res.send(results)
	})
})

app.get('/loadmandals', (req, res)=>{
	//console.log('load mandals route')
	//console.log(req.body)
	let sql = `SELECT distinct mandal from zone_2 where district='WEST GODAVARI' GROUP BY mandal`;
	db.query(sql, (err, mandals)=>{
		if(err) throw err
		//console.log(mandals)
		res.send(mandals)
	})
})

app.post('/loadschools', (req, res)=>{
	//console.log('load mandals route')
	//console.log(req.body)
	let sql = `SELECT schoolnamewithudisecode from zone_2 where district='WEST GODAVARI' and 
	mandal='${req.body.mandal}'`;
	db.query(sql, (err, schools)=>{
		if(err) throw err
		//console.log(schools)
		res.send(schools)
	})
})

app.post('/getschooldata', (req, res)=>{
	//console.log('load mandals route')
	console.log(req.body)
	let sql = `SELECT * from zone_2 where district='${req.body.district}' and 
	mandal='${req.body.mandal}' and schoolname='${req.body.school}'`;
	db.query(sql, (err, school)=>{
		if(err) throw err
		console.log(school)
		res.send(school)
	})
})




module.exports = app;