import React from "react"

import get from "lodash.get"

import { useTheme } from "@availabs/avl-components"

import StoryEditor from "./StoryEditor"
import ProjectStories from "./ProjectStories"

const TooOldInMiliseconds = 1000 * 60 * 60 * 24 * 8;

const ProjectViewer = ({ project, dataItems, pmMember, format, ...props }) => {

  const formatMap = React.useMemo(() => {
    return format.attributes
      .reduce((a, c) => {
        return c.key === "state" ? c.inputProps.domain : a;
      }, [])
      .reduce((a, c, i) => {
        return { ...a, [c]: i };
      }, {});
  }, [format]);

  const storySorter = React.useCallback(({ data: aData }, { data: bData }) => {
    const aState = aData.state, aIndex = aData.index,
      bState = bData.state, bIndex = bData.index;

    if (aState === bState) {
      return +aIndex - +bIndex;
    }
    return +formatMap[bState] - +formatMap[aState];
  }, [formatMap]);

  const stories = React.useMemo(() => {
    return dataItems.filter(di => di.data.project === project.data.id)
      .filter(({ updated_at, data }) => {
        return data.state !== "Accepted" ||
          Date.now() - ((new Date(updated_at)).valueOf()) < TooOldInMiliseconds;
      });
  }, [dataItems, project]);

  const myStories = stories.filter(({ data }) => get(data, "owner", []).includes(pmMember.id));

  const theme = useTheme();

  return !project ? null : (
    <div className="w-full h-full max-w-7xl mx-auto pb-10">


      <div className="float-left overflow-auto scrollbar-sm h-full px-2"
        style={ { width: "calc(50% - 1rem)" } }>
        <ProjectStories { ...props } project={ project }
          dataItems={ dataItems } format={ format }/>
      </div>

      <div className="float-left overflow-auto scrollbar-sm h-full"
        style={ { width: "calc(50% - 1rem)" } }>
        <div className="mb-1">
          { myStories.length ?
            <div className="font-bold">My Stories</div> : null
          }
        </div>
        <div className={ `
          p-2 grid grid-cols-1 gap-y-2 ${ theme.menuBg } rounded
        ` }>
          { myStories.sort(storySorter)
              .map((story, i) => (
                <div key={ story.id } className="col-span-1">
                  <StoryEditor { ...props } project={ project } format={ format }
                    item={ story } pmMember={ pmMember }/>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}
export default ProjectViewer;
