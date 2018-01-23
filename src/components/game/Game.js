import React, { Component } from 'react';
import './Game.css';
import Canvas from './canvas/Canvas';
import Chat from './chat/Chat';
import Controls from './controls/Controls';
import socket from '../../utils/socket';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineWidth: 16,
            color: "#000000",
            playersList: []
        };
    }

    changeSize = (size) => {
        this.setState({ lineWidth: size });
    }
    
    changeColor = (color) => {
        console.log(color);
        this.setState({ color: color });
    }
    componentDidMount() {
        socket.on('game_info', (infos) => {
            console.log(infos);
            this.setState({playersList: infos.players});
        })
    }
    render() {
        const playersList = this.state.playersList.map(player => {
            console.log(player)
            return <li key={player.id}>{player.name}</li>
        });
        return (
            <div className="game">
                <div className="canvas-controls">
                    <Controls changeColor={this.changeColor} changeSize={this.changeSize}></Controls>
                </div>
                <Canvas gameId={this.props.match.params.id} lineWidth={this.state.lineWidth} color={this.state.color}></Canvas>                
                <div className="chat">
                    <ul>
                        {playersList}
                    </ul>
                    <Chat gameId={this.props.match.params.id} user={this.props.user} />
                </div>
            </div>
        );
    }
}

export default Game;
