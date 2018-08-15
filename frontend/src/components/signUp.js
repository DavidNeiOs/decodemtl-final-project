import React, {Component} from 'react'
import { Segment, Button, Divider } from 'semantic-ui-react'

const SignUp = () => (
    <Segment padded>
      <Button primary fluid>
        User Sign Up
      </Button>
      <Divider horizontal>Or</Divider>
      <Button secondary fluid>
        Non-Profit Sign Up
      </Button>
    </Segment>
 )

export default SignUp;