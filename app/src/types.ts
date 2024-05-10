import {
  type Node as FlowNode,
  type Edge as FlowEdge,
} from 'reactflow';

export type Ast = {
  id: string
  name: string
  children: Ast[]
}

export type Node = {
  id: string
  data: {
    label: string
  },
  position: {
    x: number
    y: number
  }
}

export type Edge = {
  id: string
  source: string
  target: string
  animated: boolean
}

export type RawFile = {
  name: string
  path: string
  content: ArrayBuffer | string | undefined | null
}

export type FileUpload = {
  name: string
  path: string
  content: ArrayBuffer | string | undefined | null
  nodes: Node[]
  edges: Edge[]
}

export type RouteNode = {
  id: string
  name: string
  path: string
  children: RouteNode[]
  data: RouteNodePayload
  url: string
}

export type RouteNodePayload = {
  id: string
  label: string
  initialNodes: FlowNode[]
  initialEdges: FlowEdge[]
  bgColor: string
  style: {
    backgroundColor: string
    color: string
  }
}
