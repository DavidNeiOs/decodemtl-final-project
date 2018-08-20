import React, { Component } from 'react'
import { Input, Menu, Button, Modal } from 'semantic-ui-react'
import ConnectedSignUp from './signUp.js'
import ConnectedLogIn from './LogIn.js'
import { connect } from 'react-redux'

class NavBar extends Component {
  constructor() {
    super();
    this.state = { activeItem : 'home', signUpClick: false, open: false, open2:false } 
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
  }
  show = size => () => this.setState({ size, open: true })
  show2 = size => () => this.setState({ size, open2: true })
  close = () => this.setState({ open: false })
    
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
    const { open, open2, size } = this.state
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
            
            <Modal trigger={<Button secondary
            active={activeItem === 'login'}
            onClick={this.show('mini')}
            position='right'>Login</Button>} size={size} open={open} onClose={this.close}>
              <Modal.Content>
                <ConnectedLogIn onSubmit={this.close}/>
              </Modal.Content>
            </Modal>

            <Modal trigger={<Button primary
            active={activeItem === 'signup'}
            onClick={this.show2('mini')}
            position='right'>Sign Up</Button>} size={size} open2={open} onClose={this.close}>
              <Modal.Content>
                <ConnectedSignUp/>
              </Modal.Content>
            </Modal>
            
        </Menu>
      </div>
      {this.state.signUpClick ? (<div><ConnectedSignUp/></div>) : (<div></div>)}
      </div>
    )
  }
}

let connectedNavBar = connect()(NavBar)

export default connectedNavBar;
