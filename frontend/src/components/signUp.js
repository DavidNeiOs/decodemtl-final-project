import React, { Component } from 'react'
import { Segment, Button, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'

class SignUp extends Component {
  constructor () {
    super();
    this.handleNP = this.handleNP.bind(this)
    this.handleBuyer = this.handleBuyer.bind(this)
  }

  handleNP () {
    this.props.dispatch({
      type: 'orgSignUp',
      content: true
    })
  }

  handleBuyer() {
    this.props.dispatch({
      type: 'buyerSignUp',
      content: true
    })
  }
  render() {
    return (
      <Segment padded>
        <Button primary fluid onClick={this.handleBuyer}>
          User Sign Up
        </Button>
        <Divider horizontal>Or</Divider>
        <Button secondary fluid onClick={this.handleNP}>
          Non-Profit Sign Up
        </Button>
      </Segment>
    );
  }
 }

let connectedSignUp = connect()(SignUp)
export default connectedSignUp;