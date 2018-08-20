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

        this.sendBid = () => {
            this.socket.emit('sendLastPrice', {
                itemId: this.props.itemId,
                room: this.room
            })
            this.setState({message: ''})
        }
        this.socket.on('receiveLastPrice', function(data){
            addBid(data);
        })

        const addBid = data => {
            console.log(data);
            this.setState({bids: [ ...this.state.bids, data.LastPrice]});
            console.log(this.state.bids);
        };
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
                                <div> A ChariBid User just bidded for {log} $ </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default BidLog;