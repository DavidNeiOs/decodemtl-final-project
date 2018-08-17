import React, { Component } from 'react'
import { Container, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'

class LogIn extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange (evt, {name, value}) {
        this.setState({ [name]: value})
    }

    handleSubmit() {
        const state = Object.assign({}, this.state);
        fetch('/logIn', 
            {
                method:'POST',
                mode:'same-origin',
                credentials:'include',
                body: JSON.stringify(state)
            })
            .then(response => response.text())
            .then(res => {
                let body = JSON.parse(res);
                console.log(body)
                if(body.status && body.userType === 'org') {
                    console.log(body.orgId)
                    this.props.dispatch({
                        // change the store variable that will 
                        // render personalized page of org
                        type: 'showOrgPage',
                        content: body.orgId
                    
                    })
                }
                else if (body.success && body.userType === 'buyer') {
                    /*this.props.dispatch({
                        // change the store variable that will
                        // render personalized page of buyer
                    })*/
                }
            })
            .catch(err => {
                console.log(err)
                alert('there was an error, try again')
            })
    }
    render() {
        return (
          <Container textAlign='center'>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group inline>
                <Form.Input
                    name='username'
                    label='Organization Name:' 
                    placeholder='Organization'
                    onChange={this.handleChange}
                    value={this.state.username}  
                />
              </Form.Group>
              <Form.Group inline>
                <Form.Input
                    width={5}
                    name='password'
                    label='Password:'
                    type='password'
                    placeholder='Password'
                    onChange={this.handleChange}
                    value={this.state.password}
                />
              </Form.Group>
              <Form.Button content='submit'/>
            </Form>
          </Container>
        );
    }
}

let connectedLogIn = connect()(LogIn)

export default connectedLogIn;