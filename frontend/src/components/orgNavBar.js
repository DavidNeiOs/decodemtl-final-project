import React, { Component } from 'react'
import { Input, Menu, Button, Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'

const options = [
    { key: 1, text: 'Settings', value: 1 },
    { key: 2, text: 'Logout', value: 2 },
  ]

class OrgNavBar extends Component {
  constructor() {
    super();
    this.state = { org : '', signUpClick: false} 
    this.getOrgs = this.getOrgs.bind(this)
    this.handleListingClick = this.handleListingClick.bind(this)
  }
  getOrgs() {
    fetch('/getOrgs')
      .then(response => response.text())
      .then(responseBody => {
        let parsedBody = JSON.parse(responseBody);
        let orgLoggedIn = parsedBody.orgs.filter(org => org.orgId === this.props.orgId);
        this.props.dispatch({
            type: 'getorgs',
            content: orgLoggedIn.orgId
        })
        this.props.dispatch({
            type: 'setOrg',
            content: orgLoggedIn
        })
        let singleOrgLogged = orgLoggedIn[0]
        this.setState({ org: singleOrgLogged });     
      })        
    }
    handleListingClick(){
        this.props.dispatch({
            type: 'showCreateL',
            content: true
        })
    }
  componentDidMount() {
      this.getOrgs();
  }
  render() {
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
                <Button positive onClick={this.handleListingClick}>Create New Listing</Button>
            </Menu.Item>
            <Menu.Item>
                <Input icon='search' placeholder='Search...' />
            </Menu.Item>
        </Menu.Menu>
            <Dropdown item simple text={this.state.org.username} direction='right' options={options} />
        </Menu>
        </div>
      </div>
    )
    
  }
}

function mapStateToProps(state) {
    return {
        orgId: state.orgId,
        org: state.currentorg
    }
}
let ConnectedOrgNavBar = connect(mapStateToProps)(OrgNavBar)

export default ConnectedOrgNavBar;
