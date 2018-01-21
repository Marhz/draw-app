import React, { Component } from 'react';
import './Home.css';
import socket from '../../utils/socket';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
    }

    componentDidMount() {
    }

    handleNameInput = (e) => {
        this.setState({name: e.target.value});
    }

    handleClick = (e) => {
        socket.emit('register', {name: this.state.name});
    }

    render() {
        return (
            <div className="home-screen">
                <label htmlFor="name">Name :</label>
                <input onChange={this.handleNameInput} name="name"/>
                <button onClick={this.handleClick}>{'Find a game'}</button>
            </div>
        )
    }
}

export default Home;
