import config from "./project-manager.config"

const route = {
  path: "/app",
  mainNav: true,
  name: "Project Manager",
  component: config,
  authLevel: 5,
  layoutSettings: {
    fixed: true,
    headerBar: false,
    logo: "AVAIL",
    navBar: "side"
  }
}
export default route;
