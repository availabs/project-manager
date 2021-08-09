import React from "react"

import get from "lodash.get"

import AddMember from "./AddMember"
import EditMember from "./EditMember"

const MembersManager = ({ dataItems, pmMembers, pmMember, availUsers, user, ...props }) => {
  if (!availUsers.length) return null;

  const asAdmin = !pmMembers.length || (get(pmMember, ["data", "role"], "new") === "admin"),
    hideRole = !asAdmin;

  const pmMemberIds = pmMembers.map(pm => pm.data.amsId);

  const newAvailUsers = availUsers.filter(({ id }) => !pmMemberIds.includes(id))
    .filter(({ id }) => asAdmin ||  (id === user.id))
    .sort((a, b) => a.email.localeCompare(b.email));

  pmMembers = pmMembers.filter(pm => asAdmin || (pmMember.id === pm.id));

  return (
    <div>
      <div className="font-bold text-xl">
        Members Manager
      </div>
      { !newAvailUsers.length ? null :
        <AddMember { ...props }
          availUsers={ newAvailUsers }
          hideRole={ hideRole }
          pmMember={ pmMember }/>
      }
      { !pmMembers.length ? null : "Members" }
      { pmMembers.map(di => (
          <EditMember { ...props } key={ di.id }
            pmMembers={ pmMembers }
            pmMember={ pmMember }
            availUsers={ availUsers }
            hideRole={ hideRole }
            item={ di }/>
        ))
      }
    </div>
  )
}
export default MembersManager;
