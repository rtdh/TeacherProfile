import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
//import * as Yup from 'yup'
import TextError from './TextError'
import axios from 'axios'



class Enrolement extends Component {

    constructor(props){
        super(props)
        this.state = {
            district: '', mandal: '', school:'', schooldata: [],
            districts: [], mandals: [], schools: [], inputkey: '', isUpdated: false
        }
    }

    componentDidMount(){
        axios.get('http://localhost:5000/loaddistricts')
        .then(res=>{
            const newDistricts = []
            res.data.map(district=>(
                newDistricts.push(district.district)
            ))
            this.setState({districts : newDistricts})
            //console.log(newDistricts)
            
         })
        .catch(err=>{
            console.log(err)
        })
    }

    onDistrictChange = (district)=>{

        this.setState({district})
        
        console.log(district)
        //alert(district)
        const dist = {
            district : district
        }
        axios.post('http://localhost:5000/loadmandals', dist )
             .then(res=>{
                 console.log(res.data)
                 this.setState({mandals: res.data})
             })   
             .catch(err=>console.log(err))
    }

    onMandalChange = (mdl)=>{

        this.setState({mandal: mdl})
        
        const data = {
            district : this.state.district,
            mandal: mdl
        }
        axios.post('http://localhost:5000/loadschools', data )
             .then(res=>{
                 console.log(res.data)
                 this.setState({schools: res.data})
             })   
             .catch(err=>console.log(err))
    }

    onSchoolChange = (sch)=>{
        this.setState({school: sch})
    }

      render(){
        // const {districts, mandals} = this.state
        // console.log(districts)
    return (
        <div className="container">
            <p>Enrolment Class Based</p>
            <Formik
            initialValues={this.state}
            //validationSchema={validationSchema}
            onSubmit={(values, {setSubmitting, resetForm})=>{
                setTimeout(()=>{

                resetForm({})
                              
                console.log('values', this.state)
                
        
                const data ={
                    district : this.state.district,
                    mandal: this.state.mandal,
                    school : this.state.school,
                }
        
                axios.post('http://localhost:5000/getschooldata', data)
                    .then(res=>{
                        //this.setState(initialValues)
                        console.log(res.data)
                        const randomString = Math.random().toString(36)
                        console.log(randomString)
                        setSubmitting(false)

                        // this.setState({schooldata : res.data})
                        // this.setState({district: ''})
                        // this.setState({mandal: ''})
                        // this.setState({school: ''})
                        // this.setState({mandals: ''})
                        // this.setState({schools: ''})
                       
                        
                    })
                    .catch(err=>console.log(err))
                }, 500)    
            }}
            enableReinitialize
            >
                {
                    formik =>{
                        const {values, handleChange, handleBlur} = formik
                        console.log('values',  formik.touched)
                        return (
                            <Form>
                            <h3>Enrolement</h3>
                            <div className="form-group">
                                <label htmlFor="name">District</label>
                                <select id="district" name="district" value={values.district || ''}className="form-control"
                                onChange={(e)=>{
                                    //setFieldTouched()
                                    //setFieldValue('district', e.target.value)
                                    handleChange(e)
                                    this.onDistrictChange(e.target.value)}}
                                onBlur={handleBlur}    
                                >
                                    <option value="">Select</option>
                                    {values.districts.map(district=>(
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                  
                                </select>
                                <ErrorMessage name='district' component={TextError}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="mandal">Mandal</label>
                                <select id="mandal" name="mandal" value={values.mandal || ''} className="form-control"
                                onChange={(e)=>{
                                    //setFieldTouched()
                                    //setFieldValue('mandal', e.target.value)
                                    handleChange(e)
                                    this.onMandalChange(e.target.value)
                                }}
                                onBlur={handleBlur}
                                >
                                   <option value="">Select</option>
                                    {values.mandals ? values.mandals.map(mandal=>(
                                        <option key={mandal.mandal} value={mandal.mandal}>{mandal.mandal}</option>
                                    )):null}
                                  
                                </select>
                                <ErrorMessage name='email' component={TextError}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">School</label>
                                <select id="school" name="school" value={values.school || ''} className="form-control"
                                onChange={(e)=>{
                                    //setFieldTouched()
                                    //setFieldValue('mandal', e.target.value)
                                    handleChange(e)
                                    this.onSchoolChange(e.target.value)
                                }}
                                onBlur={handleBlur}
                                >
                                   <option value="">Select</option>
                                    {values.schools ? values.schools.map(school=>(
                                        <option key={school.schoolname} value={school.schoolname}>{school.schoolname}</option>
                                    )) : null}
                                  
                                </select>
                                <ErrorMessage name='password'/>
                            </div>
                            <Field key={this.state.inputkey} name="hiddenname" id="hiddenname"/>

                            <input type="submit" value="Submit" className="btn btn-success"></input>
                             <div>Districts: {JSON.stringify(values.districts)}</div>
                             <div>District{JSON.stringify(values.district)}</div>
                             <div>Mandal: {JSON.stringify(values.mandal)}</div>
                             <div>School: {JSON.stringify(values.school)}</div>
                             <div>Inputkey: {JSON.stringify(values.inputkey)}</div>
                             <div>touched: {JSON.stringify(values.touched)}</div>
                             
                        </Form>
                        
                        )
                    }
                }
            
            </Formik>
            <div className="contaier">
                {this.state.schooldata[0] ? (
                <p>SchoolName: {this.state.schooldata[0].schoolname}</p>) : null}
            </div>
        </div>
    )
}
}
export default Enrolement
