import React, { Component } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

export default class AddTeacher extends Component {

    constructor(props){ 
        super(props)
        this.state = {
            name : '', surname: '', designation: '', dob: '', age: '', gender: '',
            moleone: '', moletwo: '', photo: null, subjects : [], newSubjects : [],
            telugu: '', hindi: '', english: '', maths: '',
            ps: '', ns: '', social: '', sanskrit: '',
            photoPreview: '', photoVisible : false, isUpdated: false, 
            successMessage: false, errorMessage: false, inputKey : '', checked: false
        }
        
    }

    oncChange = (e)=>{

        const subject = e.target.value

        console.log(subject)
        
        if(e.target.checked){
            this.setState({checked: e.target.value})
            const newSubjects = [...this.state.subjects]
            newSubjects.push(subject)
            this.setState({subjects : newSubjects})
        } else {
            const newSubjects = this.state.subjects.filter(item=>{return item !== subject})
            this.setState({subjects : newSubjects})
        }

        if(subject === 'Telugu'){
            this.setState({telugu : subject})
        } else if (subject === 'Hindi'){
            this.setState({hindi : subject})
        } else if (subject === 'English'){
            this.setState({english : subject})
        } else if (subject === 'Maths'){
            this.setState({maths : subject})
        } else if (subject === 'PS'){
            this.setState({ps : subject})
        } else if (subject === 'NS'){
            this.setState({ns : subject})
        } else if (subject === 'Social'){
            this.setState({social : subject})
        } else if (subject === 'Sanskrit'){
            this.setState({sanskrit : subject})
        } 


    } 
    
    onDOBChange = (e)=>{
        e.preventDefault()
        const dob = moment(e.target.value).format('YYYY-MM-DD')

        const years = moment().diff(dob, 'years')
        // const months = moment().diff(dob, 'months') % 12;
        // const days = Math.floor(moment().diff(dob,'days') / 365)
        //const age = moment().diff(dob, 'years')
        // console.log(years)
        // const agenow = years  + ' - ' + months + ' - ' + days
        this.setState({dob: dob})
        this.setState({age: years})
    }

    handleOptionChange = (e)=> {
        alert(e.target.value)
        this.setState({
          gender: e.target.value
        });
      }

    onChange = (e)=>{
        e.preventDefault()
        this.setState({[e.target.name] : e.target.value})
    }

    onPhotoChange = (e)=>{
        e.preventDefault()
        const file = e.target.files[0]
        this.setState({photo : file})
        if(file){
            const reader = new FileReader()
            reader.onload = (event) => {
                this.setState({photoVisible : true})
                this.setState({photoPreview : event.target.result})
            }
            reader.readAsDataURL(file);
        }

    }

    onSubmit = (e)=>{
        e.preventDefault()

        this.setState({isUpdated: true})
 
        let checked = this.state.checked
            checked = !checked
            this.setState({checked})

        const data = new FormData()
        data.append('name', this.state.name)
        data.append('surname', this.state.surname)
        data.append('designation', this.state.designation)
        data.append('dob', this.state.dob)
        data.append('age', this.state.age)
        data.append('gender', this.state.gender)
        data.append('subjects', this.state.subjects)
        data.append('moleone', this.state.moleone)
        data.append('moletwo', this.state.moletwo)
        data.append('file', this.state.photo)

        setTimeout(()=>{
            console.log(data)
        }, 1000)

        axios.post('http://localhost:5000/addteacher', data)
             .then(res=>{
                //$('body, html').animate({scrollTop:$('#addteacherForm').offset().top}, 'slow');
                console.log(res.data.errorMessage)
                if (!res.data.errorMessage){
                    this.setState({isUpdated: false})
                    this.setState({successMessage: true})
                    this.setState({photoVisible: false})
                
                } else {
                    this.setState({errorMessage : true})
                    this.setState({isUpdated: false})
                }
                
                // this.setState({newSubjects : res.data.subjects[0].split(',')})
                // window.scrollTo({
                //      top : 0,
                //      behaviour : 'smooth'
                // })
                this.setState({name : ''})
                this.setState({surname : ''})
                this.setState({designation : ''})
                this.setState({dob : ''})
                this.setState({age : ''})
                this.setState({gender : ''})
                this.setState({moleone : ''})
                this.setState({moletwo : ''})
                let randomString = Math.random().toString(36);
                this.setState({inputKey: randomString})
                this.setState({telugu: ''})
                this.setState({hindi: ''})
                this.setState({english: ''})
                this.setState({maths: ''})
                this.setState({ps: ''})
                this.setState({ns: ''})
                this.setState({social: ''})
                this.setState({sanskrit: ''})
                
             })
             .catch(err=>{
                console.log(err.response.message)
             })
    }

