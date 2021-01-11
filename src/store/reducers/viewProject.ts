import { PayloadAction } from "..";
import { IProject, ITask } from "./projectList";



export enum EViewProject {
    SET_PROJECT = "SET_PROJECT",
    SET_TASKS = "SET_TASKS",
    SET_SELECTED_TASK = "SET_SELECTED_TASK",
    SET_SELECTED_TASK_PROGRESS = "SET_SELECTED_TASK_PROGRESS",
}

const viewProject = () => {
    let project: IProject | undefined;
    let tasks: Array<ITask> = [];
    let selectedTask: ITask | undefined;

    return {
        project: project,
        tasks: tasks,
        selectedTask: selectedTask,
    };
}



function viewProjectReducer(state = viewProject(), action: PayloadAction<EViewProject>): ReturnType<typeof viewProject> {
    switch(action.type) {
        case EViewProject.SET_PROJECT:
            return { ...state, project: action.payload };
        case EViewProject.SET_TASKS:
            return { ...state, tasks: action.payload };
        case EViewProject.SET_SELECTED_TASK:
            return { ...state, selectedTask: action.payload };
        case EViewProject.SET_SELECTED_TASK_PROGRESS:
            return { ...state, selectedTask: (state.selectedTask ? { ...state.selectedTask, Progress: action.payload } : undefined) };
        default:
            return state;
    }
}

export default viewProjectReducer;