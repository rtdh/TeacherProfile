import React, { Component, Fragment } from 'react'

import  { Navbar, Nav, NavDropdown }  from 'react-bootstrap'
//import TextError from '../components/TextError'
import { connect } from 'react-redux'
import setAuthToken from '../utils/setAuthToken';

class AppNavbar extends Component {

    constructor(props){
        super(props)
        this.myRef = React.createRef()
    }

    onClick = ()=>{
        // remove token from ls
        localStorage.removeItem('jwtToken')
        //remove auth header for future requests
        setAuthToken(false)
        //set current user to {} and isAuthenticated to false
        this.props.dispatch({
        type: 'LOGOUT_USER',
        payload: {}
        })
        this.props.history.push('/')
    }

    render() {

        const { isAuthenticated, loginUser } = this.props

        return (
            <Navbar variant="dark" expand="lg" style={{padding: '0.3% 10%'}}>
                <Navbar.Brand href="/">Teachers Profile</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" ref={this.myRef}>
                    <Nav className="mr-auto">
                        {isAuthenticated ? (
                        <NavDropdown title="Services" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/addteacher">Add New</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/teacherslist">Teachers List</NavDropdown.Item>
                            <NavDropdown.Item href="/teachersreport">Report</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/fileupload">File Upload</NavDropdown.Item>
                        </NavDropdown>) : (
                        <Fragment>
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/about">About</Nav.Link>
                            <Nav.Link href="/contact">Contact</Nav.Link>
                        </Fragment>)}
                    </Nav>
                    <Nav className="ml-auto">
                        {isAuthenticated ? (
                    <Fragment>
                            <Nav.Link>Logged in As : {loginUser.name}</Nav.Link>
                            <Nav.Link href="/" onClick={this.onClick}>Logout</Nav.Link>
                    </Fragment>) : (
                    <Fragment>
                        <Nav.Link href="/login" className="btn btn-success" style={{padding: '1px 15px', marginTop: '6px'}}>Login</Nav.Link>
                        <Nav.Link href="/register">Register</Nav.Link>
                    </Fragment>)}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
           
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

export default connect(mapStateToProps, mapDispatchToProps)(AppNavbar);

