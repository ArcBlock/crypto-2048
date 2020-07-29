/* eslint-disable object-curly-newline */
import React from 'react';
import { create } from '@arcblock/ux/lib/Theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import Center from '@arcblock/ux/lib/Center';

import HomePage from './pages/index';

import { SessionProvider } from './libs/session';

const theme = create();

const GlobalStyle = createGlobalStyle`
  a {
    color: ${props => props.theme.colors.green};
    text-decoration: none;
  }

  ul, li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
`;

export const App = () => (
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>
      <SessionProvider serviceHost={window.env && window.env.apiPrefix ? window.env.apiPrefix : '/'} autoLogin>
        {({ session }) => {
          if (session.loading) {
            return (
              <Center>
                <CircularProgress />
              </Center>
            );
          }

          return (
            <React.Fragment>
              <CssBaseline />
              <GlobalStyle />
              <div className="wrapper">
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  <Redirect to="/" />
                </Switch>
              </div>
            </React.Fragment>
          );
        }}
      </SessionProvider>
    </ThemeProvider>
  </MuiThemeProvider>
);

const WrappedApp = withRouter(App);

export default () => {
  let basename = '/';
  if (window.env && window.env.apiPrefix) {
    basename = window.env.apiPrefix.indexOf('.netlify/') > -1 ? '/' : window.env.apiPrefix;
  }
  return (
    <Router basename={basename}>
      <WrappedApp />
    </Router>
  );
};
