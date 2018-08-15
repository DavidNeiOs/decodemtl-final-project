import React, { Component } from 'react'
import { Form } from "semantic-ui-react";

class OrgSignUp extends Component {
    constructor () {
        super();
        this.state = {
            orgName: '',
            website: '',
            logo: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            country: '',
            postalCode: '',
            description: '',
            userType: 'org'
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    // on change of any field (found at semantic ui Form documentation)
    handleChange (evt, {name, value}) {
        if( name === 'logo') {
          this.setState({ logo: evt.target.files[0].name});
          return;
        }
        this.setState({ [name]: value })
    }

    handleSubmit () {
      if (this.state.password !== this.state.confirmPassword) {
          this.setState({password: '', confirmPassword: ''});
          alert(`passwords do not match`);
          return;
      }
      const state = Object.assign({}, this.state);
      
      fetch('/signUp', {
        method: 'POST',
        body: JSON.stringify(state)
      })
        .then(response => response.text())
        .then(responseBody => {
          let result = JSON.parse(responseBody)
          console.log(result.status)
        })
        .catch(err => {
          console.log(err)
          alert('there was an error, try again')
        })
        
      // set The state back to empty
      this.setState({
          orgName: '',
          website: '',
          logo: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          country: '',
          postalCode: '',
          description: ''
      })
    }

    render() {
        return (
          <Form onSubmit={this.handleSubmit} size='large'>
            <Form.Group>
              <Form.Input
                name='orgName'
                label='Organization Name:' 
                placeholder='Organization'
                onChange={this.handleChange}
                value={this.state.orgName}  
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                name='website'
                label='Website:'
                placeholder='Url'
                onChange={this.handleChange}
                value={this.state.website}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                type='file'
                name='logo'
                label='Upload logo:'
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                name='email'
                label='Contact Email:'
                placeholder='Email'
                onChange={this.handleChange}
                value={this.state.email}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                name='username'
                label='Username:'
                placeholder='username'
                onChange={this.handleChange}
                value={this.state.username}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                type='password'
                name='password'
                label='Password:'
                placeholder='password'
                onChange={this.handleChange}
                value={this.state.password}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                type='password'
                name='confirmPassword'
                label='Confirm Password:'
                placeholder='Confirm password'
                onChange={this.handleChange}
                value={this.state.confirmPassword}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                name='country'
                label='Country:'
                placeholder='Country'
                onChange={this.handleChange}
                value={this.state.country}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                name='postalCode'
                label='Postal Code:'
                placeholder='Postal Code'
                onChange={this.handleChange}
                value={this.state.postalCode}
              />
            </Form.Group>
            <Form.Group>
              <Form.TextArea
                name='description'
                label='Description:'
                placeholder='Decription...'
                onChange={this.handleChange}
                value={this.state.description}
              />
            </Form.Group>
            <Form.Button content='submit' />
          </Form>
        );
    }
}

export default OrgSignUp;