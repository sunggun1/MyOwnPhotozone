import React, { Component } from 'react';
import {Link, Route} from 'react-router-dom'
import Add from './Add'
import Listing from './Listing'
import Edit from './Edit'

export default class Index extends Component{
    render(){
        return (
            <div>
                <div>
                    <hr />
                        <Link to="/category" className="btn btn-primary">Listing</Link> &nbsp;
                        <Link to="/category/Add" className="btn btn-primary">add</Link>
                        <Route exact path='/category' component={Listing}/>
                        <Route exact path='/category/add' component={Add}/>
                        <Route exact path='/category/edit/:id' component={Edit}/>
                </div>
            </div>
        );
    }
}