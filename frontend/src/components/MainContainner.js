import React, { Component } from 'react';
import OrgSignUp from './OrgSignUp.js'
import { connect } from 'react-redux'



class MainContainner extends Component {
  render() {
    return (
        <div>
            {this.props.shHomepage ? (<div></div>) : (<div></div>)}
            {this.props.shOrgSignUp ? (<OrgSignUp />) : (<div></div>)}
        </div>
    );
  }
}
let mapStatetoProps = function (state) {
  return {
    shOrgSignUp: state.showOrgSignUp,
    shHomepage: state.showHomepage,
  }
}

let connectedMainContainner = connect(mapStatetoProps)(MainContainner)

export default connectedMainContainner;