import React, { Component } from 'react';
import {
    Link,
} from 'react-router-dom';
import './Nav.css';

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: false,
        };
    }

    getName() {
        return this.props.player === null ? 'Guest' : this.props.player;
    }

    render() {
        return (
            <nav className="nav">
                <h1>name</h1>
                <ul className="links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/hello">Hello</Link></li>
                    <li><Link to="/game">Game</Link></li>
                </ul>
                <div className="player">
                    {this.getName()}
                </div>
            </nav>
        )
    }
}

export default Nav;
