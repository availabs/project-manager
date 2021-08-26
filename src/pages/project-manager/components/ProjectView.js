import React from "react"

import get from "lodash.get"

import ProjectStories from "./ProjectStories"

const TooOldInMiliseconds = 1000 * 60 * 60 * 24 * 8;

const ProjectView = ({ project, dataItems, pmMember, format, ...props }) => {

  const stories = React.useMemo(() => {
    return dataItems.filter(di => di.data.project === project.data.id)
      .filter(({ updated_at, data }) => {
        return (data.state !== "Accepted") ||
          (Date.now() - ((new Date(updated_at)).valueOf()) < TooOldInMiliseconds);
      });
  }, [dataItems, project]);

  const myStories = stories.filter(({ data }) => get(data, "owner", []).includes(pmMember.id));

  return !project ? null : (
    <div className="h-full container mx-auto pb-10 flex justify-center">

      <div className="float-left overflow-auto scrollbar-sm h-full mr-2 px-2"
        style={ { width: "calc(50% - 1rem)" } }>
        <ProjectStories { ...props } project={ project } pmMember={ pmMember }
          dataItems={ stories } format={ format }/>
      </div>

      <div className="float-left overflow-auto scrollbar-sm h-full ml-2 px-2"
        style={ { width: "calc(50% - 1rem)" } }>
        <div className="mb-1">
          { myStories.length ?
            <div className="font-bold">My Stories</div> : null
          }
        </div>
        { !myStories.length ? null :
          <ProjectStories { ...props } project={ project } pmMember={ pmMember }
            dataItems={ myStories } format={ format }
            showHeader={ false }/>
        }
      </div>
    </div>
  )
}
export default ProjectView;
