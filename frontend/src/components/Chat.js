import React, { Component } from 'react'
import socketIO from 'socket.io-client';
import { Input, Button } from 'semantic-ui-react'

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatName: '',
            message: '',
            messages: []
        }
        this.room = this.props.itemId;
        this.socket = socketIO("http://159.203.57.3:5000");

        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit('sendMessage', {
                username: this.props.org[0].username,
                message: this.state.message,
                room: this.room
            })
            this.setState({message: ''})
        }
        this.socket.on('receiveMessage', function(data){
            addMessage(data);
        })

        const addMessage = data => {
            console.log(data);
            this.setState({messages: [ ...this.state.messages, data]});
            console.log(this.state.messages);
        };
    }

    render () {
        return (
            <div className='container'>
                <div style={{textAlign: 'center'}}>
                    <h3>CHAT</h3>
                </div>
                <div className='chatBody'>
                    <div className='messages'>
                        {this.state.messages.map(msg => {
                            return (
                                <div> {msg.username} : {msg.message} </div>
                            )
                        })}
                    </div>
                    <div className='input' style={{position: 'fixed', bottom: '0px', right: '5%'}} >
                        <Input 
                            placeholder='message'
                            value={this.state.message}
                            onChange={ev => this.setState({message: ev.target.value})}
                        />
                        <Button
                            color='violet'
                            content='Send'
                            onClick={this.sendMessage}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat;