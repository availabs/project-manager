import React from "react"

import config from "./project-manager.config"

import { Redirect } from "react-router-dom"

const routes = [
  { path: "/",
    component: () => <Redirect to="/pm"/>,
    exact: true,
    mainNav: false,
    layoutSettings: {
      fixed: true,
      headerBar: false,
      navBar: "side"
    }
  },
  { path: "/pm",
    mainNav: true,
    name: "Project Manager",
    component: config,
    authLevel: 5,
    layoutSettings: {
      fixed: true,
      headerBar: false,
      navBar: false
    }
  }
]
export default routes;
