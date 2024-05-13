import { useCallback, useContext, useEffect, useState } from 'react';
import ReactFlow, {
  Panel, useReactFlow, ReactFlowProvider
} from 'reactflow';
import ComponentsNode from "@/components/ComponentsNode";
import RouteNode from "@/components/RouteNode";
import ELK, { ELK as ELKType } from 'elkjs/lib/elk.bundled.js';
import 'reactflow/dist/style.css';
import { IsLayoutedContext, ViewTypeStateContext } from '@/context';
import useStore, { RFState } from '../store';
import { useShallow } from 'zustand/react/shallow';

const nodeTypes = { route: RouteNode, component: ComponentsNode };



const useLayoutedElements = (elk: ELKType) => {
  // console.log('elk run')
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
    'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    'elk.direction': 'DOWN'
  };

  const getLayoutedElements = useCallback(() => {

    const layoutOptions = { ...defaultOptions };
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: getNodes(),
      edges: getEdges(),
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
      window.requestAnimationFrame(() => {
        fitView();
      });
    });
  }, []);

  return { getLayoutedElements };
};

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges
});

type VisualizeProps = {
}

function Visualizer(props: VisualizeProps) {
  const elk = new ELK();
  const { nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges } = useStore(
    useShallow(selector),
  );
  const { fitView } = useReactFlow();
  const { viewType, setViewType } = useContext(ViewTypeStateContext)
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialState.initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialState.initialEdges);
  const { getLayoutedElements } = useLayoutedElements(elk);
  const [layouted, setLayouted] = useState(false);
  const { isLayouted, setIsLayouted } = useContext(IsLayoutedContext)

  useEffect(() => {
    console.log('node changes in layout effect')
    if (!isLayouted && nodes.length > 1 && edges.length > 1) {
      // console.log('node:', nodes)
      // console.log('edge:', edges)
      getLayoutedElements()
      // nodes.forEach(n => {
      //   console.log('id:', n.id)
      //   console.log('w:', n.width)
      //   console.log('h:', n.height)
      // })
      // console.log('------------')

      if (nodes.every(n => n.width && n.width !== 2 && n.height && n.height !== 2)) {
        setIsLayouted(true)
        console.log('layouted')

      }
      // window.requestAnimationFrame(() => {
      //   fitView();
      // });
    }

  }, [nodes, edges])

  // WORKED
  // useEffect(() => {
  //   setNodes(initialState.initialNodes)
  //   setEdges(initialState.initialEdges)
  //   setLayouted(false)
  // }, [initialState])

  const handleViewType = () => {
    // if (viewType === 'route') {
    //   setViewType('component')
    //   setInitialState(helper('component'))
    // } else if (viewType === 'component') {
    //   setViewType('route')
    //   setInitialState(helper('route'))
    // }
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        // fitView
        style={{
          background: '#008080'
        }}
      >
        <Panel position="top-right">
          <button className='border border-solid border-black mx-1' onClick={handleViewType}>view type: {viewType}</button>
          <button className='border border-solid border-black mx-1' onClick={() => {
            getLayoutedElements()
            console.log('elk run onclick')
          }
          }>vertical layout</button>
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
