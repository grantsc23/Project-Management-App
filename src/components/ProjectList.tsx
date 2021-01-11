import moment from 'moment';
import * as React from 'react';
import { useEffect } from "react";
import { Badge, Container, Table } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useDispatch, useSelector } from "react-redux";
import { AppState, history } from "../store";
import { EmptyList, EProjectList, IProjectLoader, ITask, ITaskLoader, LoadStaticProjects, LoadStaticTasks } from "../store/reducers/projectList";

const PROJECT_LOADER: IProjectLoader = new LoadStaticProjects();
const TASK_LOADER: ITaskLoader = new LoadStaticTasks();


const ProjectList: React.FC = () => {
    const dispatch = useDispatch();
    const { projects, tasks } = useSelector((state: AppState) => state.projectList);
  
    useEffect(() => {
      const load = async () => {
        let projects = await PROJECT_LOADER.load();
        let tasks: Array<ITask> = [];
  
        for(let i = 0; i < projects.length; i++) {
          tasks = [...tasks, ...await TASK_LOADER.load(projects[i].ID)];
        }
        
        dispatch({ type: EProjectList.SET_PROJECT_LIST, payload: projects });
        dispatch({ type: EProjectList.SET_TASK_LIST, payload: tasks });
      };
      load();
    }, [dispatch]);
    
    return (
      <React.Fragment>
        <Container>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Project</th>
                <th>Scope</th>
                <th>Due By</th>
                <th>Priority</th>
                <th>Tasks</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((pro, key) => {
                const projectTasks = tasks.filter(t => t.ProjectID === pro.ID);
                let percentage = 0;
                
                projectTasks.map(task => {
                  percentage += task.Progress;
                });
                percentage = Math.round(percentage / projectTasks.length);
                
                return (
                  <tr key={key} onClick={() => history.push('/view-project?id=' + pro.ID)}>
                    <td>{pro.ProjectTitle}</td>
                    <td>{pro.Scope}</td>
                    <td>{moment(pro.DueBy).format("DD-MMM-YYYY")}</td>
                    <td>{pro.Priority}</td>
                    <td><Badge variant="secondary">{projectTasks.length}</Badge></td>
                    <td><CircularProgressbar value={percentage} text={percentage + "%"} styles={{ root: { height: 50, width: 50 } }} /></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </React.Fragment>
    );
  }
export default ProjectList;  