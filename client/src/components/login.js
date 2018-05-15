import React, { Component } from 'react'
import axios from 'axios';
import {Col, Row, Input, Icon, Button, Navbar, NavItem} from 'react-materialize'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            view: 'login',
            email: '',
            password: '',
            password2: '',
            status:''
        }

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handlePassword2 = this.handlePassword2.bind(this);
    }

    componentDidMount() {
        axios.post('/loggedin')
            .then(response=>{
                let data = response.data;

                if(data.success){
                    console.log(data);
                    this.props.setInfo(data.data.token, data.data.email);
                    this.props.login(data.success)
                }
            });
    }

    handleEmail(event) {
        this.setState({email: event.target.value})
    }

    handlePassword(event) {
        this.setState({password: event.target.value})
    }

    handlePassword2(event) {
        this.setState({password2: event.target.value})
    }

    login() {
        axios.post('/login', {email:this.state.email, password:this.state.password})
            .then(response=>{
                
                let data = response.data;
                if(data.success) {
                    this.props.setInfo(data.info.token, data.info.email);
                    this.props.login(data.success);
                } else {
                    //show error message
                    this.setState({
                        status:data.info
                    })
                }
            });
    }

    signup() {

        if(this.state.email === '') {
            this.setState({
                status: "email should not be empty"
            })
            return;
        }
        
        if(this.state.password !== this.state.password2) {
            this.setState({
                status: "passwords do not match"
            })
            return;
        }
        
        if(this.state.password === '') {
            this.setState({
                status: "password should not be empty"
            });
            return
        }

        axios.post('/addUser', {email: this.state.email, password:this.state.password})
            .then(response=> {

                let data = response.data;
                if(data.success) {
                    this.props.setInfo(data.info.token, data.info.email);
                    this.props.login(data.success);
                } else {
                    //show error message
                    this.setState({
                        status:data.info
                    })
                }
            });
    }

    submit() {
        if(this.state.view === 'login') {
            this.login();
        } else if(this.state.view === 'signup') {
            this.signup();
        }
    }

    changeMode(mode) {
        console.log('change mode')
        this.setState({
            view: mode
        });
    }

    render() {

        const view = this.state.view === 'signup'? 'Sign Up' : 'Login';

        const password2 = this.state.view === 'signup'? (
            <Input s={12} type="password" label="Verify Password" value={this.state.password2} 
                onChange={this.handlePassword2}>
                <Icon>vpn_key</Icon>
            </Input>
        ) : ( 
            <div></div>
        );

        return (
            <Row>
                <Col m={6} offset={'m3'} >
                    <Navbar brand='Number Generator' left>
                        <NavItem href='javascript:void(0)' onClick={()=>this.changeMode('login')}>Login</NavItem>
                        <NavItem href='javascript:void(0)' onClick={()=>this.changeMode('signup')}>Signup</NavItem>
                    </Navbar>
                    <h1>{view}</h1>
                    <div>{this.state.status}</div>
                    <Input s={12} label="Email" value={this.state.email} 
                        onChange={this.handleEmail}>
                        <Icon>email</Icon>
                    </Input>
                    <Input s={12} type="password" label="Password" value={this.state.password} 
                        onChange={this.handlePassword}>
                        <Icon>vpn_key</Icon>
                    </Input>
                    {password2}
                    <Button waves='light' onClick={() => this.submit()}>
                        Submit<Icon left>thumb_up</Icon>
                    </Button>
                </Col>
                
            </Row>
            
        )
        
    }
}

export default Login; 