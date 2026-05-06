import { useSyncExternalStore } from "react";
import { mockAssets, mockRequests, mockEmployees, mockTasks } from "./asset-data";

type Asset = typeof mockAssets[number];
type Request = typeof mockRequests[number];
type Task = typeof mockTasks[number];
type Employee = typeof mockEmployees[number];

type State = {
  assets: Asset[];
  requests: Request[];
  tasks: Task[];
  employees: Employee[];
  query: string;
};

let state: State = {
  assets: [...mockAssets],
  requests: [...mockRequests],
  tasks: [...mockTasks],
  employees: [...mockEmployees],
  query: "",
};

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const emit = () => listeners.forEach((l) => l());
const getSnapshot = () => state;

export const store = {
  setAssets: (fn: (a: Asset[]) => Asset[]) => { state = { ...state, assets: fn(state.assets) }; emit(); },
  setRequests: (fn: (r: Request[]) => Request[]) => { state = { ...state, requests: fn(state.requests) }; emit(); },
  setTasks: (fn: (t: Task[]) => Task[]) => { state = { ...state, tasks: fn(state.tasks) }; emit(); },
  setEmployees: (fn: (e: Employee[]) => Employee[]) => { state = { ...state, employees: fn(state.employees) }; emit(); },
  setQuery: (q: string) => { state = { ...state, query: q }; emit(); },
};

export const useAppStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
