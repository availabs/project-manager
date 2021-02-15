import React from "react"

import { Button } from "@availabs/avl-components"

import { dmsCreate } from "dms/wrappers/dms-create"
import { SectionInputs } from "dms/components/dms-create"

const AddMember = ({ createState, interact, ...props }) => {

  const [open, setOpen] = React.useState(false);

  const addMember = React.useCallback(e => {
    e.stopPropagation();
    interact("api:create", null, createState.saveValues)
      .then(() => createState.clearValues());
    setOpen(false);
  }, [createState, interact, setOpen]);

  const cancelCreate = React.useCallback(e => {
    if (open) {
      createState.clearValues();
    }
    setOpen(!open);
  }, [createState, open]);

  return (
    <form onSubmit={ e => e.preventDefault() }>
      <div className="mb-4 flex max-w-2xl">
        <div className="flex-1">
          <Button onClick={ cancelCreate } block>
            { open ? "cancel" : "new member" }
          </Button>
        </div>
        <div className="flex-1 ml-2">
          { !open ? null :
            <Button type="submit" onClick={ addMember } block
              disabled={ createState.dmsAction.disabled }>
              add member
            </Button>
          }
        </div>
      </div>
      { !open ? null :
        <SectionInputs createState={ createState }/>
      }
    </form>
  )
}
export default dmsCreate(AddMember);
