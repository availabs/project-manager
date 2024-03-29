import React from "react"

import { connect } from "react-redux"

import get from "lodash.get"
import { range as d3range } from "d3-array"

import { Button, useClickOutside, useTheme } from "@availabs/avl-components"
import { postMessage } from "@availabs/ams"

import { dmsEdit } from "dms/wrappers/dms-create"
import { SectionInputs } from "dms/components/dms-create"

const AdvanceTo = {
  Unstarted: [{ next: "Start", buttonTheme: "buttonSmallBlock" }],
  Started: [{ next: "Finish", buttonTheme: "buttonSmallBlockInfo" }],
  Finished: [{ next: "Deliver", buttonTheme: "buttonSmallBlockPrimary" }],
  Delivered: [
    { next: "Reject", buttonTheme: "buttonSmallBlockDanger" },
    { next: "Accept", buttonTheme: "buttonSmallBlockSuccess" }
  ]
}
export const BgColors = {
  Unstarted: "bg-gray-300",
  Started: "bg-teal-300",
  Finished: "bg-blue-400",
  Delivered: "bg-yellow-400",
  Accepted: "bg-green-400",
  Rejected: "bg-red-400"
}

const StoryDataCache = {}

const StoryEditor = ({ item,
                        createState,
                        interact,
                        format,
                        pmMember,
                        pmMembers,
                        postMessage,
                        projects }) => {

  React.useEffect(() => {
    StoryDataCache[item.id] = JSON.parse(JSON.stringify(item.data));
  }, [item]);

  React.useEffect(() => {
    const prevState = StoryDataCache[item.id].state;

    const projectName = projects.reduce((a, c) => {
      return c.data.id === item.data.project ? c.data.name : a;
    }, null);

    if (projectName && (prevState !== "Delivered") && (item.data.state === "Delivered")) {
      const admins = pmMembers.filter(member => {
        return (member.id !== pmMember.id) && (member.data.role === "admin");
      }).map(member => member.data.amsId);

      const owners = pmMembers.filter(member => {
        return item.data.owner.includes(member.id);
      }).map(member => member.data.name);

      const heading = `A story was delivered for project ${ projectName }`,
        message = `A story was delivered for project: ${ projectName }.\n` +
                  ` Title: ${ item.data.title }.\n` +
                  ` Owners: ${ owners.join(", ") }.\n` +
                  ` Requested by: ${ item.data.requestedBy }.\n` +
                  ` Type: ${ item.data.type }.\n`;

      postMessage(heading, message, "users", admins);
    }

    const prevOwner = StoryDataCache[item.id].owner || [],
      newOwner = (item.data.owner || []).filter(owner => !prevOwner.includes(owner));

    const amsIds = pmMembers.filter(member => {
        return newOwner.includes(member.id);
      })
      .map(member => member.data.amsId);

    if (projectName && amsIds.length) {
      const heading = `You were assigned a story for project ${ projectName }`,
        message = `You were assigned a story for project: ${ projectName }.\n` +
                  ` Title: ${ item.data.title }.\n` +
                  ` Requested by: ${ item.data.requestedBy }.\n` +
                  ` Type: ${ item.data.type }.\n` +
                  ` Points: ${ item.data.points }.`;

      postMessage(heading, message, "users", amsIds);
    }

    StoryDataCache[item.id] = JSON.parse(JSON.stringify(item.data));
  }, [item, pmMember, pmMembers, projects, postMessage]);

  const [open, setOpen] = React.useState(false);

  const updateStory = React.useCallback(e => {
    e.stopPropagation();
    if (open && !createState.dmsAction.disabled) {
      interact("api:edit", item.id, createState.saveValues);
    }
  }, [interact, createState, item, open]);

  const deleteStory = React.useCallback(e => {
    e.stopPropagation();
    interact("api:delete", item.id)
  }, [interact, item]);

  const advanceState = React.useCallback(e => {
    e.stopPropagation();

    const states = format.attributes.reduce((a, c) => {
      return c.key === "state" ? c.inputProps.domain : a;
    }, []);

    const index = states.indexOf(item.data.state) + 1;
    if (index < states.length) {
      const data = {
        ...item.data,
        state: states[index]
      }
      if (!data.owner || !data.owner.length) {
        data.owner = [pmMember.id];
      }
      interact("api:edit", item.id, data, { loading: false });
    }
  }, [interact, item, format, pmMember]);

  const owner = pmMembers.filter(({ id }) => get(item, ["data", "owner"], []).includes(id));

  const [setNode] = useClickOutside(updateStory);

  const range = d3range(+item.data.points);

  const theme = useTheme();

  return (
    <div ref={ setNode } onClick={ e => setOpen(true) }
      className={ `
        max-w-5xl flex flex-col rounded border transition
        ${ theme.bg } ${ theme.menuText } ${ theme.menuTextHover }
        ${ !open ? `cursor-pointer` : "p-2" }
      ` }>
      <div className={ `
        flex flex-row items-stretch relative items-center rounded
        ${ !open ? `p-1` : "p-0" }
        ${ open ? theme.bg : BgColors[item.data.state] } bg-opacity-25
      ` }>
        { open ? (
            <div className={ `
                w-6 rounded flex items-center justify-center mr-1
                cursor-pointer hover:${ theme.accent3 } transition
              ` }
              onClick={ e => { updateStory(e); setOpen(false); } }>
              <span className="fa text-2xl leading-6 fa-caret-up"/>
            </div>
          ) : (
            <div className="w-6 flex items-center justify-center mr-1">
              { item.data.type === "Feature" ?
                <span className={ `fa fa-cog ${ theme.textInfo }` }/> :
                <span className={ `fa fa-bug ${ theme.textDanger }` }/>
              }
            </div>
          )
        }
        <div className="flex-1">
          <span>{ item.data.title }</span>
          { owner.map(o => (
              <span key={ o.id } className="ml-1">
                ({ o.data.initials })
              </span>
            ))
          }
        </div>
        { open ? null :
          <div className="ml-1 flex-0 flex flex-row">
            { range.map(r => (
              <div key={ r }
                className={ `h-full w-2 ml-1 rounded ${ theme.bgInfo }` }/>
              ))
            }
          </div>
        }
        <div className="ml-1 flex-0 flex">
          { open ? (
              <Button buttonTheme="buttonSmallSuccess"
                disabled={ createState.dmsAction.disabled }
                onClick={ updateStory }>
                update story
              </Button>
            ) : item.data.state !== "Accepted" ? (
              AdvanceTo[item.data.state].map(({ next, buttonTheme }, i) => (
                <div key={ next } className="flex items-center"
                  style={ {
                    width: "5.25rem",
                    marginLeft: i > 0 ? "0.25rem" : "0rem"
                  } }>
                  <Button onClick={ advanceState }
                    buttonTheme={ buttonTheme }
                    disabled={ item.data.state === "Accepted" }>
                    { next }
                  </Button>
                </div>
              ))
            ) : <span className={ `fa fa-lg ${ theme.textInfo } fa-thumbs-up mx-1` }/>
          }
        </div>
      </div>
      { !open ? null :
        <div>
          <SectionInputs createState={ createState }/>
          <div className="flex">
            <div className="flex-1 mr-1">
              <Button buttonTheme="buttonDangerBlock" showConfirm
                onClick={ deleteStory }>
                delete story
              </Button>
            </div>
            <div className="flex-1 ml-1">
              <Button buttonTheme="buttonSuccessBlock"
                disabled={ createState.dmsAction.disabled }
                onClick={ updateStory }>
                update story
              </Button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
export default connect(null, { postMessage })(dmsEdit(StoryEditor));
