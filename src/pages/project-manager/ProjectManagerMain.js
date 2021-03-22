import React from "react"

import { connect } from "react-redux"

import get from "lodash.get"

import { getUsers } from "@availabs/ams"

const ProjectManagerMain = ({ falcor, getUsers, children, user }) => {
  React.useEffect(() => {
    getUsers();
    const path = ["dms", "data", `project-manager+member`];
    falcor.get([...path, "length"])
      .then(res => {
        const length = get(res, ["json", ...path, "length"], 0);
        if (length) {
          return falcor.get(
            [...path, "byIndex", { from: 0, to: length - 1 },
              ["id", "app", "type", "data", "updated_at"]
            ]
          )
        }
      });
  }, [getUsers, falcor]);

console.log("USER:", user)

  return (
    <div className="px-10 flex-1 w-full min-h-screen">
      { children }
    </div>
  )
}
export default connect(null, { getUsers })(ProjectManagerMain);
