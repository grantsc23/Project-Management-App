import { combineReducers, createStore, applyMiddleware, compose, Action } from "redux";
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import projectListReducer from "./reducers/projectList";
import viewProjectReducer from "./reducers/viewProject";


const root = {
    projectList: projectListReducer,
    viewProject: viewProjectReducer,
};


export const history = createBrowserHistory({ basename: '/' });
const router = connectRouter(history);
const rootReducer = combineReducers({ ...root, router: router });
const middlewares = [routerMiddleware(history)];


const store = createStore(rootReducer, {} as any, compose(applyMiddleware(...middlewares), ...[]));
store.subscribe(() => console.log(store.getState()));

export default store;

export type AppState = ReturnType<typeof rootReducer>;
export type PayloadAction<E = any> = { payload: any } & Action<E>;