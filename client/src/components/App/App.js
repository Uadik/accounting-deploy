import React, { Fragment, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

// styles
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import './App2.css';

// components
import { Navbar, Landing, Footer, Alert } from '../layout';
import PrivateRoute from '../routing/PrivateRoute';
import { LoginForm, RegisterForm } from '../auth';
import Dashboard from '../dashboard/Dashboard';
import CreateProfile from '../profile-forms/CreateProfile';
import Companies from '../company/Companies';
import Company from '../company/Company';
import Profiles from '../profile/Profiles';
import Profile from '../profile/Profile';

// services
import store from '../../store';
import setAuthToken from '../../utils/setAuthToken';
import { loadUser } from '../../store/actions/auth';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing}></Route>
            <Route path="/">
              <section className="container">
                <Alert />
                <Switch>
                  <Route exact path="/login" component={LoginForm}></Route>
                  <Route
                    exact
                    path="/register"
                    component={RegisterForm}
                  ></Route>
                  <Route exact path="/profiles" component={Profiles}></Route>
                  <Route
                    exact
                    path="/profile/:handle"
                    component={Profile}
                  ></Route>

                  <PrivateRoute path="/dashboard" component={Dashboard} />
                  <PrivateRoute
                    exact
                    path="/create-profile"
                    component={CreateProfile}
                  />
                  <PrivateRoute
                    exact
                    path="/edit-profile"
                    component={CreateProfile}
                    componentOptions={{ isEdit: true }}
                  />
                  <PrivateRoute
                    exact
                    path="/companies"
                    component={Companies}
                    componentOptions={{ self: true }}
                  />
                  <PrivateRoute path="/company/:id" component={Company} />
                </Switch>
              </section>
            </Route>
          </Switch>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
