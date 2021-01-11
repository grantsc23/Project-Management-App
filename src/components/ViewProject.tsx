import moment from 'moment';
import * as React from 'react';
import { useEffect } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import Chart from 'react-google-charts';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../store';
import { EmptyList, IProjectLoader, ITask, ITaskLoader, ITaskSaver, LoadStaticProjects, LoadStaticTasks, StaticTaskSaver } from '../store/reducers/projectList';
import { EViewProject } from '../store/reducers/viewProject';


const FORM_DATE_INPUT = "YYYY-MM-DD";

const PROJECT_LOADER: IProjectLoader = new EmptyList();
const TASK_LOADER: ITaskLoader = new LoadStaticTasks();
const TASK_SAVER: ITaskSaver = new StaticTaskSaver();



// the following gets query string value by name from url:
function queryStringItem(name: string, url: string = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


const ViewProject: React.FC = () => {
    const dispatch = useDispatch();
    const { project, tasks, selectedTask } = useSelector((state: AppState) => state.viewProject);
  
    useEffect(() => {
      const load = async () => {
        const projectId = queryStringItem('id') || "0";
        const projects = await PROJECT_LOADER.load();
        const project = projects.filter(p => p.ID.toString() === projectId)[0];
        const tasks = await TASK_LOADER.load(project.ID);
  
        dispatch({ type: EViewProject.SET_PROJECT, payload: project });
        dispatch({ type: EViewProject.SET_TASKS, payload: tasks });
      };
  
      load();
    }, [dispatch]);
  
    if(!project) {
      return (<React.Fragment />);
    }
    
    const ganntData = [
      [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
      ],
      ...tasks.map(task => {
        const start = new Date(task.StartDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(task.EndDate);
        end.setHours(23, 59, 59, 0);
        return [
          task.ID,
          task.TaskName,
          task.TaskName,
          start,
          end,
          null,
          task.Progress,
          null,
        ];
      }),
    ];
  
    const taskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const task: Partial<ITask> | ITask = { ...selectedTask, ...Object.fromEntries(new FormData(e.target as any).entries()) };
      // change status based on progress:
      if(task?.Progress === 0) {
        task.Status = "Open";
      } else if (task && task.Progress !== undefined && task.Progress > 0 && task.Progress < 100) {
        task.Status = "In Process";
      } else if (task?.Progress === 100) {
        task.Status = "Completed";
      }
      if(task) {
        const tasks = await TASK_SAVER.save(task);
        dispatch({ type: EViewProject.SET_TASKS, payload: tasks.filter(t => t.ProjectID === project.ID) });
      }
      dispatch({ type: EViewProject.SET_SELECTED_TASK, payload: undefined });
    };
  
    const addNewTask = () => {
      const selectedTask: Partial<ITask> = {
        ID: 0,
        RStatus: "Active",
        Progress: 0,
        Status: "Open",
        ProjectID: project.ID,
      };
  
      dispatch({ type: EViewProject.SET_SELECTED_TASK, payload: selectedTask });
    }
    
  
    return (
      <React.Fragment>
        <Container id="project_details" fluid className="m-2">
          <h3 className="title">{project.ProjectTitle}</h3>
          <Card className="p-2">
            <Row>
              <Col>
                <Form.Group as={Row}>
                  <Form.Label column sm={2}>Project Title: </Form.Label>
                  <Col sm={10}>
                    <Form.Control name="ProjectTitle" type="text" defaultValue={project.ProjectTitle} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={2}>Due By: </Form.Label>
                  <Col sm={10}>
                    <Form.Control name="DueBy" type="date" defaultValue={moment(project.DueBy).format(FORM_DATE_INPUT)} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={2}>Priority: </Form.Label>
                  <Col sm={10}>
                    <Form.Control name="Priority" as="select" defaultValue={project.Priority}>
                      <option></option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={2}>System: </Form.Label>
                  <Col sm={10}>
                    <Form.Control name="System" type="text" defaultValue={project.System} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={2}>Ownership: </Form.Label>
                  <Col sm={10}>
                    <Form.Control name="Ownership" as="select" defaultValue={project.Ownership}>
                      <option></option>
                      <option>CIC</option>
                      <option>IS</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Scope: </Form.Label>
                  <Form.Control name="Scope" as="textarea" rows={11} defaultValue={project.Scope} />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <br />
          <br />
          <Container fluid style={{ display: "block" }}>
            <br />
            <br />
            <div className="text-right p-1">
              <Button variant="dark" size="sm" onClick={addNewTask}>Add</Button>
            </div>
            <Chart
              width={'100%'}
              height={'300px'}
              chartType="Gantt"
              loader={<div>Loading Chart</div>}
              chartEvents={[
                {
                  eventName: "ready",
                  callback: function (masterEvent) {
                    masterEvent.google.visualization.events.addListener(masterEvent.chartWrapper, "select", (event) => {
                      const selection = event.getSelection()[0];
                      const task = tasks[selection.row];
                      dispatch({ type: EViewProject.SET_SELECTED_TASK, payload: task });
                    });
                  }
                }
              ]}
              data={ganntData}
              options={{
                height: 400,
                gantt: {
                  trackHeight: 30,
                },
              }}
              rootProps={{ 'data-testid': '2' }}
            />
          </Container>
        </Container>
        <br />
        <br />
        <br />
        <br />
        <Modal show={selectedTask !== undefined} size="lg" centered>
          <Form onSubmit={taskSubmit}>
            <Modal.Header>
              <Modal.Title>{selectedTask?.TaskName || "New Task"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Task Name: </Form.Label>
                <Col sm={10}>
                  <Form.Control name="TaskName" type="text" defaultValue={selectedTask?.TaskName} />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Start Date: </Form.Label>
                <Col sm={10}>
                  <Form.Control name="StartDate" type="date" defaultValue={moment(selectedTask?.StartDate).format(FORM_DATE_INPUT)} />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>End Date: </Form.Label>
                <Col sm={10}>
                  <Form.Control name="EndDate" type="date" defaultValue={moment(selectedTask?.EndDate).format(FORM_DATE_INPUT)} />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Progress: </Form.Label>
                <Col sm={10}>
                  <Form.Control name="Progress" type="range" defaultValue={selectedTask?.Progress} onChange={(e) => dispatch({ type: EViewProject.SET_SELECTED_TASK_PROGRESS, payload: e.target.value })} />
                  <div className="text-right">{selectedTask?.Progress || 0}</div>
                </Col>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="default" onClick={() => dispatch({ type: EViewProject.SET_SELECTED_TASK, payload: undefined })}>Cancel</Button>
              <Button variant="dark" type="submit">Save</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }


  export default ViewProject;