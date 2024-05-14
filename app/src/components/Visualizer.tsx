import { useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Panel, useReactFlow, ReactFlowProvider
} from 'reactflow';
import ComponentNode from "@/components/ComponentNode";
import CustomNode from "@/components/CustomNode";
import ELK, { ELK as ELKType } from 'elkjs/lib/elk.bundled.js';
import 'reactflow/dist/style.css';
import useStore, { RFState } from '../store';
import { useShallow } from 'zustand/react/shallow';
import Sidebar from './Sidebar';



// const useLayoutedElements = (elk, nodes, edges, setNodes) => {
  
//   const { fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
    'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    'elk.direction': 'DOWN'
  };

  

//   return { getLayoutedElements };
// };

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  isLayouted: state.isLayouted,
  setIsLayouted: state.setIsLayouted,
  viewType: state.viewType
});

type VisualizeProps = {
}

function Visualizer(props: VisualizeProps) {
  const elk = new ELK();
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const { nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges, isLayouted, setIsLayouted, viewType } = useStore(
    useShallow(selector),
  );

  const { fitView } = useReactFlow();
  // const { getLayoutedElements } = useLayoutedElements(elk, nodes, edges, setNodes);
  const getLayoutedElements = (elk, nodes, edges, setNodes) => {
    
    const layoutOptions = { ...defaultOptions };
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: nodes.map(n => {
        // console.log('node', n.data.id, n.data.isShowComponents)
        // console.log(n.data.componentsViewBounds)
        if (n.data.isShowComponents) {
          if (n.data.componentsViewBounds) {
            const x = n.data.componentsViewBounds.x
            const y = n.data.componentsViewBounds.y
            const width = n.data.componentsViewBounds.width
            const height = n.data.componentsViewBounds.height
            // console.log('use bounds for', n.id, width, height)
            return {...n, width: width + (2 * x), height: height + (2 * y)}
          }
          return {...n}
        } else {
          return {...n, width: 150, height: 40}
        }

        // return {...n}

        }
        // if (n.id.includes('kambing')) {
        //   console.log('bounds:', n.data.componentsViewBounds)
        // }
        // return n
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
  const [layouted, setLayouted] = useState(false);

  useEffect(() => {
    if (!isLayouted && nodes.length > 1 && edges.length > 1) {
      console.log('layouted effect jalan')
      getLayoutedElements(elk, nodes, edges, setNodes)

      if (nodes.filter(n => n.data.isShowComponents && !n.id.includes('root') && !n.id.includes('posts')).every(n => n.width === (n.data.componentsViewBounds?.width + 2 * n.data.componentsViewBounds?.x) && n.height === n.data.componentsViewBounds?.height + n.data.componentsViewBounds?.y * 2)) {
        setIsLayouted(true)
        console.log('layouted')
      }

      // if (nodes.every(n => n.width && n.width > 2 && n.height && n.height > 2 && n.position.x !== 0 && n.position.y !== 0)) {
      //   setIsLayouted(true)
      //   console.log('layouted')
      // }
    }

  }, [nodes, edges])

  // useEffect(() => {
  //   nodes.forEach(n => {
  //     // console.log('x:', n.position.x, 'y:', n.position.y, 'w:', n.width, 'h:', n.height)
  //     if (n.id.includes('kambing')) {
  //       console.log(n)
  //     }
  //   })
  //   console.log('------------')
  // }, [nodes])

  // useEffect(() => {
  //   console.log('is layouted CHANGED')
  //   getLayoutedElements()
  // }, [isLayouted])

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
            // nodes.forEach(n => {
            //   if (n.id.includes('kambing')) {
            //     console.log(n)
            //   }
            // })
            // console.log('------------')
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
