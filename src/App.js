import React from 'react';
import './App.css';
import MainPage from "./MainPage";
import Home from "./Home";
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/playground" component={MainPage} />
          <Redirect to='/' />
        </Switch>
    </Router>
  );
}

export default App;
