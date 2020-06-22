import React, { Component } from 'react'
//import { Redirect } from 'react-router-dom'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import TextError from './TextError'
import axios from 'axios'
import moment from 'moment'
import '../App.css'

const initialValues = {
            id: '', district: '', mandal: '', school:'', mandals: [], schools: [],
            name: '', surname: '', designation: '', dob:'', dojs:'', dor: '', 
            retirementAge: '', retirementAgeDisabled : false,
            subjects : [], gender: '', photoUpload: '', photoSaved: '', photoVisible: false,
            photoPreview: '', moleone: '', moletwo: '', isUpdated: false, inputKey:'',
            teacher: {}
}

const validationSchema = Yup.object().shape({
    mandal : Yup.string().required('Mandal can not be blank'),
    school : Yup.string().required('School can not be blank'),
    name : Yup.string()
            .required('Name can not be blank')
            .min(3, 'Name should have atleast 3 characters')
            .max(40, 'Name should contain lessthan 40 characters'),
    designation : Yup.string().required('Designation can not be blank'),
    dob : Yup.string().required('Date of Birth can not be blank'), 
    dojs : Yup.string().required('Date of Joining can not be blank'),
    gender : Yup.string().required('Gender can not be blank'),
    photoUpload : Yup.mixed().required('Upload a photo'),
    subjects : Yup.string().required('Can not  be blank'),
    moleone : Yup.string().required('Enter moles'),
    moletwo : Yup.string().required('Enter moles')       

})

class AddTeacher extends Component {

    constructor(props){
        super(props)
        this.state = initialValues;
    }

   componentDidMount(){
        axios.get('http://localhost:5000/showteacher/' + this.props.match.params.id)
            .then(res=>{
                console.log(res.data)

                const subjectArray = res.data.subjects.split(',')    
                this.setState({id: res.data._id})
                this.setState({mandal : res.data.mandal})
                this.setState({school : res.data.school})
                this.setState({name : res.data.name})
                this.setState({designation : res.data.designation})
                this.setState({dob : res.data.dob})
                this.setState({dojs : res.data.dojs})
                this.setState({retirementAge : res.data.retirementAge})
                this.setState({dor : res.data.dor})
                this.setState({gender : res.data.gender})
                this.setState({subjects: subjectArray})
                this.setState({moleone : res.data.moleone})
                this.setState({moletwo : res.data.moletwo})

                this.setState({photoSaved: res.data.photo})
                
            })
            .catch(err=>{
                console.log(err)
            })

        axios.get('http://localhost:5000/loadmandals')
        .then(res=>{
            const newMandals = []
            res.data.map(mandal=>(
                newMandals.push(mandal.mandal)
            ))
            this.setState({mandals : newMandals})
        })
        .catch(err=>{
            console.log(err)
        })    
    }

    onMandalChange = (mdlname)=>{

        console.log(mdlname)
        this.setState({school: ''})
        this.setState({mandal: mdlname})
        const mdl = {
            mandal : mdlname
        }
        axios.post('http://localhost:5000/loadschools', mdl)
            .then(res=>{
                const newSchools= []
                res.data.map(school=>(
                    newSchools.push(school.schoolnamewithudisecode)
                ))
                this.setState({schools : newSchools})
            })
            .catch(err=>{
                console.log(err)
            })
    }

    

    onRadioChange = (e)=>{
        e.preventDefault()
        console.log(e.target.value)
        this.setState({gender : e.target.value})
    }

