export const Member = {
  app: "project-manager",
  type: "member",
  attributes: [
    { key: "amsId",
      name: "AVAILabber",
      type: "select",
      required: true,
      editable: "before-create",
      inputProps: {
        domain: "props:amsUsers",
        accessor: user => `(${ user.id }) ${ user.email} `,
        valueAccessor: user => user.id
      }
    },
    { key: "name",
      type: "text",
      required: true
    },
    { key: "initials",
      type: "text",
      required: true,
      verify: "^\\w{1,3}$"
    },
    { key: "role",
      type: "select",
      inputProps: {
        domain: ["user", "admin"],
        searchable: false,
        removable: false
      },
      default: "user",
      hidden: "props:hideRole"
    }
  ]
}

export const Story = {
  app: "project-manager",
  type: "story",

  attributes: [
    { key: "title",
      type: "text",
      required: true
    },
    { key: "project",
      type: "text",
      default: "props:project.data.id"
    },
    { key: "projectVersion",
      type: "text",
      default: "props:project.data.version"
    },
    { key: "index",
      type: "number",
      required: true,
      hidden: true,
      editable: true,
      default: "props:next",
      liveUpdate: true
    },
    { key: "type",
      type: "select",
      required: true,
      default: "Feature",
      inputProps: {
        searchable: false,
        domain: ["Feature", "Bug"],
        removable: false
      },
      liveUpdate: true
    },
    { key: "points",
      type: "select",
      required: true,
      liveUpdate: true,
      inputProps: {
        removable: false,
        domain: [0, 1, 2, 3, 4, 5]
      }
    },
    { key: "state",
      type: "select",
      required: true,
      default: "Unstarted",
      liveUpdate: true,
      inputProps: {
        domain: ["Unstarted", "Started", "Finished", "Delivered", "Accepted", "Rejected"],
        removable: false
      }
    },
    { key: "requestedBy",
      type: "text",
      required: true,
      editable: false,
      default: "props:pmMember.data.name",
      liveUpdate: true
    },
    { key: "owner",
      type: "select",
      isArray: true,
      // required: true,
      inputProps: {
        valueAccessor: d => d.id,
        accessor: d => d.data.name,
        domain: "props:pmMembers"
      },
      liveUpdate: true
    },
    { key: "description",
      type: "markdown",
      required: true
    }
  ]
}

export const Format = {
  app: "project-manager",
  type: "project",

  attributes: [
    { key: "name",
      type: "text",
      required: true
    },
    { key: "id",
      type: "text",
      required: true
    },
    { key: "version",
      type: "text",
      default: "1.0.0",
      verify: "^\\d+(?:[.]\\d+){0,2}$"
    },
    { key: "desc",
      type: "text"
    }
  ]
}
