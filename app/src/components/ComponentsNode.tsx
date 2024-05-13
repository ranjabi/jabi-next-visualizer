import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { Handle, Panel, Position, ReactFlowProvider, getNodesBounds, useEdgesState, useNodesState, useReactFlow, type Rect, type Node as FlowNode, type Edge as FlowEdge } from 'reactflow';
import Dagre from '@dagrejs/dagre';
import 'reactflow/dist/style.css';
import { RouteNodePayload } from '@/types';

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

type CustomNodeProps = {
  id: string
  bounds: Rect
  setBounds: React.Dispatch<React.SetStateAction<Rect>>
  initialNodes: FlowNode[],
  initialEdges: FlowEdge[]
}

const CustomNode = (props: CustomNodeProps) => {
  // if (props.id.includes('_document')) {
  //   console.log('node id:', props.id)
  //   console.log('custom node bounds:', props.bounds)
  // }
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const getLayoutedElements = (nodes: FlowNode[], edges: FlowEdge[], options: { direction: string }) => {
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    // @ts-ignore-next-line TODO: fix
    nodes.forEach((node) => g.setNode(node.id, node));

    Dagre.layout(g);

    return {
      nodes: nodes.map((node) => {
        const { x, y } = g.node(node.id);

        return { ...node, position: { x, y } };
      }),
      edges,
    };
  };

  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(props.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.initialEdges);
  const [layouted, setLayouted] = useState(false);
  const bounds = getNodesBounds(nodes);

  useEffect(() => {
    if (bounds.width !== 0 && bounds.height !== 0 && layouted) {
      props.setBounds(bounds)
    }
    // console.log('run on id:', props.id, bounds.width)
    // console.log('parentsize:', parentSize)
    // const newParentSize = parentSize.map(item => {
    //   if (item.id === props.id) {
    //     console.log('updating ', item.id, ' from ', item.width, ' to ', bounds.width)
    //     return {
    //       id: item.id,
    //       width: bounds.width,
    //       height: bounds.height
    //     }
    //   } else {
    //     return item
    //   }
    // })
  }, [nodes])

  const onLayout = useCallback(
    (direction: string) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

    },
    [nodes, edges]
  );

  useEffect(() => {
    if (!layouted) {
      const direction = 'TB'
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        { direction }
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      const allNodesInitialized = nodes.every(n => n.width);

      if (allNodesInitialized) {
        setLayouted(true)
      }
    }

  }, [nodes, edges])

  return (
    <ReactFlowProvider>
      <div style={{ height: props.bounds.height + (2 * props.bounds.y), width: props.bounds.width + (2 * props.bounds.x) }} >
        <ReactFlow
          nodesDraggable={false}
          panOnDrag={false}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          style={rfStyle}
        >
          <Panel position="bottom-right">
            <div>{JSON.stringify(bounds)}</div>
          </Panel>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

type CustomNodeWrapperProps = {
  data: RouteNodePayload
}

function CustomNodeWrapper(props: CustomNodeWrapperProps) {
  const [bounds, setBounds] = useState({
    x: 0,
    y: 0,
    width: 1,
    height: 1
  })

  return (
    <div className="text-updater-node" style={{ height: bounds.height + (2 * bounds.y), width: bounds.width + (2 * bounds.x) }}>
      <Handle type="target" position={Position.Top} id="target" />
      <div>
        <CustomNode id={props.data.id} bounds={bounds} setBounds={setBounds} initialNodes={props.data.initialNodes} initialEdges={props.data.initialEdges} />
      </div>
      <Handle type="source" position={Position.Bottom} id="source" />
    </div>
  );
}

export default CustomNodeWrapper