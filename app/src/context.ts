import { createContext } from "react";
import { type Node as FlowNode, type Edge as FlowEdge } from "reactflow";
import { RawFile } from "./types";

type InitialState = {
  initialNodes: FlowNode[]
  initialEdges: FlowEdge[]
}

type InitialStateContextType = {
  initialState: InitialState
  setInitialState: React.Dispatch<React.SetStateAction<InitialState>>
  helper: (viewType: string, rawFile: RawFile[]) => InitialState
}

type ViewTypeContextType = {
  viewType: string
  setViewType: React.Dispatch<React.SetStateAction<string>>
}

type LayoutedState = {
  isLayouted: boolean
  setIsLayouted: React.Dispatch<React.SetStateAction<boolean>>
}

export const InitialStateContext = createContext({} as InitialStateContextType);
export const ViewTypeStateContext = createContext({} as ViewTypeContextType);
export const IsLayoutedContext = createContext({} as LayoutedState);