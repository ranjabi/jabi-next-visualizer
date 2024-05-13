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
} from 'reactflow';

export type RFState = {
  nodes: Node[];
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
          return {
            ...node,
            width: 2,
            height: 2,
            data: {
              ...node.data, 
              isShowComponents: true,
            }
          };
        }

        return node;
      }),
    });
  }
}));

export default useStore;
