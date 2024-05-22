import { useEffect, useMemo } from 'react';
import ReactFlow, {
  Panel, useReactFlow, ReactFlowProvider,
  Node,
  Edge
} from 'reactflow';
import CustomNode from "@/components/CustomNode";
import ELK, { type ELK as ELKType } from 'elkjs/lib/elk.bundled.js';
import 'reactflow/dist/style.css';
import useStore, { selector } from '../store';
import { useShallow } from 'zustand/react/shallow';
import Sidebar from './Sidebar';
import { NodePayload } from '@/types';

const layoutOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': 100,
  'elk.spacing.nodeNode': 80,
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.direction': 'DOWN'
};

type VisualizeProps = {
}

function Visualizer(props: VisualizeProps) {
  const elk = new ELK();
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const { nodes, edges, onNodesChange, onEdgesChange, setNodes, isLayouted, setIsLayouted, viewType, focusId, setFocusId, isNeedToFit, setIsNeedToFit, routeNodeSize } = useStore(
    useShallow(selector),
  );
  const { fitView } = useReactFlow();
  
  const getLayoutedElements = (elk: ELKType, nodes: Node<NodePayload>[], edges: Edge[], setNodes: (nodes: Node[]) => void, isNeedToFit: boolean) => {
    const graph = {
      id: 'graph',
      layoutOptions: layoutOptions,
      children: nodes.map(node => {
        if (node.data.isShowComponents) {
          if (node.data.componentsViewBounds) {
            const x = node.data.componentsViewBounds.x
            const y = node.data.componentsViewBounds.y
            const width = node.data.componentsViewBounds.width
            const height = node.data.componentsViewBounds.height

            return { ...node, width: width + (2 * x), height: height + (2 * y) }
          }
          return node
        } else {
          return { ...node, width: routeNodeSize.width , height: routeNodeSize.height }
        }
      }
      ),
      edges: edges,
    };

    const globalOptions = {
      layoutOptions: {
        'elk.alignment': 'TOP'
      }
    }

    // @ts-ignore
    elk.layout(graph, globalOptions).then(({ children }) => {
      children?.forEach((node) => {
        // @ts-ignore
        node.position = { x: node.x, y: node.y };
      });

      if (children) {
        setNodes(children as Node[]);
      }

      if (isNeedToFit) {
        window.requestAnimationFrame(() => {
          fitView();
        });
      }
    });
  }

  useEffect(() => {
    if (!isLayouted && nodes.length > 1 && edges.length > 1) {
      getLayoutedElements(elk, nodes, edges, setNodes, isNeedToFit)

      // route node only need 1 pass for layouting, hence it will immediately set isLayouted to true even though it doesn't meet the if condition
      if (
        nodes
        .filter(
          n => n.data.isShowComponents && n.data.isLeaf
        )
        .every(
          n => n.data.componentsViewBounds
          && n.width === (n.data.componentsViewBounds?.width + (2 * n.data.componentsViewBounds?.x)) 
          && n.height === (n.data.componentsViewBounds?.height + (2 * n.data.componentsViewBounds?.y))
        )
      ) {
        setIsLayouted(true)
        setIsNeedToFit(false)
      }
    }

  }, [nodes, edges])

  useEffect(() => {
    if (focusId) {
      fitView({ nodes: [{ id: focusId }], duration: 500 });
      setFocusId(null);
    }
  }, [focusId, fitView]);

  return (
    <div className='h-[100vh] w-[calc(100vw - 300px] flex'>
      <Sidebar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        // fitView
        minZoom={0.1}
        style={{
          background: '#008080'
        }}
      >
        {/* <Panel position="top-right">
          <button className='border border-solid border-black mx-1' onClick={() => {
            getLayoutedElements(elk, nodes, edges, setNodes)
          }
          }>Layout</button>
        </Panel> */}
      </ReactFlow>

    </div>
  );
}

type VisualizerWrapperProps = {
}

export default function VisualizerWrapper(props: VisualizerWrapperProps) {
  return (
    <ReactFlowProvider>
      <Visualizer />
    </ReactFlowProvider>
  )
}
