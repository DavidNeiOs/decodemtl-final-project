import React, { Component } from 'react'
import { Form, Container } from "semantic-ui-react";

class UserSignUp extends Component {
    constructor () {
        super();
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            country: '',
            postalCode: '',
            userType: 'buyer'
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    // on change of any field (found at semantic ui Form documentation)
    handleChange (evt, {name, value}) {
        this.setState({ [name]: value })
    }

    handleSubmit () {
      if (this.state.password !== this.state.confirmPassword) {
          this.setState({password: '', confirmPassword: ''});
          alert(`passwords do not match`);
          return;
      }
      const state = Object.assign({}, this.state);
      delete state['confirmPassword'];
      fetch('/signUp', {
        method: 'POST',
        body: JSON.stringify(state)
      })
        .then(response => response.text())
        .then(responseBody => {
          let result = JSON.parse(responseBody)
          console.log(result);
        })
        .catch(err => {
          console.log(err)
          alert('there was an error, try again')
        })
        
      // set The state back to empty
      /*this.setState({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          country: '',
          postalCode: '',
      })*/
    }

    render() {
        return (
        <Container textAlign='center'>
          <Form onSubmit={this.handleSubmit} size='large'> 
            <Form.Group inline>
              <Form.Input
                name='username'
                label='Username:'
                placeholder='username'
                onChange={this.handleChange}
                value={this.state.username}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                name='email'
                label='Contact Email:'
                placeholder='Email'
                onChange={this.handleChange}
                value={this.state.email}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                type='password'
                name='password'
                label='Password:'
                placeholder='password'
                onChange={this.handleChange}
                value={this.state.password}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                type='password'
                name='confirmPassword'
                label='Confirm Password:'
                placeholder='Confirm password'
                onChange={this.handleChange}
                value={this.state.confirmPassword}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                name='firstName'
                label='First name:'
                placeholder='first name'
                onChange={this.handleChange}
                value={this.state.fisrstName}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                name='lastName'
                label='Last name:'
                placeholder='last name'
                onChange={this.handleChange}
                value={this.state.lastName}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                name='country'
                label='Country:'
                placeholder='Country'
                onChange={this.handleChange}
                value={this.state.country}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                name='postalCode'
                label='Postal Code:'
                placeholder='Postal Code'
                onChange={this.handleChange}
                value={this.state.postalCode}
              />
            </Form.Group>
            <Form.Button content='submit' />
          </Form>
        </Container>
        );
    }
}

export default UserSignUp;