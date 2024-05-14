import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { Handle, Panel, Position, ReactFlowProvider, getNodesBounds, useEdgesState, useNodesState, useReactFlow, type Rect, type Node as FlowNode, type Edge as FlowEdge } from 'reactflow';
import Dagre from '@dagrejs/dagre';
import 'reactflow/dist/style.css';
import { RouteNodePayload } from '@/types';
import useStore from '@/store';

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

type ComponentNodeProps = {
  id: string
  bounds: Rect
  setBounds: (bounds: Rect) => void
  initialNodes: FlowNode[]
  initialEdges: FlowEdge[]
}

const ComponentNode = (props: ComponentNodeProps) => {
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
  const setComponentsViewBounds = useStore(state => state.setComponentsViewBounds)

  useEffect(() => {
    if (bounds.width !== 0 && bounds.height !== 0 && layouted) {
      props.setBounds(bounds)
      // console.log('SET BOUNDSSSSSSSS', bounds)
      // console.log('s et view bounds for:', props.id, 'bounds:', bounds)
      setComponentsViewBounds(props.id, bounds)
    }

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
  bounds: Rect 
  setBounds: React.Dispatch<React.SetStateAction<Rect>>
}

function CustomNodeWrapper(props: CustomNodeWrapperProps) {

  return (
    <div style={{ height: props.bounds.height + (2 * props.bounds.y), width: props.bounds.width + (2 * props.bounds.x) }}>
      <Handle type="target" position={Position.Top} id="target" />
      <div>
        <ComponentNode id={props.data.id} bounds={props.bounds} setBounds={props.setBounds} initialNodes={props.data.initialNodes} initialEdges={props.data.initialEdges} />
      </div>
      <Handle type="source" position={Position.Bottom} id="source" />
    </div>
  );
}

export default CustomNodeWrapper