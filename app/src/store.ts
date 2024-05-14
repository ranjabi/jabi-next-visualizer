import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  Rect,
} from 'reactflow';
import { RouteNodePayload } from './types';

export type RFState = {
  nodes: Node<RouteNodePayload>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  isLayouted: boolean;
  // setIsLayouted: (fn: (prev: boolean) => boolean) => void;
  setIsLayouted: (isLayouted: boolean) => void;
  viewType: string;
  setViewType: (viewType: string) => void;
  setNodeViewToShowComponents: (nodeId: string) => void;
  setNodeViewToShowRoute: (nodeId: string) => void;
  selectedNode: Node<RouteNodePayload> | undefined
  setSelectedNode: (nodeId: string) => void
  setComponentsViewBounds: (nodeId: string, bounds: Rect | undefined) => void
  rawFile: any
  setRawFile: (rawFile: any) => void
  setAllRoute: () => void
  setAllComponents: () => void
};

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  isLayouted: false,
  setIsLayouted: (isLayouted: boolean) => {
    set({ isLayouted });
  },
  // setIsLayouted: (fn: (prev: boolean) => boolean) => {
  //   set((state => ({ isLayouted: fn(state.isLayouted) })));
  // },
  viewType: 'route',
  setViewType: (viewType: string) => {
    set({ viewType })
  },
  setNodeViewToShowComponents: (nodeId: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            isShowComponents: true,
          }

          node.position.x = 0
          node.position.y = 0

          return {
            ...node,
            width: 2,
            height: 2,
          };
        }

        // node.width = 2
        // node.height = 2
        node.position.x = 0
        node.position.y = 0

        return node;
      }),
    });
  },
  setNodeViewToShowRoute: (nodeId: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            isShowComponents: false,
          }

          node.position.x = 0
          node.position.y = 0

          return {
            ...node,
            width: 150,
            height: 40,

          };
        }

        node.position.x = 0
        node.position.y = 0

        return node;
      }),
    });
  },
  selectedNode: undefined,
  setSelectedNode: (nodeId: string) => {
    set({ selectedNode: get().nodes.find(n => n.id === nodeId) })
  },
  setComponentsViewBounds: (nodeId: string, bounds: Rect | undefined) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            componentsViewBounds: bounds
          }
          console.log('set bounds for', node.id, 'to', bounds)

          return {
            ...node,
            // width: bounds.width,
            // height: bounds.height,
          };
        }

        return node;
      }),
    });
  },
  rawFile: [],
  setRawFile: (rawFile) => {
    set({ rawFile })
  },
  setAllRoute: () => {
    set({
      nodes: get().nodes.map(node => {
        node.data = {
          ...node.data,
          isShowComponents: false,
        }

        // node.position.x = 0
        // node.position.y = 0

        return node
      })
    })
  },
  setAllComponents: () => {
    set({
      nodes: get().nodes.map(node => {
        node.data = {
          ...node.data,
          isShowComponents: true,
        }

        // node.position.x = 0
        // node.position.y = 0
        // node.width = 150
        // node.height = 40

        return node
        // return node
      })
    })
  }
}));

export default useStore;
