import React from "react"

import { useTheme } from "@availabs/avl-components"

import ProjectStories from "./ProjectStories"

const StoriesOverview = ({ projects, pmInteract, ...props }) => {

  const [active, setActive] = React.useState(0);

  const theme = useTheme();

  const activeProject = projects[active];


  return (
    <div className="w-full h-full overflow-x-auto scrollbar pb-10">

      <div className={ `
          float-left mr-16
        ` }>
        <div className="text-lg font-bold">
          Projects
        </div>
        <div className={ `py-2 px-4 ${ theme.sidebarBg } rounded` }>
          { projects.map((project, i) => (
              <div key={ project.id }
                className={ `
                  text-lg font-bold px-4 cursor-pointer py-1 rounded
                  whitespace-nowrap flex transition
                  ${ theme.menuBgHover } ${ theme.menuBg }
                  ${ active === i ?
                      `${ theme.menuBgActive } ${ theme.menuBgActiveHover }
                        ${ theme.menuTextActive } ${ theme.menuTextActiveHover }` :
                      `${ theme.menuBg } ${ theme.menuBgHover }
                        ${ theme.menuText } ${ theme.menuTextHover }`
                  }
                ` }
                onClick={ e => setActive(i) }>
                <div className="flex-1">{ project.data.name }</div>
              </div>
            ))
          }
        </div>
      </div>

      <div className={ `
          max-w-2xl float-left overflow-auto
          scrollbar-sm h-full px-2
        ` } style={ { width: "calc(50% - 1rem)" } }>
        <ProjectStories { ...props }
          project={ activeProject }/>
      </div>

    </div>
  )
}
export default StoriesOverview;
