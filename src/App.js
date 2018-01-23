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
      user: {
        name: null,
        id: null
      }
    };
    socket.on('registration_infos', user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.setState({user: user});
    })
  }

  componentDidMount() {
    const user = localStorage.getItem('user');
    if (user !== null) {
      this.setState({ user: JSON.parse(user) });
    }
  }

  disconnect = () => {
    localStorage.removeItem('user');
    this.setState({user: {
      id: null,
      name: null
    }});
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Nav player={this.state.user} disconnect={this.disconnect}/>
          <Switch>
            <Route exact path="/" render={(props) => (
              <Home {...props} user={this.state.user} />
            )}/>
            <Route path="/game/:id" render={(props) => (
              <Game {...props} user={this.state.user} />
            )}/>
            <Route path="/game" component={Game} />
            <Route path="/hello" render={() => {
              return (
                <h1 className="display-3">Hello, world!</h1>
              );
            }} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
