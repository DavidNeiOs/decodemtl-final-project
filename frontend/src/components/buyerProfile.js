import React, { Component } from 'react'
import { Form, Grid } from "semantic-ui-react";
import ConnectedBuyerNavBar from './buyerNavBar.js'
import Footer from './footer.js'
import { connect } from 'react-redux'

class BuyerProfile extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            email: '',
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
      this.props.onSubmit()
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
    componentDidMount() {

    }
    render() {
        return (
          <div>
            <ConnectedBuyerNavBar />
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <Form centered onSubmit={this.handleSubmit} size='large'> 
              <Grid>
                <Grid.Row centered columns={1}>
                
                <Grid.Column>
                <Form.Group widths='equal'>
                  <Form.Input
                    name='username'
                    label='Username:'
                    placeholder='username'
                    onChange={this.handleChange}
                    value={this.props.byr.username}
                  />

                  <Form.Input 
                    name='email'
                    label='Contact Email:'
                    placeholder='Email'
                    onChange={this.handleChange}
                    value={this.props.byr.email}
                  />
                </Form.Group>
                </Grid.Column>
                </Grid.Row>
                <Grid.Row centered columns={1}>
                <Grid.Column>
                <Form.Group widths='equal'>
                  <Form.Input 
                    name='firstName'
                    label='First name:'
                    placeholder='first name'
                    onChange={this.handleChange}
                    value={this.props.byr.firstName}
                  />

                  <Form.Input
                    name='lastName'
                    label='Last name:'
                    placeholder='last name'
                    onChange={this.handleChange}
                    value={this.props.byr.lastName}
                  />
                </Form.Group>
                </Grid.Column>
                </Grid.Row>
                <Grid.Row centered columns={1}>
                
                <Grid.Column>
                <Form.Group widths='equal'>
                  <Form.Input 
                    name='country'
                    label='Country:'
                    placeholder='Country'
                    onChange={this.handleChange}
                    value={this.props.byr.country}
                  />

                  <Form.Input
                    name='postalCode'
                    label='Postal Code:'
                    placeholder='Postal Code'
                    onChange={this.handleChange}
                    value={this.props.byr.postalCode}
                  />
                </Form.Group>
                </Grid.Column>
                </Grid.Row>
                </Grid>
              </Form>
            <br />
            <br />
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            
            <Footer />
          </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        byr: state.currentBuyer
    }
}

export default connect(mapStateToProps)(BuyerProfile);