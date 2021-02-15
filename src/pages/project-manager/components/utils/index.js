import React from "react"

import { connect } from "react-redux"

import get from "lodash.get"

export const userPropsWrapper = Component => {
  const Wrapper = ({ user, falcorCache, ...props }) => {

    const pmMembers = React.useMemo(() => {
      const members = [];

      const membersPath = ["dms", "data", `project-manager+member`],
        membersLength = get(falcorCache, [...membersPath, "length"], 0);

      for (let i = 0; i < membersLength; ++i) {
        const p = get(falcorCache, [...membersPath, "byIndex", i, "value"], null);
        if (p) {
          const pmMember = JSON.parse(JSON.stringify(get(falcorCache, [...p], {}))),
            data = get(pmMember, ["data", "value"], null);
          if (data) {
            pmMember.data = data;
            members.push(pmMember);
          }
        }
      }
      return members;
    }, [falcorCache]);

    const pmMember = pmMembers.reduce((a, c) => {
      return c.data.amsId === user.id ? c : a;
    }, { data: {} });

    return (
      <Component { ...props } user={ user }
        pmMembers={ pmMembers }
        pmMember={ pmMember }/>
    )
  }
  const mapStateToProps = state => ({
    amsUsers: get(state, "users", [])
      .filter(({ groups }) => groups.includes("AVAIL"))
  })
  return connect(mapStateToProps)(Wrapper);
}
