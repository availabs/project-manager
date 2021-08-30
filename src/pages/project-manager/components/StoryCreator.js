import React from "react"

import { connect } from "react-redux"

import get from "lodash.get"

import { Button } from "@availabs/avl-components"
import { postMessage } from "@availabs/ams"

import { dmsCreate } from "dms/wrappers/dms-create"
import { SectionInputs } from "dms/components/dms-create"

const StoryCreator = ({ createState,
                        open, setOpen,
                        interact,
                        pmMembers,
                        postMessage,
                        projects, ...props }) => {

  const doPostMessage = React.useCallback(saveValues => {

    const projectName = projects.reduce((a, c) => {
      return c.data.id === saveValues.project ? c.data.name : a;
    }, null);

    const owners = get(saveValues, "owner", []);

    const amsIds = pmMembers.filter(member => {
        return owners.includes(member.id);
      })
      .map(member => member.data.amsId);

    if (projectName && amsIds.length) {
      const heading = `You were assigned a story for project ${ projectName }`,
        message = `You were assigned a story for project: ${ projectName }.\n` +
                  ` Title: ${ saveValues.title }.\n` +
                  ` Requested by: ${ saveValues.requestedBy }.\n` +
                  ` Type: ${ saveValues.type }.\n` +
                  ` Points: ${ saveValues.points }.`;
      postMessage(heading, message, "users", amsIds);
    }
  }, [postMessage, projects, pmMembers]);

  const createStory = React.useCallback(e => {
    e.stopPropagation();
    interact("api:create", null, { ...createState.saveValues })
      .then(() => {
        doPostMessage(createState.saveValues);
      })
      .then(() =>  {
        createState.clearValues();
      });
    setOpen(false);
  }, [createState, interact, setOpen, doPostMessage]);

  const cancelCreate = React.useCallback(e => {
    if (open) {
      createState.clearValues();
    }
    setOpen(!open);
  }, [createState, setOpen, open]);

  return (
    <div className="px-2 pt-2 border rounded">
      <form onSubmit={ e => e.preventDefault() }>
        <div className="flex max-w-5xl mb-2">
          <div className="flex-1">
            <Button onClick={ cancelCreate } block>
              { open ? "cancel" : "new story" }
            </Button>
          </div>
          <div className="flex-1 ml-2">
            { !open ? null :
              <Button type="submit" onClick={ createStory } block
                disabled={ createState.dmsAction.disabled }>
                create
              </Button>
            }
          </div>
        </div>
        { !open ? null :
          <SectionInputs createState={ createState }/>
        }
      </form>
      <div className="flex mb-2">
        <div className="flex-1 mr-1">
          <Button onClick={ cancelCreate } block>
            { open ? "cancel" : "new story" }
          </Button>
        </div>
        <div className="flex-1 ml-1">
          { !open ? null :
            <Button type="submit" onClick={ createStory } block
              disabled={ createState.dmsAction.disabled }>
              create
            </Button>
          }
        </div>
      </div>
    </div>
  )
}
export default connect(null, { postMessage })(dmsCreate(StoryCreator));
