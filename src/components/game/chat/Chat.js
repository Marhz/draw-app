import React, { Component } from 'react';
import socket from '../../../utils/socket';
import './Chat.css';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMessage: '',
            messages: []
        };
    }
    render() {
        const messages = this.state.messages.map((message, i) => {
            return <li key={i} className="message"><b className="message-username">{message.userName}: </b>{message.content}</li>
        })
        return (
            <div className="chat-container">
                <ul className="messages" ref="messages">
                    {messages}
                </ul>
                <div className="form">
                    <textarea cols="30" rows="10" value={this.state.currentMessage} onKeyPress={this.onKeyPress} onChange={this.onChange}></textarea>
                </div>
            </div>
        )
    }
    componentDidMount() {
        socket.on('message', message => {
            console.log(message)
            const messages = [...this.state.messages];
            if (messages.length >= 10) {
                messages.shift()
            }
            messages.push(message);
            this.setState({messages: messages}, this.scrollChat);
        });
        socket.on('current_chat', messages => {
            this.setState({messages: messages}, this.scrollChat);
        });
        socket.emit('get_current_chat', this.props.gameId);
    }

    componentWillUnmount() {
        socket.off('message');
        socket.off('current_chat');
    }

    scrollChat() {
        this.refs.messages.scrollTo(0, this.refs.messages.scrollHeight);
    }

    onChange = (e) => {
        this.setState({currentMessage: e.target.value});
    }

    onKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            this.submit();
        }
    }
    submit = () => {
        if(this.state.currentMessage.length === 0) return;
        socket.emit('new_message', {content: this.state.currentMessage, gameId: this.props.gameId, userId: this.props.user.id});
        this.setState({currentMessage: ''});
    }
}

export default Chat;
