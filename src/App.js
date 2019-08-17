import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Event from "./pages/Event";
import AllEvents from "./pages/AllEvents";
import People from "./pages/People";
import Person from "./pages/Person";

const App = () => (
  <Router>
    <Header />
    <Switch>
      <Route exact path="/seattle/" component={Home} />
      <Route path="/seattle/search" component={Search} />
      <Route exact path="/seattle/events" component={AllEvents} />
      <Route path="/seattle/events/:id" component={Event} />
      <Route exact path="/seattle/people" component={People} />
      <Route exact path="/seattle/people/:id" component={Person} />
    </Switch>
    <Footer />
  </Router>
);

export default App;
