import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
//import * as Yup from 'yup'
import TextError from './TextError'
import axios from 'axios'



const initialValues = {
    district: '', mandal: '', school:'',
    districts: ['krishna','westgodavari'], mandals: [], schools: []
}

const Enrolement = ()=> {

    //const [districts, setDistricts] = useState([])

    useEffect(()=>{
        axios.get('http://localhost:5000/loaddistricts')
        .then(res=>{
            const newDistricts = []
            res.data.map(district=>(
                newDistricts.push(district.district)
            ))
            //setDistricts(newDistricts)
            console.log(newDistricts)
            
         })
        .catch(err=>{
            console.log(err)
        })
    },[])

    const onDistirctChange = (district)=>{
        console.log(district)
    }
        
    return (
        <div className="container">
            <Formik
            initialValues={initialValues}
            //validationSchema={validationSchema}
            //onSubmit={onSubmit}
            enableReinitialize
            >
                {
                    formik =>{
                        const {values, setFieldValue} = formik
                        //console.log('values',  formik)
                        return (
                            <Form>
                            <h3>Enrolement</h3>
                            <div className="form-group">
                                <label htmlFor="name">District</label>
                                <select id="district" name="district" className="form-control"
                                onChange={(e)=>{
                                    //setFieldValue('district', e.target.value)
                                    onDistirctChange(e.target.value)}}
                                
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
                                <Field type="text" id="mandal" name="mandal" className="form-control"
                                
                                />
                                <ErrorMessage name='email' component={TextError}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">School</label>
                                <Field type="password" id="password" name="password" className="form-control"/>
                                <ErrorMessage name='password'/>
                            </div>

                            <input type="submit" value="Submit" className="btn btn-success"></input>
                             <div>{JSON.stringify(values.districts)}</div>
                        </Form>
                        
                        )
                    }
                }
            
            </Formik>
        </div>
    )
}

export default Enrolement
