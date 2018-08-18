import React, { Component } from 'react'
import Footer from './footer.js'
import BuyerNavBar from './buyerNavBar.js'

class BuyerHomePage extends Component {
    render(){
        return (
            <div>
                <div>
                    <BuyerNavBar />
                </div>
                <Footer />
            </div>
        )
    }
}

export default BuyerHomePage;