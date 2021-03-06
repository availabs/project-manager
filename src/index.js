import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { API_HOST, PROJECT_THEME } from 'config'

import get from "lodash.get"

import { Provider } from 'react-redux';
import store from 'store';
import {
  Themes,
  FalcorProvider,
  ThemeContext,
  falcorGraph,
  addComponents,
  addWrappers
} from "@availabs/avl-components"

import reportWebVitals from './reportWebVitals';

import DmsComponents from "dms"
import DmsWrappers from "dms/wrappers"

import {
  Components as AmsComponents,
  Wrappers as AmsWrappers,
  // enableAuth
} from "@availabs/ams"

import 'styles/tailwind.css';

addComponents(DmsComponents);
addWrappers(DmsWrappers);

addComponents(AmsComponents);
addWrappers(AmsWrappers);

ReactDOM.render(
  <React.StrictMode>
   	<Provider store={ store }>
  		<FalcorProvider falcor={ falcorGraph(API_HOST) }>
        <ThemeContext.Provider value={ get(Themes, PROJECT_THEME, Themes["light"]) }>
  	    	<App />
        </ThemeContext.Provider>
      </FalcorProvider>
  	</Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
