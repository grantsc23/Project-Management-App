import React from 'react';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../App.css';
import store, { history } from './../store';
import 'react-circular-progressbar/dist/styles.css';
import { ConnectedRouter } from 'connected-react-router';
import { Route } from 'react-router-dom';
import AppNavBar from './AppNavBar';
import ProjectList from './ProjectList';
import ViewProject from './ViewProject';





const App = () => {
  return (
    <Provider store={store}>
      <AppNavBar />
      <br />
      <ConnectedRouter history={history}>
        <Route exact path="/" component={ProjectList} />
        <Route exact path="/view-project" component={ViewProject} />
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
