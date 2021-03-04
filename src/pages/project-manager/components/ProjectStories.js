import React from "react"

import { groups as d3groups } from "d3-array"

import { DndList, useTheme } from "@availabs/avl-components"

import StoryCreator from "./StoryCreator"
import StoryEditor from "./StoryEditor"

const TooOldInMiliseconds = 1000 * 60 * 60 * 24 * 8;

const ProjectStories = ({ project, dataItems, interact, format, ...props }) => {

  const formatMap = React.useMemo(() => {
    return format.attributes
      .reduce((a, c) => {
        return c.key === "state" ? c.inputProps.domain : a;
      }, [])
      .reduce((a, c, i) => {
        return { ...a, [c]: i };
      }, {});
  }, [format]);

  const stories = React.useMemo(() => {
    return dataItems.filter(di => di.data.project === project.data.id)
      .filter(({ updated_at, data }) => {
        return data.state !== "Accepted" ||
          Date.now() - ((new Date(updated_at)).valueOf()) < TooOldInMiliseconds;
      });
  }, [dataItems, project]);

  const next = stories.reduce((a, c) => Math.max(a, +c.data.index), 0);

  const groups = d3groups(stories, s => s.data.state)
    .sort((a, b) => +formatMap[b[0]] - +formatMap[a[0]]);

  const onDrop = React.useCallback((stories, start, end) => {
    const lowIndex = Math.min(start, end),
      highIndex = Math.max(start, end),

      temp = [...stories],
      [item] = temp.splice(start, 1);
    temp.splice(end, 0, item);

    for (let i = lowIndex; i <= highIndex; ++i) {
      interact("api:edit", temp[i].id, { ...temp[i].data, index: i }, { loading: false });
      temp[i].data.index = i; // <-- this is temp. It just makes the list look nice until data is updated
    }
  }, [interact]);

  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  return !project ? null : (
    <div>
      <div className="mb-1">
        <div className="font-bold flex">
          <div className="flex-1">{ project.data.name } Stories</div>
          { open ? null :
            <div onClick={ e => setOpen(true) }
              className={ `px-4 rounded cursor-pointer ${ theme.menuBgHover }` }>
              <span className="fa fa-plus mr-1"/>New Story
            </div>
          }
        </div>
      </div>
      <div className={ `py-2 ${ open ? "block" : "hidden" }` }>
        <StoryCreator key={ project.id } { ...props } open={ open } setOpen={ setOpen }
          project={ project } format={ format }
          next={ next } interact={ interact }/>
      </div>
      { groups.map(([state, stories], i) => (
          <div key={ state }>
            <DndList key={ state } onDrop={ (s, e) => onDrop(stories, s, e) }>
              { stories.sort((a, b) => +a.data.index - +b.data.index)
                  .map(story => (
                    <div key={ story.id } className="mb-2">
                      <StoryEditor { ...props } project={ project } format={ format }
                        interact={ interact } item={ story }/>
                    </div>
                  ))
              }
            </DndList>
          </div>
        ))
      }
    </div>
  )
}
export default ProjectStories;
