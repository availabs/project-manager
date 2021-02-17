import React from "react"

import { Button } from "@availabs/avl-components"

import { dmsCreate } from "dms/wrappers/dms-create"
import { SectionInputs } from "dms/components/dms-create"

const StoryCreator = ({ createState, open, setOpen, interact, ...props }) => {

  const createStory = React.useCallback(e => {
    e.stopPropagation();
console.log("SAVING:", { ...createState.saveValues })
    interact("api:create", null, { ...createState.saveValues })
      .then(() =>  {
        createState.clearValues()
        console.log("SAVED")
      });
    // createState.clearValues();
    setOpen(false);
  }, [createState, interact, setOpen]);
  const cancelCreate = React.useCallback(e => {
    if (open) {
      createState.clearValues();
    }
    setOpen(!open);
  }, [createState, setOpen, open]);

console.log(createState.values, createState.defaultsLoaded);

  return (
    <div className="px-2 pt-2 border rounded">
      <form onSubmit={ e => e.preventDefault() }>
        <div className="flex max-w-2xl mb-2">
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
      <div className="flex max-w-2xl mb-2">
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
    </div>
  )
}
export default dmsCreate(StoryCreator);
