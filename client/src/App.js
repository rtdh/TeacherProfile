import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import './App.css';
import AppNavbar from './components/AppNavbar'

import AddTeacher from './components/AddTeacher'
import EditTeacher from './components/EditTeacher'
import TeachersReport from './components/TeachersReport'
import Register from './components/auth/Register'
import Dashboard from './components/Dashboard'
import Login from './components/auth/Login'
import { Provider } from 'react-redux'
import store from './components/store'

//Check for token
if(localStorage.jwtToken){
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken)
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken)
  //Set user and isAuthenticated
  store.dispatch({type: 'SET_CURRENT_USER', payload: decoded})
}


function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="App">
        <AppNavbar />
        {/* <Route exact path='/addteacher' component={AddTeacherdup} /> */}
        {/* <Route exact path='/addteacher' component={AddTeacherFormik} /> */}
        <Route exact path='/addteacher' component={AddTeacher} />
        <Route exact path='/teacherslist' component={TeachersReport} />
        <Route exact path='/edit/:id' component={EditTeacher} />
        <Route exact path='/dashboard' component={Dashboard} />
        <div className="container">
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </div>
      </div>
    </Router> 
    </Provider> 
  );
}

export default App;