    onPhotoChange = (e)=>{
        e.preventDefault()
        this.setState({photoSaved: ''})
        const file = e.target.files[0]
        this.setState({photoUpload : file})
        if(file){
            const reader = new FileReader()
            reader.onload = (event) => {
                this.setState({photoVisible : true})
                this.setState({photoPreview : event.target.result})
            }
            reader.readAsDataURL(file);
        }
    }

       
    render(){
    
    //console.log(this.state.subjects)
    return (
    <div className="container mt-5">
        <Formik
        initialValues={this.state}
        validationSchema={validationSchema}
        onSubmit={(values, {setSubmitting, resetForm})=>{
            console.log('values', values)
            setTimeout(()=>{

                this.setState({isUpdated:true})
                const data = new FormData()

                data.append('mandal', values.mandal)
                data.append('school', values.school)
                data.append('name', values.name)
                data.append('designation', values.designation)
                data.append('dob', values.dob)
                data.append('dojs', values.dojs)
                data.append('retirementAge', values.retirementAge)
                data.append('dor', values.dor)
                data.append('gender', values.gender)
                
                data.append('subjects', values.subjects)
                data.append('moleone', values.moleone)
                data.append('moletwo', values.moletwo)

                if(values.photoUpload){
                    data.append('photoUpload', values.photoUpload)
                }

                //console.log(data)

                axios.post('http://localhost:5000/updateteacher/' + this.state.id, data)
                        .then(res=>{
                            
                            this.setState({isUpdated:false})

                            let randomString = Math.random().toString(36);
                            this.setState({inputKey : randomString})
                            this.setState({photoVisible: false})
                            if(res){
                                console.log(res.data)
                                alert('Record updated successfully!!!')
                                this.props.history.push('/teacherslist')
                            }
                            
                        })
                        .catch(err=>console.log(err))

            },500)

            
        }}
        enableReinitialize
        >
    {
        formik =>{
            const {values, handleChange, handleBlur} = formik
            
            //console.log('values', values)
            
            return (
            <Form id="addteacherForm" encType="multipart/form-data">
                <h3 className="display-4">Edit <span style={{color: 'red'}}>{values.name}</span> Details</h3>
                {/* First Row */}
                <div className="row my-4">
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">Mandal</label>
                            <select name="mandal" className="form-control"
                            value={values.mandal}
                            onChange={(e)=>this.onMandalChange(e.target.value)}
                            onBlur={handleBlur} 
                            >
                            <option value={values.mandal}>{values.mandal}</option>
                            {values.mandals.map(mandal=>(
                                <option key={mandal} value={mandal}>{mandal}</option>
                            ))}    
                            </select>   
                            <ErrorMessage name='mandal' component={TextError}/>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">School</label>
                            <select name="school" className="form-control"
                            onChange={(e)=>this.setState({school: e.target.value})} value={this.state.school}
                            onBlur={handleBlur}
                            >
                                {this.state.school ? (
                                    <option value={this.state.school}>{this.state.school}</option>
                                ) : null}
                                
                                <option value="">Select</option>
                                {values.schools.map(school=>(
                                <option key={school} value={school}>{school}</option>
                            ))}   
                            </select> 
                            <ErrorMessage name='school' component={TextError}/>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" className="form-control"
                            value={values.name}
                            onChange={(e)=>this.setState({name: e.target.value})}
                            onBlur={handleBlur}
                            />
                            <ErrorMessage name='name' component={TextError}/>
                        </div>
                    </div>
                </div>
                {/* End of first row */}

                {/* Second row */}
                <div className="row my-4">
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">Designation</label>
                            <select name="designation" className="form-control"
                            onChange={(e)=>this.setState({designation: e.target.value})} 
                            value={values.designation}
                            onBlur={handleBlur}
                            
                            >
                                <option value="">Select</option>
                                <option value="GR-II HM">Gr-II HM</option>
                                <option value="SA MATHS">SA MATHS</option>
                                <option value="SA PS">SA PS</option>
                                <option value="SA SOCIAL">SA SOCIAL</option>
                            </select> 
                            <ErrorMessage name='designation' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">DOB</label>
                            <input type="date" value={this.state.dob} name="dob" className="form-control"
                            onChange={(e)=>{
                                //const dob = moment(e.target.value).format('DD/MM/YYYY')
                                const days = moment(e.target.value).daysInMonth()
                                const date = moment(e.target.value).get('date')
                                const noOfDaysToBeAdded = days - date;
                                const dor = moment(e.target.value).add(60, 'years').add(noOfDaysToBeAdded, 'days').format('DD/MM/YYYY')
                                //setFieldValue('dob', e.target.value)
                                //setFieldValue('dor', dor)
                                this.setState({dob: e.target.value})
                                this.setState({dor: dor})
                                //this.setState({retirementAgeDisabled : true})

                            }}/>
                            <ErrorMessage name='dob' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">DoJS</label>
                            <Field type="date" value={this.state.dojs} name="dojs" className="form-control"
                            onChange={(e)=>this.setState({dojs: e.target.value})} 
                            onBlur={handleBlur}
                            />
                            <ErrorMessage name='dojs' component={TextError}/>
                        </div>
                    </div>
                </div>
                {/* End of second row */}

                {/* Third row */}

                <div className="row my-4">
                    <div className="col-lg-2">
                        <div className="form-group">
                            <label htmlFor="name">Retirement Age</label>
                            <select name="retirementAge" className="form-control"
                            value={values.retirementAge} 
                            
                            onChange={(e)=>{

                                if(!this.state.dob) {
                                    alert('First select dob')
                                    this.setState({retirementAge : ''})
                                } else {

                                    const days = moment(values.dob).daysInMonth()
                                    const date = moment(values.dob).get('date')
                                    const noOfDaysToBeAdded = days - date;
                
                                    const dor = moment(values.dob).add(e.target.value, 'years').add(noOfDaysToBeAdded, 'days').format('DD/MM/YYYY')
                                    // setFieldValue('retirementAge', e.target.value)
                                    // setFieldValue('dor', dor)
                                    this.setState({retirementAge: e.target.value})
                                    if(this.state.dob) {
                                        this.setState({dor: dor})
                                    }
                                }
                                
            
                            }}
                            
                            >
                                <option value="" disabled={false}>Select</option>
                                <option value="60" disabled={false}>60</option>
                                <option value="62" disabled={false}>62</option>
                                <option value="63" disabled={false}>63</option>
                            </select> 
                            <ErrorMessage name='designation' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="form-group">
                            <label htmlFor="dor">DoR</label>
                            <input type="text" name="dor" className="form-control" disabled
                            value={this.state.dor}
                            />
                            <ErrorMessage name='dor' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="form-group">
                            <label htmlFor="name">Gender</label>
                            <select name="gender" className="form-control"
                            onChange={(e)=>this.setState({gender: e.target.value})} 
                            value={values.gender}
                            onBlur={handleBlur}
                            >
                                <option value="">Select</option>
                                <option value="MALE">MALE</option>
                                <option value="FEMALE">FEMALE</option>
                                
                            </select> 
                            <ErrorMessage name='designation' component={TextError}/>
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="mandal">Gender</label><br></br>
                            
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" value="Male" id="male" checked={this.state.gender === 'Male'}
                            onChange={(e)=>this.onRadioChange(e)}
                            
                            />
                            <label className="form-check-label" htmlFor="male">Male</label>
                            </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" value="Female" id="female" checked={this.state.gender === 'Female'}
                            onChange={(e)=>this.onRadioChange(e)}
                            />
                            <label className="form-check-label" htmlFor="female">Female</label>
                            </div>
                            <ErrorMessage name='email' component={TextError}/>
                        </div> */}
                    </div>
                    <div className="col-lg-2">
                        <div className="form-group">
                            <label>Upload Photo</label>
                            <input type="file" name="photoUpload" accept="image/*" 
                            key={this.state.inputKey} 
                            onChange={(e)=>this.onPhotoChange(e)} onBlur={handleBlur}/>
                            <ErrorMessage name='photoUpload' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-4 text-center">
                        {this.state.photoSaved ? (
                            <img src={this.state.photoSaved}  
                            alt="PhotoPreview" style={{width: 100, height: 100}}/>) : null}
                        {values.photoVisible ? (
                            <img src={values.photoPreview ? values.photoPreview : ''}  
                            alt="PhotoPreview" style={{width: 100, height: 100}}/>
                            ) : ''}   
                            
                    </div>
                </div> 
                {/* End of third row        */}

                {/* Fourth Row */}
                <div className="row my-4">
                <div className="col-lg-6">
                <div className="form-group">
                    <label>Subjects taught</label>
                    <FieldArray name="subjects">
                            {
                                (fieldArrayProps)=>{
                                    //console.log(fieldArrayProps)
                                    const {push, remove, form} = fieldArrayProps
                                    const {values} = form
                                    const {subjects} = values
                                    return <div><button type="button" onClick={()=>push('')}>Add new subject</button>
                                    
                                    {
                                        
                                        subjects.map((subject,index)=>(
                                        <div key={index}>
                                            <Field value={index + 1} disabled style={{width: '50px'}}/>
                                            <Field name={`subjects[${index}]`} placeholder="Subject dealing"/>
                                            
                                            {
                                                index > 0 && 
                                                <button type="button" onClick={()=>remove(index)}>Delete</button>
                                            }
                                                                        
                                        </div>
                                        ))
                                    }
                                    </div>
                                }
                            }
                            
                    </FieldArray>
                    <ErrorMessage name='subjects' component={TextError}/>
                </div>
                </div>
                    <div className="col-lg-3">
                        <div className="form-group">
                            <label>Mole One</label><br></br>
                            <input type="textarea" name="moleone" value={this.state.moleone}
                            onChange={handleChange} onBlur={handleBlur}/>
                            <ErrorMessage name='moleone' component={TextError}/>
                        </div> 
                    </div>
                    <div className="col-lg-3">
                        <div className="form-group">
                            <label>Mole Two</label><br></br>
                            <input type="textarea" name="moletwo" value={this.state.moletwo} 
                            onChange={handleChange} onBlur={handleBlur}/>
                            <ErrorMessage name='moletwo' component={TextError}/>
                        </div> 
                    </div>
                </div>
                {/* end of fourth row */}
                {/* firth row */}
                <div className="row my-4">
                    <div className="col-lg-4 m-auto">
                        <div className="form-group">
                            <input type="submit" value="Update" 
                            className="btn btn-success btn-block form-control"/>
                        </div>
                    </div>
                </div>
                {/* end of fifth row */}
                    {/* <pre style={{color: 'white'}}>{JSON.stringify(values, null, 3)}</pre> */}
                {this.state.isUpdated ? <div>pls wait... record is updating</div> : null}    
            </Form>
            )
        }
    }
    </Formik>
    </div>
    )
  }
}
export default AddTeacher