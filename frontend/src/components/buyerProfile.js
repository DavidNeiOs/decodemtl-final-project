import React, { Component } from 'react'
import { Form, Grid } from "semantic-ui-react";
import ConnectedBuyerNavBar from './buyerNavBar.js'
import Footer from './footer.js'
import { connect } from 'react-redux'

class BuyerProfile extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            wonItems: [],
            lostItems: [],
            transactions: []
        }
    }

    getUserPro() {
        fetch('/getUserProfile', {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'include',
            body: JSON.stringify({ username: this.props.byr.username, userId: this.props.byrId })
        })
            .then(response => response.text())
            .then(responseBody => {
                let body = JSON.parse(responseBody)
            })
    }

    // on change of any field (found at semantic ui Form documentation)
    componentDidMount() {

    }
    render() {
        return (
            <div>
                <ConnectedBuyerNavBar />
                <br />
                <br />
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
                    </Grid>
                </Form>
                
                <br />
                <br />
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        byr: state.currentBuyer,
        byrId: state.buyerId
    }
}

export default connect(mapStateToProps)(BuyerProfile);