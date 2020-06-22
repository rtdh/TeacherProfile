import React, { Component } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import * as Yup from 'yup'
import TextError from '../../components/TextError'
import { connect } from 'react-redux'
import axios from 'axios'
//import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const validationSchema = Yup.object().shape({
    cfmsid : Yup.string().required('cfmsid can not be blank'),
    password : Yup.string().required('Password can not be blank')
})

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cfmsid: '', password: ''
        }
        
    }

    componentDidMount(){
        if(this.props.isAuthenticated){
          this.props.history.push('/dashboard')
        }
      }
  
       
    render() {
        const { errors } = this.props
        const { loginUser } = this.props
        return (

            <Formik
            initialValues = {this.state}
            validationSchema = {validationSchema}
            onSubmit = {(values, {setSubmitting, resetForm})=>{

                setTimeout(()=>{

                    const loginUser = {
                        cfmsid: this.state.cfmsid,
                        password: this.state.password
                        
                    }
                    axios
                        .post('http://localhost:5000/login', loginUser)
                        .then(response=>{
                            // save to localstorage
                            const { token } = response.data
                            // set token to ls
                            localStorage.setItem('jwtToken', token)
                            // set token to auth header
                            setAuthToken(token)
                            // Decode token to get user data
                            const decoded = jwt_decode(token)
                            //Set current user
                            this.props.dispatch({
                                type: 'SET_CURRENT_USER',
                                payload: decoded
                            })
                            this.props.history.push('/dashboard')
                        })
                        .catch(error=> {
                            // this.setState({errors: error.response.data})
                            this.props.dispatch({
                                type: 'GET_ERRORS',
                                payload: error.response.data
                            })
                            console.log(error.response.data)
                            this.props.history.push('/login')
                        })
                        // this.setState({cfmsid: ''})
                        // this.setState({password: ''})   
                }, 500)
            }}
            enableReinitialize
            
            >
                {
                    formik =>{
                        const {values, handleBlur} = formik
                    return (
                    <Form>
                        <p className="text-center">Login Form</p>
                        {/* {errors ? errors : null} */}
                        {errors.email ? errors.email : null}
                        {errors.password ? errors.password : null}
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
                        <input type="password" placeholder="Password" name="password"
                            className="form-control"
                            value={values.password}
                            onChange={(e)=>this.setState({password : e.target.value})}
                            onBlur={handleBlur}
                        />
                    <ErrorMessage name="password" component={TextError} />
                    </div>
                                       
                    <input type="submit" value="Login" className="btn btn-success" />
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
        loginUser: state.auth.loginUser, 
        errors: state.auth.errors
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

