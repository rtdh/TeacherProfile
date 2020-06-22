import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import TextError from './TextError'

// const initialValues = {
//     name: '', surname: '', designation: '', dob:'', age: '', gender: '',
//     photo: null, moleone:'', moletwo: ''
// }

const initialValues = {
    name: '', email: '', password: '', comments: '', address: '', 
    social: {facebook: '', twitter: ''},
    phoneNumbers : ['','']
}

const onSubmit = values =>{
    console.log('Form data', values)
} 

// const getMessage = e =>{
//     console.log(e)
// }

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name can not be blank').min(3, 'Name should contain 3 characters'),
    email: Yup.string()
        .required('email can not be blank')
        .email('not valid email'),
    password: Yup.string().required('field can not be blank'),
    //comments: Yup.string().required('Comments can not be blank'),
})

// const validationSchema = Yup.object({
//     name: Yup.string().required('field can not be blank'),
//     surnmae: Yup.string().required('field can not be blank'),
//     designation: Yup.string().required('field can not be blank'),
//     dob: Yup.string().required('field can not be blank'),
//     gender: Yup.string().required('field can not be blank'),
//     photo: Yup.string().required('field can not be blank'),
//     moleone: Yup.string().required('field can not be blank'),
//     moletwo: Yup.string().required('field can not be blank')
// })

function AddTeacherFormik() {
    return (
        <div className="container">
            <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            >
                {
                    formik =>{
                        //console.log('formik',  formik)
                        return (
                            <Form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <Field type="text" id="name" name="name" className="form-control"/>
                                <ErrorMessage name='name' component={TextError}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">Email</label>
                                <Field type="email" id="email" name="email" className="form-control"/>
                                <ErrorMessage name='email' component={TextError}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field type="password" id="password" name="password" className="form-control"/>
                                <ErrorMessage name='password'/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="comments">Comments</label>
                                <Field as="textarea" id="comments" name="comments" className="form-control"
                                validate = {async (e)=>{
                                    //getMessage(e)
                                    //console.log(e)
                                    //formik.validateField('comments')
                                }}
                                />
                                <ErrorMessage name='comments' component={TextError}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor='address'>Address</label>
                                <Field type="text" name='address' className='form-control' />
                            </div>
                            <div className="form-group">
                                <label htmlFor='facebook'>Facebook</label>
                                <Field type="text" name='social.facebook' className='form-control' />
                            </div>
                            <div className="form-group">
                                <label htmlFor='twitter'>Twitter</label>
                                <Field type="text" name='social.twitter' className='form-control' />
                            </div>
                            <div className="form-group">
                                <label htmlFor='twitter'>Primary Ph No.</label>
                                <Field type="text" id="priph" name='phoneNumbers[0]' className='form-control' />
                            </div>
                            <div className="form-group">
                                <label htmlFor='twitter'>Secondary Ph No.</label>
                                <Field type="text" id="secph" name='phoneNumbers[1]' className='form-control' />
                            </div>

                            <input type="submit" value="Submit" className="btn btn-success"></input>
                        </Form>
                        )
                    }
                }
            
            </Formik>
        </div>
    )
}
export default AddTeacherFormik