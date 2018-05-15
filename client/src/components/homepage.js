import React, { Component } from 'react'
import axios from 'axios';
import {Col, Row, Input, Icon, Button, Navbar, NavItem} from 'react-materialize'

class Homepage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            number : 0,
            resetInput: ''
        }

        this.handleResetInput = this.handleResetInput.bind(this);
    }

    componentDidMount() {
        axios.post('/api/getNumber', {token:this.props.info.api})
            .then(response=>{
                
                let number = response.data.number;
                this.setState({
                    number
                });
            });
    }

    handleResetInput(event) {
        this.setState({resetInput: event.target.value})
    }

    logout() {

        axios.post('/logout',{})
            .then(response=>{
                if(response.data.success){
                    this.props.login(false);
                }
            });
    }

    //get new number
    getNumber(){

        axios.post('/api/getNumberWithIncrement', {token:this.props.info.api})
            .then(response=>{
                
                let number = response.data.number;
                this.setState({
                    number
                });
            })
    }

    //reset number
    resetNumber() {

        let value = parseInt(this.state.resetInput);
        
        value = value < 0? 0:value;
        
        if(value === '') return;
        axios.post('/api/setValue', {token:this.props.info.api, value})
            .then(response => {
                let number = response.data.number;
                this.setState({
                    number
                });
            })
    }

    render() {

        const banner = 'Logged in as '+this.props.info.email;
        return (
            <Row>
                <Col m={6} offset={'m3'}>
                    <Navbar brand={banner} right>
                        <NavItem href='javascript:void(0)' onClick={()=>this.logout()}>Logout</NavItem>
                    </Navbar>
                    <h1>Current Number is {this.state.number}</h1>
                    
                    <Col s={6}>
                        <Button waves='light' large={true} 
                            onClick={()=> this.getNumber()}>
                                Gimme Next
                        </Button>
                    </Col>
                    <Col s={6}>
                        <Button waves='light' large={true} 
                            onClick={()=> this.resetNumber()}>
                                Reset
                        </Button>
                        <Input label="Reset to value" value={this.state.resetInput} 
                            onChange={this.handleResetInput} />
                        
                    </Col>
                    
                </Col>
            </Row>
            
        )
        
    }
}

export default Homepage;