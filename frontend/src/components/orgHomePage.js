import React, { Component } from 'react';
import ConnectedOrgNavBar from './orgNavBar.js'
import Footer from './footer.js'
import OrgHomeItemDisp from './orgHomeDisp.js'


class OrgHomePage extends Component {
  render() {
    return (
      <div className="App">
        <div>
        <ConnectedOrgNavBar/>
        </div>
        <div>
       
          <OrgHomeItemDisp />
          <br/>
          <br/>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default OrgHomePage;