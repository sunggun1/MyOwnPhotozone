import React, { Component } from 'react';
import axios from 'axios';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';

export default class Add extends Component{
    constructor(prop){
        super(prop);
        this.state={
            category_name:'',
            alert_message:''
        }
        this.onChangeCategoryName = this.onChangeCategoryName.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChangeCategoryName(event){
        this.setState({
            category_name: event.target.value
        });
    }

    onSubmit(event){
        event.preventDefault();
        const category={ 
            category_name : this.state.category_name
        }
        axios.post('http://127.0.0.1:80/api/category/store',category)
        .then(resposne => {
            this.setState({alert_message: "success"})
        }).catch(error=>{
            this.setState({alert_message:"error"})
        })
    }

    render(){
        return (
            <div>
                <hr />
                {this.state.alert_message == 'success'? <SuccessAlert message={"Category added successfully."}/>:null}                
                {this.state.alert_message == 'error'? <ErrorAlert message={"Error occured while adding the category"}/>:null}                

                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="category_name">Category Name</label>
                        <input type="text" 
                        className="form-control" 
                        id="category_name" 
                        aria-describedby="emailHelp" 
                        placeholder="Enter category"
                        value ={this.state.category_name}
                        onChange={this.onChangeCategoryName}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}