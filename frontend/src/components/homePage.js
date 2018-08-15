import React, { Component } from 'react';
import NavBar from './components/navBar.js'
import HeroSlider from './components/heroSlider.js'
import Footer from './components/footer.js'
import HomeItemDisp from './components/itemsHomeDisp.js'
import { Grid, Header } from 'semantic-ui-react'


class HomePage extends Component {
  render() {
    return (
      <div className="App">
        <div>
        <NavBar/>
        </div>
        <div>
        <HeroSlider/>
        </div>
        <div>
          <div>
          
          <br/>
          <Header as='h2' icon='stopwatch' content='Products Currently in Auction' />
          <br/>
          <br/>
          </div>
          <Grid relaxed columns={4}>
          <HomeItemDisp/>
          </Grid>
          <br/>
          <br/>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default HomePage;