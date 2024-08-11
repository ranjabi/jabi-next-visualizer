// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import ReactFlow, { Handle, Position, ReactFlowProvider, getNodesBounds, useEdgesState, useNodesState, useReactFlow, type Rect, type Node as FlowNode, type Edge as FlowEdge } from 'reactflow';
import Dagre from '@dagrejs/dagre';
import 'reactflow/dist/style.css';
import { NodePayload } from '@/types';
import useStore from '@/store';
import InnerComponentNode from './InnerComponentNode';

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

type ComponentNodeProps = {
  data: NodePayload
  bounds: Rect
  setBounds: (bounds: Rect) => void
}

const additionalHeight = 32

const ComponentNode = (props: ComponentNodeProps) => {
  const getLayoutedElements = (nodes: FlowNode[], edges: FlowEdge[], options: { direction: string }) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
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
  // for the first time, render non recursive view
  const [nodes, setNodes, onNodesChange] = useNodesState(props.data.initialNodes.filter(e => !e.id.startsWith('ext')));
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.data.initialEdges.filter(e => !e.id.startsWith('ext')));
  const [layouted, setLayouted] = useState(false);
  const bounds = getNodesBounds(nodes);
  const setComponentsViewBounds = useStore(state => state.setComponentsViewBounds)

  useEffect(() => {
    if (bounds.width !== 0 && bounds.height !== 0 && layouted) {
      props.setBounds({
        ...bounds,
      })
      setComponentsViewBounds(props.data.id, {
        ...bounds,
      })
    }
  }, [nodes])

  useEffect(() => {
    if (props.data.isRecursive) {
      setNodes(props.data.initialNodes)
      setEdges(props.data.initialEdges)
    } else {
      setNodes(props.data.initialNodes.filter(e => !e.id.startsWith('ext')))
      setEdges(props.data.initialEdges.filter(e => !e.id.startsWith('ext')))
    }
    setLayouted(false)
  }, [props.data.isRecursive])

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

  const nodeTypes = useMemo(() => ({ InnerComponentNode: InnerComponentNode }), []);

  return (
    <>
      <div className={`bg-white rounded-t pl-2 h-[${additionalHeight}px] flex items-center`}>
        <p>{props.data.label}</p>
      </div>
      <ReactFlowProvider>
        <div style={{ height: props.bounds.height + (2 * props.bounds.y), width: props.bounds.width + (2 * props.bounds.x) }} className={`absolute top-[${additionalHeight}px]`}>
          <ReactFlow
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            panOnDrag={false}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            style={rfStyle}
          >
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </>
  );
};

type ComponentNodeWrapperProps = {
  data: NodePayload
  bounds: Rect
  setBounds: React.Dispatch<React.SetStateAction<Rect>>
  handleClick: () => void
}

function ComponentNodeWrapper(props: ComponentNodeWrapperProps) {
  return (
    <div style={{ height: props.bounds.height + (2 * props.bounds.y) + additionalHeight, width: props.bounds.width + (2 * props.bounds.x) }} onClick={props.handleClick} className='relative'>
      <Handle type="target" position={Position.Top} id="target" />
      <ComponentNode {...props} />
      <Handle type="source" position={Position.Bottom} id="source" />
    </div>
  );
}

export default ComponentNodeWrapper