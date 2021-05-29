import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap'

import Navigation from './components/Navigation/Navigation'
import Home from './components/Home/Home';
import About from './components/About/About';
import ComputersList from './components/Computers/ComputersList';
import ComputerDetails from './components/Computers/ComputerDetails';

import './App.css';

class App extends Component {
    render() {
        // console.log("Main App loaded. Rendering...")
        return (
            <Router>
                <Navigation />
                <Container className="main-container">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/computers" exact component={ComputersList} />
                        <Route path="/computers/:id" component={ComputerDetails} />
                        <Route path="/about" component={About} />
                    </Switch>

                    {
                    // <p>test</p>
                    /*<br/>
                    <Alert variant="success">This is a test alert</Alert> */}
                </Container>
            </Router>
        )
    }
}

export default App