import React, { Component } from 'react'
import { Input, Menu, Button } from 'semantic-ui-react'
import SignUp from './signUp.js'
import { connect } from 'react-redux'

class NavBar extends Component {
  constructor() {
    super();
    this.state = { activeItem : 'home', signUpClick: false} 
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
  }

  handleItemClick = (e, { name }) => {
    return this.setState({ activeItem: name })
  }

  handleSignUpClick(evt) {
    this.setState({signUpClick:!this.state.signUpClick})
  }

  handleLogIn() {
    this.props.dispatch({
      type: 'logIn',
      content: true
    })
  }
  render() {
    const { activeItem } = this.state

    return (
        <div>
            <div>
        <Menu secondary position="fixed" >
        <Menu.Item>
          <img src='https://react.semantic-ui.com/logo.png' />
        </Menu.Item>
        <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
        </Menu.Menu>
            <Button primary
            active={activeItem === 'signup'}
            onClick={this.handleSignUpClick}
            position='right'>Sign Up</Button>
            <Button secondary
            active={activeItem === 'login'}
            onClick={this.handleLogIn}
            position='right'>Login</Button>
        </Menu>
      </div>
      {this.state.signUpClick ? (<div><SignUp/></div>) : (<div></div>)}
      </div>
    )
  }
}

let connectedNavBar = connect()(NavBar)

export default connectedNavBar;
