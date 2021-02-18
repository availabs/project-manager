import React from "react"

import get from "lodash.get"
import { range as d3range } from "d3-array"

import { Button, useClickOutside, useTheme } from "@availabs/avl-components"

import { dmsEdit } from "dms/wrappers/dms-create"
import { SectionInputs } from "dms/components/dms-create"

const AdvanceTo = {
  Unstarted: "Start",
  Started: "Finish",
  Finished: "Deliver",
  Delivered: "Accept"
}

const ButtonThemesByState = {
  Unstarted: "buttonSmallBlock",
  Started: "buttonSmallBlockInfo",
  Finished: "buttonSmallBlockPrimary",
  Delivered: "buttonSmallBlockSuccess",
  Accepted: "buttonSmallBlock"
}

const StoryEditor = ({ item, createState, interact, format, pmMember, pmMembers, ...props }) => {

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
      if (!data.owner) {
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
        max-w-2xl flex flex-col rounded border transition
        ${ theme.menuBg } ${ open ? "" : theme.menuBgHover }
        ${ theme.menuText } ${ theme.menuTextHover }
        ${ !open ? `p-1 cursor-pointer` : "p-2" }
      ` }>
      <div className="flex relative items-center">
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
        <div className="flex-1 relative">
          { open ? null :
            <div className={ `
              absolute left-0 top-0 bottom-0 right-0 flex justify-end
            ` }>
              { range.map(r => (
                  <div key={ r }
                    className={ `h-full w-2 ml-1 rounded ${ theme.bgInfo }` }/>
                ))
              }
            </div>
          }
          <span>{ item.data.title }</span>
          { owner.map(o => (
              <span key={ o.id } className="ml-1">
                ({ o.data.initials })
              </span>
            ))
          }
        </div>
        <div className="ml-1">
          { open ? (
              <Button buttonTheme="buttonSmallSuccess"
                disabled={ createState.dmsAction.disabled }
                onClick={ updateStory }>
                update story
              </Button>
            ) : item.data.state !== "Accepted" ? (
              <div className="flex items-center"
                style={ { width: "5.25rem" } }>
                <Button onClick={ advanceState }
                  buttonTheme={ ButtonThemesByState[item.data.state] }
                  disabled={ item.data.state === "Accepted" }>
                  { AdvanceTo[item.data.state] }
                </Button>
              </div>
            ) : null
          }
        </div>
      </div>
      { !open ? null :
        <div>
          <SectionInputs createState={ createState }/>
          <div className="max-w-2xl flex">
            <div className="flex-1 mr-2">
              <Button buttonTheme="buttonDangerBlock" showConfirm
                onClick={ deleteStory }>
                delete story
              </Button>
            </div>
            <div className="flex-1 ml-2">
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
export default dmsEdit(StoryEditor);
