import React, { Component } from 'react';
import SizeSelect from './sizeSelect/SizeSelect';
import ColorSelect from './colorSelect/ColorSelect';
import './Controls.css';

class Controls extends Component {
    render() {
        return (
            <div className="controls-container">
                <div className="icon">
                    <i className="fa fa-cog"></i>
                </div>
                <SizeSelect click={(size) => this.props.changeSize(size)}></SizeSelect>
                <ColorSelect click={(color) => this.props.changeColor(color)}></ColorSelect>
            </div>
        )
    }
}

export default Controls;
