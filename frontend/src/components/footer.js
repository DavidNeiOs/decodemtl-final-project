import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css';

class Footer extends Component {
    render() {
        return (
            <div className="ui inverted black vertical footer segment">
                <div className="ui center aligned container">
                    <h4 className="ui inverted header">&copy; Copyright 2017 | All rights reserved | GangGang</h4>
                    <a href="https://www.facebook.com/"><i class="facebook square icon big"></i></a>
                    <a href="https://twitter.com/"><i class="twitter square icon big"></i></a>
                    <a href="https://www.linkedin.com/company/c"><i class="linkedin square icon big"></i></a>
                </div>
            </div>
        )
    }
}
    
export default Footer;