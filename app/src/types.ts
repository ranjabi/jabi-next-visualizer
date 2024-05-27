import {
  type Node as FlowNode,
  type Edge as FlowEdge,
  Rect,
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
  data: NodePayload
  url: string
}

export type NodePayload = {
  id: string
  label: string
  fileName: string
  initialNodes: FlowNode[]
  initialEdges: FlowEdge[]
  style: {
    bgColor: string
    color: string
  }
  isShowComponents: boolean
  componentsViewBounds: Rect | undefined
  isLeaf: boolean
  isHidden: boolean
}

export type StyledComponents = {
  [declarationName: string]: string
}