import React, { Component } from 'react'
import socketIO from 'socket.io-client';
import { Segment, Divider } from 'semantic-ui-react'

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
            this.props.onBidUpdate(data.bid)
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
            <div>
                <br/>
                <br/>
            <Segment.Group raised>
            <br/>
                <div style={{textAlign: 'center'}}>
                    <h3>Bids Log</h3>
                </div>
                <Divider/>
                <div>
                    <Segment vertical>
                        {this.state.bids
                        .sort(function (a, b) {
                            return b.bid - a.bid;
                          })
                        .map(log => {
                            return (
                                <div> <i>{new Date(log.date).toDateString()}</i> :      <b>{log.username}</b> just bidded for <b>{log.bid} $</b>  </div>
                            )
                        })}
                    </Segment>
                </div>
                </Segment.Group >
                <br/>
                <br/>
                </div>
        )
    }
}

export default BidLog;