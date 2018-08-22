import React, { Component } from 'react';
import ConnectedOrgNavBar from './orgNavBar.js'
import Footer from './footer.js'
import OrgHomeItemDisp from './orgHomeDisp.js'
import BuyerHomeDisplay from './buyerHomDisplay.js'
import { Header ,Divider} from 'semantic-ui-react'


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
        <div>
          <Divider/>
          <br/>
        <Header as='h2' icon='globe' content='Shop All Products' />
          <br/>
          <Divider/>
          <br />
          <BuyerHomeDisplay/>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default OrgHomePage;