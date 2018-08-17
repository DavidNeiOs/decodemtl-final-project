import React, { Component } from 'react';
import OrgSignUp from './OrgSignUp.js'
import { connect } from 'react-redux'
import HomePage from './homePage.js'
import LogIn from './LogIn.js'
import OrgHomePage from './orgHomePage.js'
import CreateListing from './CreateListing.js'
import UserSignUp from './UserSignUp.js'


class MainContainner extends Component {
  render() {
    return (
        <div>
            {this.props.shHomepage ? (<HomePage />) : (<div></div>)}
            {this.props.shOrgSignUp ? (<OrgSignUp />) : (<div></div>)}
            {this.props.shBuyerSignUp ? (<UserSignUp />) : (<div></div>)}
            {this.props.shLogIn ? (<LogIn />) : (<div></div>)}
            {this.props.shOrgPage ? (<OrgHomePage />) : (<div></div>)}
            {this.props.shCreateL ? (<CreateListing />) : (<div></div>)}
        </div>
    );
  }
}
let mapStatetoProps = function (state) {
  return {
    shOrgSignUp: state.showOrgSignUp,
    shHomepage: state.showHomepage,
    shBuyerSignUp: state.showBuyerSignUp,
    shLogIn: state.showLogIn,
    shCreateL: state.showCreateListing,
    shOrgPage: state.showOrgPage,
  }
}

let connectedMainContainner = connect(mapStatetoProps)(MainContainner)

export default connectedMainContainner;