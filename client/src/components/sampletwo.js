import React, { Component, useEffect, useState } from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
//import * as Yup from 'yup'
import TextError from './TextError'
import axios from 'axios'
import moment from 'moment'


const AddTeacher = ()=> {

   const [mandals, setMandals] = useState([])
   const [mandal, setMandal] = useState('')

   const [schools, setSchools] = useState([])
   const [school, setSchool] = useState('')

   useEffect(()=>{
        axios.get('http://localhost:5000/loadmandals')
        .then(res=>{
            const newMandals = []
            res.data.map(mandal=>(
                newMandals.push(mandal.mandal)
            ))
            setMandals(newMandals)
        })
        .catch(err=>{
            console.log(err)
        })
   },[])
      
    const onMandalChange = (mdlname)=>{

        console.log(mdlname)
        setMandal(mdlname)

        axios.post('http://localhost:5000/loadschools', {mandal : mdlname})
            .then(res=>{
                const newSchools= []
                res.data.map(school=>(
                    newSchools.push(school.schoolnamewithudisecode)
                ))
                setSchools(newSchools)
            })
            .catch(err=>{
                console.log(err)
            })
    }

    const onSchoolChange = (e)=>{
        setSchool(e.target.value)
    }

    // onRadioChange = (e)=>{
    //     e.preventDefault()
    //     console.log(e.target.value)
    //     this.setState({gender : e.target.value})
    // }

    const onPhotoChange = (e)=>{
        e.preventDefault()
        const file = e.target.files[0]
        this.setState({photo : file})
        // if(file){
        //     const reader = new FileReader()
        //     reader.onload = (event) => {
        //         this.setState({photoVisible : true})
        //         this.setState({photoPreview : event.target.result})
        //     }
        //     reader.readAsDataURL(file);
        // }
    }

       
   
    
    return (
    <div className="container mt-5">
        <Formik
        initialValues={{district: '', mandal: mandal, school:school, 
        mandals: mandals, schools: schools, name: '', surname: '', designation: '', dob:'', dojs:'', dor: '', retirementAge: 60,subjects : [''], gender: '', photo: '', photoVisible: false,
        photoPreview: '', moleone: '', moletwo: ''
}}
        //validationSchema={validationSchema}
        onSubmit={(values, {setSubmitting, resetForm})=>{
            
                console.log('values', values)
        }}
        enableReinitialize
        >
    {
        formik =>{
            const {values, handleChange, handleBlur, setFieldValue} = formik
            
            console.log('values', values)
            
            return (
            <Form encType="multipart/form-data">
                <h3>Add Teacher sample two</h3>
                {/* First Row */}
                <div className="row my-4">
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">Mandal</label>
                            <Field as="select" name="mandal" className="form-control"
                            
                            onChange={(e)=>onMandalChange(e.target.value)} 
                            >
                            <option value="">Select</option>
                            {values.mandals.map(mandal=>(
                                <option key={mandal} value={mandal}>{mandal}</option>
                            ))}    
                            </Field>   
                            <ErrorMessage name='mandal' component={TextError}/>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">School</label>
                            <Field as="select" name="school" className="form-control"
                            onChange={(e)=>onSchoolChange(e)}
                            >
                                <option value="">Select</option>
                                {values.schools.map(school=>(
                                <option key={school} value={school}>{school}</option>
                            ))}   
                            </Field> 
                            <ErrorMessage name='school' component={TextError}/>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <Field type="text" name="name" className="form-control"/>
                            <ErrorMessage name='district' component={TextError}/>
                        </div>
                    </div>
                </div>
                {/* End of first row */}

                {/* Second row */}
                <div className="row my-4">
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">Designation</label>
                            <Field as="select" name="designation" className="form-control">
                                <option value="">Select</option>
                                <option value="GR-II HM">Gr-II HM</option>
                                <option value="SA MATHS">SA MATHS</option>
                                <option value="SA PS">SA PS</option>
                                <option value="SA SOCIAL">SA SOCIAL</option>
                            </Field> 
                            <ErrorMessage name='designation' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">DOB</label>
                            <input type="date" value={values.dob} name="dob" className="form-control"
                            onChange={(e)=>{
                                //const dob = moment(e.target.value).format('DD/MM/YYYY')
                                const days = moment(e.target.value).daysInMonth()
                                const date = moment(e.target.value).get('date')
                                const noOfDaysToBeAdded = days - date;
                                const dor = moment(e.target.value).add(60, 'years').add(noOfDaysToBeAdded, 'days').format('DD/MM/YYYY')
                                setFieldValue('dob', e.target.value)
                                setFieldValue('dor', dor)
                            }}/>
                            <ErrorMessage name='dob' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="name">DoJS</label>
                            <Field type="date" value={values.dojs} name="dojs" className="form-control"/>
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
                            <Field as="select" name="designation" className="form-control"
                            disabled
                            onChange={(e)=>{
                    
                                const days = moment(values.dob).daysInMonth()
                                const date = moment(values.dob).get('date')
                                const noOfDaysToBeAdded = days - date;
            
                                const dor = moment(values.dob).add(e.target.value, 'years').add(noOfDaysToBeAdded, 'days').format('DD/MM/YYYY')
                                setFieldValue('retirementAge', e.target.value)
                                setFieldValue('dor', dor)
            
                            }}
                            
                            >
                                <option value="">Select</option>
                                <option value="60">60</option>
                                <option value="62">62</option>
                                <option value="63">63</option>
                            </Field> 
                            <ErrorMessage name='designation' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="form-group">
                            <label htmlFor="dor">DoR</label>
                            <Field name="dor" className="form-control" disabled/>
                            <ErrorMessage name='dor' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="form-group">
                            <label htmlFor="name">Gender</label>
                            <Field as="select" name="gender" className="form-control">
                                <option value="">Select</option>
                                <option value="MALE">MALE</option>
                                <option value="FEMALE">FEMALE</option>
                                
                            </Field> 
                            <ErrorMessage name='designation' component={TextError}/>
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="mandal">Gender</label><br></br>
                            
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" value="Male" id="male" checked={this.state.gender === 'Male'}
                            onChange={async (e)=>{
                                
                                this.onRadioChange(e)
                            }}
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
                            <input type="file" name="photo" accept="image/*" 
                            onChange={(e)=>this.onPhotoChange(e)}/>
                            <ErrorMessage name='photo' component={TextError}/>
                        </div>
                    </div>
                    <div className="col-lg-2">
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

                                return (<div><button type="button" onClick={()=>push('')}>Add new subject</button>
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
                                </div>)
                            }
                        }
                        
                    </FieldArray>
                </div>
                </div>
                    <div className="col-lg-3">
                        <div className="form-group">
                            <label>Mole One</label><br></br>
                            <Field as="textarea" name="moleone" />
                        </div> 
                    </div>
                    <div className="col-lg-3">
                        <div className="form-group">
                            <label>Mole Two</label><br></br>
                            <Field as="textarea" name="moletwo" />
                        </div> 
                    </div>
                </div>
                {/* end of fourth row */}
                {/* firth row */}
                <div className="row my-4">
                    <div className="col-lg-4 m-auto">
                        <div className="form-group">
                            <input type="submit" value="Submit" 
                            className="btn btn-success btn-block form-control"/>
                        </div>
                    </div>
                </div>
                {/* end of fifth row */}
                    <pre style={{color: 'white'}}>{JSON.stringify(values, null, 3)}</pre>
            </Form>
            )
        }
    }
    </Formik>
    </div>
    )
  }

export default AddTeacher