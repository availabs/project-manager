import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import ScrollToTop from 'utils/ScrollToTop'

import Routes from 'Routes';

import {
  DefaultLayout,
  Messages
} from "@availabs/avl-components"

import { AUTH_HOST, PROJECT_NAME, CLIENT_HOST } from 'config'
import { enableAuth } from "@availabs/ams"

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <ScrollToTop />
        <Switch>
          { Routes.map((route, i) => {
              const Route = enableAuth(DefaultLayout, { AUTH_HOST, PROJECT_NAME, CLIENT_HOST });
              return (
                <Route key={ i } { ...this.props } { ...route }
                  menus={ Routes.filter(r => r.mainNav) }/>
                )
            })
          }
        </Switch>
        <Messages />
      </BrowserRouter>
    );
  }
}
export default App
