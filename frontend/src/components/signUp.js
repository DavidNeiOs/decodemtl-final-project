import React, { Component } from 'react'
import { Segment, Button, Divider, Modal } from 'semantic-ui-react'
import { connect } from 'react-redux'
import OrgSignUp from './OrgSignUp.js'

class SignUp extends Component {
  constructor () {
    super();
    this.handleNP = this.handleNP.bind(this)
  }

  handleNP () {
    this.props.dispatch({
      type: 'orgSignUp',
      content: true
    })
  }
  render() {
    return (
      <Segment padded>
        <Button primary fluid>
          User Sign Up
        </Button>
        <Divider horizontal>Or</Divider>
        <Modal trigger=
          {<Button secondary fluid onClick={this.handleNP}>Non-Profit Sign Up
          </Button>}>
            <Modal.Content>
              <Modal.Header>Non-Profit Sign-Up</Modal.Header>
                <Modal.Description>
                    <OrgSignUp/>
                </Modal.Description>
            </Modal.Content>
          </Modal>
      </Segment>
    );
  }
 }

let connectedSignUp = connect()(SignUp)
export default connectedSignUp;