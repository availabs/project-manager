import { API_HOST } from "config"

import {
  Format,
  Story,
  Member
} from "./project-manager.format"

import ProjectManagerMain from "./ProjectManagerMain"
import ProjectsOverview from "./components/ProjectsOverview"
import ProjectView from "./components/ProjectView"
import MembersManager from "./components/MembersManager"
import StoriesOverview from "./components/StoriesOverview"

import { userPropsWrapper } from "./components/utils"

const ProjectManagerConfig = {
  type: ProjectManagerMain,
  wrappers: [
// wrapper order is important
// from index zero to i, higher index wrappers send props into lower index wrappers
// higher index wrappers do not see props from lower index wrappers
    "dms-manager",
    { type: "dms-provider",
      options: {
        imgUploadUrl: `${ API_HOST }/img/new`
      }
    },
    "dms-router",
    "show-loading",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format: Format,
    title: "Project Manager"
  },
  children: [
    { type: "dms-header" },

    { type: "dms-content",
      props: {
        dmsAction: "list",
        className: "w-full h-full flex-1"
      },
      wrappers: [
        { type: "dms-share",
          options: {
            propsToShare: {
              projects: "dataItems",
              makePmInteraction: "makeInteraction",
              makePmOnClick: "makeOnClick",
              pmInteract: "interact"
            }
          }
        }
      ],
      children: [
        { type: ProjectsOverview,
          props: { format: Story },
          wrappers: [
            userPropsWrapper,
            "dms-provider",
            "dms-falcor",
            "with-auth"
          ]
        }
      ]
    },

    { type: "dms-create",
      props: { dmsAction: "create" },
      wrappers: ["with-auth"]
    },
    { type: "dms-edit",
      props: { dmsAction: "edit" },
      wrappers: ["with-auth"]
    },

    { type: "dms-content",
      props: {
        dmsAction: "view",
        className: "w-full h-full flex-1"
      },
      wrappers: [
        { type: "dms-share",
          options: {
            propsToShare: {
              project: "item"
            }
          }
        }
      ],
      children: [
        { type: ProjectView,
          wrappers: [
            userPropsWrapper,
            "show-loading",
            "dms-provider",
            "dms-falcor",
            "with-auth"
          ],
          props: { format: Story }
        }
      ]
    },

    { type: "dms-content",
      props: {
        dmsAction: "manage-members",
        className: "w-full h-full flex-1"
      },
      children: [
        { type: MembersManager,
          props: { format: Member },
          wrappers: [
            userPropsWrapper,
            "show-loading",
            "dms-provider",
            "dms-falcor",
            "with-auth"
          ]
        }
      ]
    },

    { type: "dms-content",
      props: {
        dmsAction: "manage-stories",
        className: "w-full h-full flex-1"
      },
      wrappers: [
        { type: "dms-share",
          options: {
            propsToShare: {
              projects: "dataItems",
              pmInteract: "interact"
            }
          }
        }
      ],
      children: [
        { type: StoriesOverview,
          props: { format: Story },
          wrappers: [
            userPropsWrapper,
            "dms-provider",
            "dms-falcor",
            "with-auth"
          ]
        }
      ]
    }

  ]
}
export default ProjectManagerConfig;
