import React from "react"

import { Link } from "react-router-dom"

import get from "lodash.get"
import { select as d3select } from "d3-selection"
import { transition as d3transition } from "d3-transition"

import { Button, useTheme } from "@availabs/avl-components"

// import { addInput } from "dms/wrappers/utils/get-dms-input"

// const SequenceInput = ({ value, onChange, domain }) => {
//
//   const index = domain.indexOf(value);
//
//   const advance = React.useCallback(() => {
//     if ((index + 1) < domain.length) {
//       onChange(domain[index + 1]);
//     }
//   }, [value, domain, index, onChange]);
//
//   const back = React.useCallback(() => {
//     if (index > 0) {
//       onChange(domain[index - 1]);
//     }
//   }, [value, domain, index, onChange]);
//
//   const theme = useTheme();
//
//   return (
//     <div className="py-1 flex">
//       <Button onClick={ back } disabled={ index === 0 }>
//         <span className="fa fa-caret-left"/>
//       </Button>
//       <Button onClick={ advance } className="ml-2">
//         { value }
//       </Button>
//     </div>
//   )
// }
//
// addInput("sequence", {
//   InputComp: SequenceInput,
//   getInputProps: (att, props) => ({ ...att.inputProps }),
//   getDisplayComp: (att, props) => null,
//   getEmptyValueFunc: (att, props) => null
// });

const ProjectsOverview = ({ columns, projects, makePmInteraction, dataItems, pmMember, ...props }) => {

  const toManageMembers = React.useMemo(() => {
    return makePmInteraction("dms:manage-members").to;
  }, [makePmInteraction]);

  const toManageStories = React.useMemo(() => {
    return makePmInteraction("dms:manage-stories").to;
  }, [makePmInteraction]);

  const theme = useTheme();

  const userProjects = dataItems.reduce((a, c) => {
    return get(c, ["data", "owner"], [])
      .includes(pmMember.id) ? [...a, c.data.project] : a;
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 max-w-6xl mx-auto">
        <Link className={ `
          rounded-lg ${ theme.menuBg } ${ theme.menuBgHover }
          ${ theme.menuText } ${ theme.menuTextHover }
          font-bold text-xl cursor-pointer transition col-span-1 p-4
        ` } to={ toManageMembers }>
          Manage Members
        </Link>
        <Link className={ `
          rounded-lg ${ theme.menuBg } ${ theme.menuBgHover }
          ${ theme.menuText } ${ theme.menuTextHover }
          font-bold text-xl cursor-pointer transition col-span-1 p-4
        ` } to={ toManageStories }>
          Manage Stories
        </Link>
        { projects
            .filter(p => pmMember.data.role === "admin" || userProjects.includes(p.data.id))
            .map(project =>
              <ProjectCard key={ project.id } { ...props }
                makePmInteraction={ makePmInteraction }
                pmMember={ pmMember }
                project={ project }/>
            )
        }
      </div>
    </div>
  )
}
export default ProjectsOverview;

const ProjectCard = ({ project, makePmInteraction, makePmOnClick, pmInteract, pmMember }) => {

  const toProjectView = React.useMemo(() => {
    return makePmInteraction("dms:view", project.id).to;
  }, [project.id, makePmInteraction]);

  const openProjectEdit = React.useMemo(() => {
    return makePmOnClick("dms:edit", project.id);
  }, [project.id, makePmOnClick]);

  const deleteProject = React.useCallback(e => {
    e.preventDefault();

    pmInteract("api:delete", project.id);
  }, [pmInteract, project]);

  const [exploderState, openExploder] = useExploder();

  const theme = useTheme();

  return (
    <Link to={ toProjectView }>
      <div className={ `
        rounded-lg ${ theme.menuBg } ${ theme.menuBgHover }
        ${ theme.menuText } ${ theme.menuTextHover }
        cursor-pointer transition col-span-1 p-4
      ` }>
        <div className="font-bold text-xl border-b-2 flex">
          <div className="flex-1">{ project.data.name }</div>
          <div>
            <div className={ `px-1 rounded hover:${ theme.textInfo }` }
              onClick={ openProjectEdit }>
              <span className="fa fa-cog"/>
            </div>
          </div>
          { pmMember.data.role !== "admin" ? null :
            <div>
              <div className={ `px-1 rounded hover:${ theme.textDanger }` }
                onClick={ openExploder }>
                <span className="fa fa-trash"/>
              </div>
            </div>
          }
        </div>
        <div className="mt-1">
          { project.data.desc || "HIGH SCORES HERE!!!" }

        </div>
      </div>
      <ExplodingModal { ...exploderState }>
        <div className={ `py-4 px-6 rounded ${ theme.bg } w-64` }>
          <div>
            Are you sure you want to delete project { project.data.name }?
          </div>
          <div className="mt-2 flex justify-end">
            <Button buttonTheme="buttonDanger" onClick={ deleteProject }>
              delete project
            </Button>
          </div>
        </div>
      </ExplodingModal>
    </Link>
  )
}

export const useExploder = () => {

  const [state, setState] = React.useState({ show: false, x: 0, y: 0 });

  const openExploder = React.useCallback(e => {
    e.stopPropagation();
    e.preventDefault();

    setState({ show: true, x: e.clientX, y: e.clientY });
  }, []);

  const onHide = React.useCallback(e => {
    e.stopPropagation();
    e.preventDefault();

    setState(prev => ({ ...prev, show: false }));
  }, []);

  return [{ ...state, onHide }, openExploder];
}

export const ExplodingModal = ({ show, onHide, x, y, children, ...props }) => {

  const outer = React.createRef(),
    inner = React.createRef();

  const [Show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (show && !Show) {
      const transition = d3transition().duration(500)
      d3select(outer.current)
        .style("background-color", "rgba(0, 0, 0, 0.0)")
        .transition(transition)
          .style("background-color", "rgba(0, 0, 0, 0.5)");

      d3select(inner.current)
        .style("left", `${ x }px`)
        .style("top", `${ y }px`)
        .style("transform",  `scale(0, 0)`)
        .transition(transition)
          .style("left", `${ window.innerWidth * 0.5 }px`)
          .style("top", `${ window.innerHeight * 0.5 }px`)
          .style("transform",  `scale(1, 1)`);

      setShow(show);
    }
    else if (!show && Show) {
      const transition = d3transition().duration(500)
      d3select(outer.current)
        .transition(transition)
          .style("background-color", "rgba(0, 0, 0, 0.0)")
          .end().then(() => setShow(false));

      d3select(inner.current)
        .transition(transition)
          .style("left", `${ x }px`)
          .style("top", `${ y }px`)
          .style("transform",  `scale(0, 0)`);
    }
  }, [Show, inner, outer, show, x, y]);

  const theme = useTheme();

  return (
    <div ref={ outer } className={ `
        fixed top-0 bottom-0 right-0 left-0 z-50 cursor-auto
      ` }
      style={ {
        display: Show ? "block" : "none"
      } } onClick={ onHide }>
      <div ref={ inner } className="inline-block absolute">
        <div className="absolute top-0 left-0"
          style={ { transform: "translate(-50%, -50%)" } }>
          <div className={ `
              top-0 left-0 absolute px-2 rounded cursor-pointer
              ${ theme.menuBg } ${ theme.menuText }
              ${ theme.menuBgHover } ${ theme.menuTextHover }
            ` }
            style={ { transform: "translate(-0.5rem, -0.5rem)" } }>
            <span className="fa text-lg fa-times"/>
          </div>
          <div>
            { children }
          </div>
        </div>
      </div>
    </div>
  )
}
