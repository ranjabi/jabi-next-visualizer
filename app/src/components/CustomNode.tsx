import useStore from '@/store';
import { RouteNodePayload } from '@/types';
import { useEffect, useState } from 'react';
import { Handle, NodeToolbar, Position } from 'reactflow';
import CustomNodeWrapper from './ComponentNode';
import RouteNode from './RouteNode';

type CustomNodeProps = {
  data: RouteNodePayload
}

export default function CustomNode(props: CustomNodeProps) {
  const setNodeViewToComponents = useStore(state => state.setNodeViewToShowComponents)
  const setSelectedNodeId = useStore(state => state.setSelectedNode)
  const selectedNode = useStore(state => state.selectedNode)
  const [bounds, setBounds] = useState({
    x: 0,
    y: 0,
    width: 150,
    height: 40
  })
  const setIsLayouted = useStore(state => state.setIsLayouted)
  const handleClick = () => {
    // setBounds(prev => {
    //   return {
    //   ...prev,
    //   width: prev.width * 1.5,
    //   height: prev.height * 1.5
    // }
    // })
    // setIsLayouted(false)
    // setNodeViewToComponents(props.data.id)
    setSelectedNodeId(props.data.id)
    console.log('clicked id:', props.data.id)
    console.log(selectedNode)
  }

  useEffect(() => {
    if (props.data.isShowComponents === false) {
      setBounds((prev) => {
        return {
          ...prev,
          width: 150,
          height: 40
        }
      })
    }
  }, [props.data.isShowComponents])

  const RouteView = (
    <RouteNode bounds={bounds} setBounds={setBounds} data={props.data} handleClick={handleClick} />
  )

  const ComponentView = (
    <CustomNodeWrapper data={props.data} bounds={bounds} setBounds={setBounds} />
  )

  return (
    <>
    {/* <NodeToolbar
        isVisible={true}
        position={Position.Top}
      >
        <button>cut</button>
        <button>copy</button>
        <button>paste</button>
      </NodeToolbar> */}
    {props.data.isShowComponents ? ComponentView : RouteView}
    </>
  );
}