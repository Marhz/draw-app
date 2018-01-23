import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import socket from '../../utils/socket';
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
        socket.on('game_found', (game) => {
            console.log(game);
            this.props.history.push('/game/' + game.id);
        });
    }

    componentDidMount() {
        console.log(this.props);
    }

    handleNameInput = (e) => {
        this.setState({name: e.target.value});
    }

    handleRegister = (e) => {
        socket.emit('register', {name: this.state.name});
    }

    handleMatchmaking = () => {
        socket.emit('find_game', this.props.user);
    }

    isRegistered() {
        return this.props.user !== undefined && this.props.user.id !== null;
    }

    render() {
        return (
            <div className="home-screen">
                {this.isRegistered() || (
                    <div>
                        <label>Name :</label>
                        <input onChange={this.handleNameInput}/>
                        <button onClick={this.handleRegister}>{'Find a game'}</button>
                    </div>
                )}
                {this.isRegistered() && (
                    <div>
                        <h1>Hello {this.state.name}</h1>
                        <button onClick={this.handleMatchmaking}>{'Find a game'}</button>
                    </div>
                )}
            </div>
        )
    }
}

export default Home;
