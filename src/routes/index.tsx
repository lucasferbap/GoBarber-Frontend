import React from 'react';
import { Switch } from 'react-router-dom';

import SingIn from '../pages/Singin';
import SingUp from '../pages/SingUp';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

import Route from './Route';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SingIn} />
    <Route path="/signup" component={SingUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />
  </Switch>
);

export default Routes;
