import React, { Component } from 'react'
import socketIO from 'socket.io-client';
import { Input, Button } from 'semantic-ui-react'

class BidLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatName: '',
            currUserBid: '',
            bids: []
        }
        this.room = 'bid_'+this.props.itemId;
        this.socket = socketIO("http://159.203.57.3:5000");

        this.socket.on('receiveLastPrice', function(data){
            addBid(data);
        })

        const addBid = data => {
            console.log(data);
            this.setState({bids: data});
        };
    }
    componentDidMount() {
        this.socket.emit('sendLastPrice', {
            itemId: this.props.itemId,
            room: 'bid_'+this.props.itemId,
            username: this.props.userBid
        })
    }
    render () {
        return (
            <div className='container'>
            <br/><br/>
                <div style={{textAlign: 'center'}}>
                    <h3>Bids Log</h3>
                </div>
                <div>
                    <div>
                        {this.state.bids.map(log => {
                            return (
                                <div> {log.username} just bidded for {log.bid} $ </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default BidLog;