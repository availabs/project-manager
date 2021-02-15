import React from "react"

import AddMember from "./AddMember"
import EditMember from "./EditMember"

const MembersManager = ({ dataItems, pmMembers, pmMember, amsUsers, ...props }) => {
  if (!amsUsers.length || pmMember.data.role === "admin??") return null;

  const pmMemberIds = pmMembers.map(pm => pm.data.amsId);

  const newAmsUsers = amsUsers.filter(({ id }) => !pmMemberIds.includes(id))
    .sort((a, b) => a.email.localeCompare(b.email));

  return (
    <div>
      <div className="font-bold text-xl">
        Members Manager
      </div>
      <AddMember { ...props } amsUsers={ newAmsUsers }/>
      { !pmMembers.length ? null : "Members" }
      { pmMembers.map(di => (
          <EditMember { ...props } key={ di.id }
            amsUsers={ amsUsers } item={ di }/>
        ))
      }
    </div>
  )
}
export default MembersManager;
