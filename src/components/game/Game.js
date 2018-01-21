import React, { Component } from 'react';
import './Game.css';
import Canvas from './canvas/Canvas';
import Chat from './chat/Chat';
import SizeSelect from './sizeSelect/SizeSelect'
import ColorSelect from './colorSelect/ColorSelect'

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineWidth: 30,
            color: "#000000"
        };
    }

    changeSize = (size) => {
        this.setState({ lineWidth: size });
    }
    changeColor = (color) => {
        this.setState({ color: color });
    }

    render() {
        return (
            <div className="App">
                <Canvas lineWidth={this.state.lineWidth} color={this.state.color}></Canvas>
                <div className="canvas-controls">
                    <div>
                        <SizeSelect click={this.changeSize} />
                        <ColorSelect click={this.changeColor} />
                    </div>
                </div>
                <Chat />
            </div>
        );
    }
}

export default Game;
