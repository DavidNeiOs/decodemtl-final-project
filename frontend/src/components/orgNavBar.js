import React, { Component } from 'react'
import { Input, Menu, Button, Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'

const options = [
    { key: 1, text: 'Settings', value: 1 },
    { key: 2, text: 'Logout', value: 2 },
  ]

class OrgNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { org : '', signUpClick: false} 
  }
  getOrgs = () => {
    fetch('/getOrgs')
      .then(response => response.text())
      .then(responseBody => {
        let parsedBody = JSON.parse(responseBody);
        let orgLoggedIn = parsedBody.orgs.filter(org => org.orgId === this.props.orgId);
        this.props.dispatch({
            type: 'getorgs',
            content: orgLoggedIn.orgId
        })
        this.setState({ org: orgLoggedIn[0] });     
        console.log(this.state);
        console.log(orgLoggedIn);
        console.log(this.state.org.username)
      })        
    }
    handleListingClick = () => {

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
        orgId: state.orgId
    }
}
let ConnectedOrgNavBar = connect(mapStateToProps)(OrgNavBar)

export default ConnectedOrgNavBar;
