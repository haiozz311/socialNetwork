import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Dashboard from 'pages/Dashboard';
import Customers from 'pages/Customers';
import Words from 'pages/Words';
import Centences from 'pages/Centences';
import Posts from 'pages/Posts';
import Profile from 'pages/Profile';

const Routes = () => {
  return (
    <Switch>
      <Route path='/' exact component={Dashboard} />
      <Route path='/customers' component={Customers} />
      <Route path='/words' component={Words} />
      <Route path='/centences' component={Centences} />
      <Route path='/posts' component={Posts} />
      <Route path='/profile' component={Profile} />
    </Switch>
  );
};

export default Routes;