    render() {

        // const { newSubjects } = this.state
        const { photoVisible, photoPreview, isUpdated, successMessage, errorMessage } = this.state

        return (
        <div className="container">
            <Form onSubmit={this.onSubmit} id="addteacherForm" className="mt-3" style={{padding: '30px'}} encType='multipart/form-data'>
                <fieldset>
                    <h5 className="text-success text-center m-2">New Entry</h5>
                    {successMessage ? <p className="bg-success text-white p-2">Record inserted successfully!!!</p> : ''}
                    {errorMessage ? <p className="bg-danger text-white p-2">Something went wrong</p> : ''}
                <Form.Row className="my-4">
                    <Col lg={6}>
                        <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={this.state.name} name="name" onChange={this.onChange} required />
                        </Form.Group>
                    </Col>
                    <Col lg={6}>
                        <Form.Group as={Col} controlId="formGridSurname">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control type="text" value={this.state.surname} name="surname" onChange={this.onChange} required/>
                        </Form.Group>
                    </Col>
                </Form.Row>

                <Form.Row className="my-2">
                <Col lg={3}>
                    <Form.Group as={Col} controlId="formGridAddress1">
                        <Form.Label>Designation</Form.Label>
                        <Form.Control as="select" value={this.state.designation} name="designation" onChange={this.onChange} required>
                            <option value="">Select</option>
                            <option value="Gr-II HM">Gr-II HM</option>
                            <option value="SA Maths">SA MATHS</option>
                            <option value="SA PS">SA PS</option>
                        </Form.Control>
                    </Form.Group>
                </Col>    
                <Col lg={3}>
                    <Form.Group as={Col} controlId="formGridAddress2">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" value={this.state.dob} name="dob" onChange={this.onDOBChange} required/>
                    </Form.Group>
                </Col>    
                <Col lg={3}>
                    <Form.Group as={Col} controlId="formGridAddress2">
                        <Form.Label>Age</Form.Label>
                        <Form.Control disabled value={this.state.age} name="age" />
                    </Form.Group>
                </Col>    
                <Col lg={3}>
                    <Form.Group as={Col} controlId="formGridAddress2">
                        <Form.Label>Gender</Form.Label><br></br>
                        <div>
                        <Form.Check type="radio" inline label="Male" name="gender" value='Male' 
                        checked={this.state.gender === 'Male'}
                        onChange={this.handleOptionChange}
                        />
                        <Form.Check type="radio"  inline label="Female" name="gender" value='Female'
                        checked={this.state.gender === 'Female'}
                        onChange={this.handleOptionChange}
                        />
                        </div>
                    </Form.Group>
                </Col>    
                </Form.Row>

                <Form.Row className="my-2">
                <Col lg={4}>
                    <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>Subjects</Form.Label><br></br>
                    <Form.Check type="checkbox" inline label="Telugu" value="Telugu" name="telugu" onChange={this.oncChange} checked={this.state.telugu}/>
                    <Form.Check type="checkbox" inline label="Hindi" value="Hindi" name="hindi" onChange={this.oncChange} checked={this.state.hindi}/>
                    <Form.Check type="checkbox" inline label="English" value="English" name="english" onChange={this.oncChange} checked={this.state.english}/>
                    <Form.Check type="checkbox" inline label="Maths" value="Maths" name="maths" onChange={this.oncChange} checked={this.state.maths}/>
                    <Form.Check type="checkbox" inline label="PS" value="PS" name="ps" 
                    onChange={this.oncChange} checked={this.state.ps}/>
                    <Form.Check type="checkbox" inline label="NS" value="NS" name="ns" 
                    onChange={this.oncChange} checked={this.state.ns}/>
                    <Form.Check type="checkbox" inline label="Social" value="Social" name="social" onChange={this.oncChange} checked={this.state.social}/>
                    <Form.Check type="checkbox" inline label="Sanskrit" value ="Sanskrit" name="skt" onChange={this.oncChange} checked={this.state.sanskrit}/>
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Upload Photo</Form.Label>
                        <Form.File name="photo" onChange={this.onPhotoChange} accept="image/*"
                        required key={this.state.inputKey || ''}/>
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group as={Col}>
                        <div>
                        {photoVisible ? (
                                        <img src={photoPreview ? photoPreview : ''}  
                                        alt="PhotoPreview" style={{width: 100, height: 100}}/>
                                    ) : ''}
                        </div>        
                    </Form.Group>
                </Col>
                </Form.Row>
                <Form.Row className="my-2">
                <Col lg={4}>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Mole one</Form.Label>
                            <Form.Control as="textarea" value={this.state.moleone} name="moleone" onChange={this.onChange} required></Form.Control>
                        </Form.Group>
                </Col>        
                <Col lg={4}>
                        <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Mole two</Form.Label>
                            <Form.Control as="textarea" value={this.state.moletwo} name="moletwo" onChange={this.onChange} required></Form.Control>
                    </Form.Group>
                </Col>    
                </Form.Row>
                <Form.Group className="text-center">
                    <Button variant="success" className="btn" type="submit">Submit</Button>
                </Form.Group>
                {isUpdated ? <div>Data is saving...pls wait</div> : ''}
                </fieldset>
            </Form>
                       
            
        </div>
        )
    }
}
