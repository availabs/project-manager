import React from "react"

import get from "lodash.get"

import { Button } from "@availabs/avl-components"

import { dmsEdit } from "dms/wrappers/dms-create"
import { SectionInputs } from "dms/components/dms-create"

const EditMember = ({ createState, interact, item, pmMember, ...props }) => {

  const [open, setOpen] = React.useState(false);

  const editMember = React.useCallback(e => {
    e.stopPropagation();
    interact("api:edit", item.id, createState.saveValues);
  }, [interact, item, createState]);

  const deleteMember = React.useCallback(e => {
    e.stopPropagation();
    interact("api:delete", item.id);
  }, [interact, item]);

  return (
    <div className={ `
      mb-4 max-w-2xl
      ${ open ? "border rounded p-2" : "" }
    ` }>
      <div className="flex">
        <div className="flex-1">
          <Button onClick={ e => setOpen(!open) } block>
            { open ? "cancel" : item.data.name }
          </Button>
        </div>
          { !open ? null :
            <div className="flex-1 ml-2">
              <Button onClick={ editMember } block
                disabled={ createState.dmsAction.disabled }>
                edit member
              </Button>
            </div>
          }
      </div>
      { !open ? null :
        <div className="mt-2">
          <SectionInputs createState={ createState }/>
          <div className="max-w-2xl">
            { get(pmMember, ["data", "role"], "new") !== "admin" ? null :
              <Button showConfirm onClick={ deleteMember } block>
                delete member
              </Button>
            }
          </div>
        </div>
      }
    </div>
  )
}
export default dmsEdit(EditMember);
