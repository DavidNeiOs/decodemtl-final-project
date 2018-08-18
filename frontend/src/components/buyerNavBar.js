import React, { Component } from 'react'
import { Input, Menu, Button, Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'


class BuyerNavBar extends Component {
  constructor() {
    super();
    this.state = { buyer : '', signUpClick: false} 
    this.getOrgs = this.getOrgs.bind(this);
    this.handleListingClick = this.handleListingClick.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }
  getOrgs() {
    fetch('/getBuyers')
      .then(response => response.text())
      .then(responseBody => {
        let parsedBody = JSON.parse(responseBody);
        let buyerLoggedIn = parsedBody.buyers.filter(byr => byr.userId === this.props.buyerId);

        this.props.dispatch({
            type: 'setBuyer',
            content: buyerLoggedIn
        })
        let singleOrgLogged = buyerLoggedIn[0]
        this.setState({ buyer: singleOrgLogged });     
      })        
    }

    handleLogOut() {
        fetch('/logout', {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'include',
            body: JSON.stringify({username: this.props.buyer[0].username})
        })
        .then(response => response.text())
        .then(responseBody => {
            let body = JSON.parse(responseBody)
            console.log(body)
            this.props.dispatch({
                type: 'homepage',
                content: true
            })
        })

    }
  componentDidMount() {
      this.getOrgs();
  }
  render() {
    const options = [
        { key: 1, text: 'Settings', value: 1 },
        { key: 2, text: 'Logout', value: 2, onClick: this.handleLogOut},
    ]
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
            <Dropdown item simple text={this.state.buyer.username} direction='right' options={options} />
        </Menu>
        </div>
      </div>
    )
    
  }
}

function mapStateToProps(state) {
    return {
        buyerId: state.buyerId,
        buyer: state.currentBuyer
    }
}
let ConnectedBuyerNavBar = connect(mapStateToProps)(BuyerNavBar)

export default ConnectedBuyerNavBar;
