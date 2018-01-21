import React, { Component } from 'react';
import './ColorSelect.css';

class ColorSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: [
                "#FFFFFF",
                "#C0C0C0",
                "#808080",
                "#000000",
                "#FF0000",
                "#800000",
                "#FFFF00",
                "#808000",
                "#00FF00",
                "#008000",
                "#00FFFF",
                "#008080",
                "#0000FF",
                "#000080",
                "#FF00FF",
                "#800080"
            ]
        };
    }
    render() {
        const btns = this.state.colors.map(color => {
            return <button key={color} onClick={() => this.click(color)} style={ {background: color} }></button>
        })
        return (
            <div>
                {btns}
            </div>
        )
    }
    componentDidMount() {
    }
    click(color) {
        this.props.click(color);
    }
}

export default ColorSelect;
