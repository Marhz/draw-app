import React, { Component } from 'react';


class SizeSelect extends Component {
    constructor(props) {
        super(props);
        let sizes = [2, 8, 16, 30];
        if (window.innerWidth < 500) {
            sizes = sizes.map(s => s / 2);
        }
        this.state = { sizes };
    }
    render() {
        const btns = this.state.sizes.map(size => {
            return <button key={size} onClick={() => this.click(size)}>{size}</button>
        })
        return (
            <div>
                {btns}
            </div>
        )
    }
    componentDidMount() {
    }
    click(size) {
        console.log(size);
        this.props.click(size);
    }
}

export default SizeSelect;
