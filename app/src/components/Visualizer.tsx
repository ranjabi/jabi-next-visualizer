import { useEffect, useMemo } from 'react';
import ReactFlow, {
  Panel, useReactFlow, ReactFlowProvider
} from 'reactflow';
import CustomNode from "@/components/CustomNode";
import ELK from 'elkjs/lib/elk.bundled.js';
import 'reactflow/dist/style.css';
import useStore, { selector } from '../store';
import { useShallow } from 'zustand/react/shallow';
import Sidebar from './Sidebar';

const defaultOptions = {
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
  const { nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges, isLayouted, setIsLayouted, viewType } = useStore(
    useShallow(selector),
  );

  const { fitView } = useReactFlow();
  const getLayoutedElements = (elk, nodes, edges, setNodes) => {

    const layoutOptions = { ...defaultOptions };
    const graph = {
      id: 'root',
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
          return { ...node, width: 150, height: 40 }
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

    elk.layout(graph, globalOptions).then(({ children }) => {
      children?.forEach((node) => {
        node.position = { x: node.x, y: node.y };
      });

      setNodes(children);
      // window.requestAnimationFrame(() => {
      //   fitView();
      // });
    });
  }

  useEffect(() => {
    if (!isLayouted && nodes.length > 1 && edges.length > 1) {
      console.log('layouted effect jalan')
      getLayoutedElements(elk, nodes, edges, setNodes)

      if (nodes.filter(n => n.data.isShowComponents && !n.id.includes('root') && !n.id.includes('posts')).every(n => n.width === (n.data.componentsViewBounds?.width + 2 * n.data.componentsViewBounds?.x) && n.height === n.data.componentsViewBounds?.height + n.data.componentsViewBounds?.y * 2)) {
        setIsLayouted(true)
        console.log('layouted')
      }
    }

  }, [nodes, edges])

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
        minZoom={0.001}
        style={{
          background: '#008080'
        }}
      >
        <Panel position="top-right">
          <button className='border border-solid border-black mx-1' >view type: {viewType}</button>
          <button className='border border-solid border-black mx-1' onClick={() => {
            getLayoutedElements(elk, nodes, edges, setNodes)
          }
          }>Layout</button>
        </Panel>
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
