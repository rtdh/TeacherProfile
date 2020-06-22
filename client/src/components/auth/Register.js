import React, { Component } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import TextError from '../../components/TextError'
import { connect } from 'react-redux'
import axios from 'axios'
//import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const validationSchema = Yup.object().shape({
    cfmsid : Yup.string().required('cfmsid can not be blank'),
    mandalcode : Yup.string().required('Mandal code can not be blank'),
    surname : Yup.string()
            .required('Surname can not be blank')
            .min(3, 'surname should have atleast 3 characters')
            .max(40, 'surname should contain lessthan 40 characters'),
    name : Yup.string().required('Name can not be blank'),
    password : Yup.string().required('Password can not be blank'), 
    role : Yup.string().required('Role can not be blank')
 
})



class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cfmsid: '', mandalcode: '', surname: '', name: '', password: '', role: ''
        }
        
    }

    componentDidMount(){
        if(this.props.isAuthenticated){
          this.props.history.push('/dashboard')
        }
      }

   
       
    render() {
        const { errors } = this.props
        const { user } = this.props
        return (

            <Formik
            initialValues = {this.state}
            validationSchema = {validationSchema}
            onSubmit = {(values, {setSubmitting, resetForm})=>{

                setTimeout(()=>{

                    const newUser = {
                        cfmsid: this.state.cfmsid,
                        mandalcode: this.state.mandalcode,
                        surname: this.state.surname,
                        name: this.state.name,
                        password: this.state.password,
                        role: this.state.role,
                    }
                    axios
                        .post('http://localhost:5000/register', newUser)
                        .then(response=>{
                            // this.setState({message: response.data})  
                            this.props.dispatch({
                                type: 'REGISTERED_USER',
                                payload: response.data
                            })
                            console.log(response.data)
                            this.props.history.push('/login')
                        })
                        .catch(error=> {
                            // this.setState({errors: error.response.data})
                            this.props.dispatch({
                                type: 'GET_ERRORS',
                                payload: error.response.data
                            })
                            console.log(error.response.data)
                            this.props.history.push('/register')
                        })
                        this.setState({cfmsid: ''})
                        this.setState({mandalcode: ''}) 
                        this.setState({surname: ''})
                        this.setState({name: ''})   
                        this.setState({password: ''})   
                        this.setState({role: ''})   
                    


                }, 500)
            }}
            enableReinitialize
            
            >
                {
                    formik =>{
                        const {values, handleBlur} = formik
                    return (
                    <Form>
                        <p className="text-center">Registration Form</p>
                    <div className="form-group">
                        <input type="text" placeholder="Username" name="cfmsid"
                            className="form-control"
                            value={values.cfmsid}
                            onChange={(e)=>this.setState({cfmsid : e.target.value})}
                            onBlur={handleBlur}
                        />
                    <ErrorMessage name="cfmsid" component={TextError} />
                    </div>
                    <div className="form-group">
                        <input type="Number" placeholder="Mandal Code" name="mandalcode"
                            className="form-control"
                            value={values.mandalcode}
                            onChange={(e)=>this.setState({mandalcode : e.target.value})}
                            onBlur={handleBlur}
                        />
                    <ErrorMessage name="mandalcode" component={TextError} />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Surname" name="surname"
                            className="form-control"
                            value={values.surname}
                            onChange={(e)=>this.setState({surname : e.target.value})}
                            onBlur={handleBlur}
                        />
                    <ErrorMessage name="surname" component={TextError} />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Name" name="name"
                            className="form-control"
                            value={values.name}
                            onChange={(e)=>this.setState({name : e.target.value})}
                            onBlur={handleBlur}
                        />
                    <ErrorMessage name="name" component={TextError} />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" name="password"
                            className="form-control"
                            value={values.password}
                            onChange={(e)=>this.setState({password : e.target.value})}
                            onBlur={handleBlur}
                        />
                    <ErrorMessage name="password" component={TextError} />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Role" name="role"
                            className="form-control"
                            value={values.role}
                            onChange={(e)=>this.setState({role : e.target.value})}
                            onBlur={handleBlur}
                        />
                    <ErrorMessage name="role" component={TextError} />
                    </div>
                    
                    <input type="submit" value="Register" className="btn btn-success" />
                </Form>
                        )
                    }
                }
            </Formik>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated, 
        user: state.auth.user, 
        errors: state.auth.errors
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);

