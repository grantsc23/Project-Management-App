import { PayloadAction } from "..";

let COUNT = 20;
export interface IProject {
    ID: number;
    ProjectTitle: string;
    DueBy: Date;
    Priority: "Low" | "Medium" | "High" | "Very High";
    System: string;
    Ownership: "CIC" | "IS";
    DepartmentResponsible: string;
    ManagerResponsible: string;
    BusinessPlan: boolean;
    Scope: string;
    ProjectType: "Project" | "AMS";
    RStatus: string;
}

export interface ITask {
    ID: number;
    TaskName: string;
    StartDate: Date;
    EndDate: Date;
    EmployeeResponsible: string;
    ProjectID: number;
    Status: "Open" | "In Process" | "Completed";
    Progress: number;
    RStatus: "Inactive" | "Active";
}

const projectList = () => {
    let projects: Array<IProject> = [];
    let tasks: Array<ITask> = [];

    return {
        projects: projects,
        tasks: tasks,
    };
}

export enum EProjectList {
    SET_PROJECT_LIST = "SET_PROJECT_LIST",
    SET_TASK_LIST = "SET_TASK_LIST",
}

function projectListReducer(state = projectList(), action: PayloadAction<EProjectList>): ReturnType<typeof projectList> {
    switch(action.type) {
        case EProjectList.SET_PROJECT_LIST:
            return { ...state, projects: action.payload };
        case EProjectList.SET_TASK_LIST:
            return { ...state, tasks: action.payload };
        default:
            return state;
    }
}

export default projectListReducer;


export interface IProjectLoader {
    load: () => Promise<Array<IProject>>;
}

export interface ITaskLoader {
    load: (projectId: number) => Promise<Array<ITask>>;
}

export interface ITaskSaver {
    save(task: Partial<ITask>): Promise<Array<ITask>>;
}

export interface ITaskRemove {
    remove(task: ITask): Promise<Array<ITask>>;
}

export class StaticTaskRemove implements ITaskRemove {
    async remove(task: ITask): Promise<ITask[]> {
        const index = TASKS.indexOf(TASKS.filter(t => t.ID === task.ID)[0]);
        return TASKS.filter((t, i) => i !== index);
    }

}

export class StaticTaskSaver implements ITaskSaver {
    async save(task: Partial<ITask>): Promise<Array<ITask>> {
        if(task.ID === 0) {
            task.ID = COUNT++;
            TASKS.push(task as ITask);
        } else {
            const index = TASKS.indexOf(TASKS.filter(t => t.ID === task.ID)[0]);
            TASKS[index] = { ...TASKS[index], ...task as ITask };
        }

        return TASKS;
    }
}

const PROJECTS: Array<IProject> = [
    {   ID: 296, ProjectTitle: 'MyCIC Training Assessment', DueBy: new Date(2020, 8, 1), ProjectType: "Project", System: "MyCIC", 
        Ownership: "CIC", DepartmentResponsible: "QA", ManagerResponsible: "Lerenzo Francis", BusinessPlan: false, 
        Scope: `An online training assessment is needed in order to test the knowledge of the training that was attended.`,
        RStatus: "Active", Priority: "Medium"
    },
    {   ID: 297, ProjectTitle: 'CEM Dealer Data Quality', DueBy: new Date(2020, 0, 31), ProjectType: "Project", System: "SAP CRM", 
        Ownership: "IS", DepartmentResponsible: "CIC Direct", ManagerResponsible: "Rudi Bosch", BusinessPlan: false, 
        Scope: `The purpose of the project is to call a sample size dealers who are not signed up for the Service follow-up calls to test the data quality.`,
        RStatus: "Active", Priority: "High"
    },
];
const TASKS: Array<ITask> = [
    {
        ID: 7, TaskName: "Demo Final Script", StartDate: new Date(2016, 10, 22), EndDate: new Date(2016, 10, 22), EmployeeResponsible: '',
        ProjectID: 5, Status: 'Completed', Progress: 100, RStatus: "Active"
    },
    {
        ID: 8, TaskName: "Training Handover", StartDate: new Date(2020, 10, 22), EndDate: new Date(2020, 10, 22), EmployeeResponsible: '',
        ProjectID: 5, Status: 'Completed', Progress: 100, RStatus: "Active"
    },
    {
        ID: 3084, TaskName: "Create Specification Document", StartDate: new Date(2020, 1, 13), EndDate: new Date(2020, 1, 21), EmployeeResponsible: 'Lerenzo Francis',
        ProjectID: 296, Status: 'Completed', Progress: 100, RStatus: "Active"
    },
    {
        ID: 3085, TaskName: "Development Brief", StartDate: new Date(2020, 1, 21), EndDate: new Date(2020, 1, 21), EmployeeResponsible: 'Lerenzo Francis',
        ProjectID: 296, Status: 'Completed', Progress: 100, RStatus: "Active"
    },
    {
        ID: 3098, TaskName: "Dealer Data Quality Call - Sample Size", StartDate: new Date(2019, 12, 6), EndDate: new Date(2019, 12, 6), EmployeeResponsible: 'Jaun Lombard',
        ProjectID: 297, Status: 'Completed', Progress: 100, RStatus: "Active"
    },
    {
        ID: 3099, TaskName: "Approve Call Script SAP CMT", StartDate: new Date(2019, 12, 6), EndDate: new Date(2019, 12, 6), EmployeeResponsible: 'Rudi Bosch',
        ProjectID: 297, Status: 'Completed', Progress: 100, RStatus: "Active"
    },
    {
        ID: 3100, TaskName: "Training Handover", StartDate: new Date(2019, 12, 9), EndDate: new Date(2019, 12, 9), EmployeeResponsible: 'Jackie Crause',
        ProjectID: 297, Status: 'Completed', Progress: 100, RStatus: "Active"
    },
];


export class LoadStaticProjects implements IProjectLoader {
    load: () => Promise<IProject[]> = async () => {
        return PROJECTS;
    }
}


export class EmptyList implements IProjectLoader {
    load: () => Promise<IProject[]>  = async () => {
        return [];
    }

}


export class LoadStaticTasks implements ITaskLoader {
    load: (projectId: number) => Promise<ITask[]> = async (projectId: number) => {        
        return TASKS.filter(t => t.ProjectID === projectId);
    }

}