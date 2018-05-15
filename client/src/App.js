import React, { Component } from 'react';
import Homepage from './components/homepage';
import Login from './components/login'
class App extends Component {

  constructor() {
    super();
    this.state = {
      loggedin: false,
      apiKey: '',
      email:''
    }

    this.login = this.login.bind(this);
    this.setInfo = this.setInfo.bind(this);
  }

  login(logged) {
    this.setState({
      loggedin:logged
    })
  }

  setInfo(key, email) {
    this.setState({
      apiKey:key,
      email: email
    });
  }

  render() {

    let component = (this.state.loggedin)? 
                    <Homepage login={this.login} info={{email:this.state.email,api:this.state.apiKey}}/> : 
                    <Login login={this.login} setInfo={this.setInfo}/>;
    return (
      <div>
          {component}
      </div>
    );
  }
}

export default App; 
