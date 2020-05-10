import React, { Component } from 'react';
import {Link,Route,Switch} from 'react-router-dom'
import SimpleMap from './SimpleMap'
import About from './Upload'
import Category from './category/Index'
import Error404 from './Error404'
import Map from './Map';
import SearchBox from './SearchBox';
import axios from 'axios';
import GoogleLogin from 'react-google-login';

const responseGoogle = (response) =>{
    console.log(response);
}

export default class Header extends Component{
    render(){
        return (
                <div>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/upload">Upload</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/category">Category</Link>
                                </li>
                                <li className="nav-item">
                                    <GoogleLogin
                                    clientId={env(GOOGLE_CLIENT_ID)}
                                    buttonText="Login"
                                    onSuccess={respsoneGoogle}
                                    onFailure={responseGoogle}
                                    cookiePolicy={'single_host_origin'}
                                    />
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12'>
                            <Switch>
                                <Route exact path='/' component={SimpleMap}/>
                                <Route exact path='/upload' component={About}/>
                                <Route exact path='/category' component={Category}/>
                                <Route exact path='/category/add' component={Category}/>
                                <Route exact path='/category/edit/:id' component={Category}/>
                                <Route exact path='/map' component={Map}/>
                                <Route exact path='/search' component={SearchBox}/>
                                <Route exact path='/auth/google' component={GoogleLogin}/>
                                <Route exact path='' component={Error404}/>
                            </Switch>
                        </div>
                    </div>
                </div>
        );
    }
}