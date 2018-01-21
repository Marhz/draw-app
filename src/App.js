import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Game from './components/game/Game';
import Home from './components/home/Home';
import Nav from './components/nav/Nav';
import socket from './utils/socket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      id: null
    };
    socket.on('registration_infos', infos => {
      console.log(infos);
      this.setState({name: infos.name, id: infos.id});
    })
  }
  render() {
    return (
      <Router>
        <div className="App">
          <Nav player={this.state.name} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/game" component={Game} />
            <Route path="/hello" render={() => {
              return (
                <div className="jumbotron">
                  <h1 className="display-3">Hello, world!</h1>
                </div>
              );
            }} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
