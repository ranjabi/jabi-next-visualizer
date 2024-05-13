import useStore from '@/store';
import { RouteNodePayload } from '@/types';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';

type CustomNodeProps = {
  data: RouteNodePayload
}

export default function RouteNode(props: CustomNodeProps) {
  const setNodeViewToComponents = useStore(state => state.setNodeViewToShowComponents)
  const [width, setWidth] = useState(150)
  const [height, setHeight] = useState(46)
  const setIsLayouted = useStore(state => state.setIsLayouted)
  const handleClick = () => {
    // setWidth(prev => prev * 2)
    // setHeight(prev => prev * 2)
    // setIsLayouted(false)
    setNodeViewToComponents(props.data.id)
    console.log('clicked id:', props.data.id)
  }

  return (
    <div style={{
      border: '1px solid #1a192b',
      padding: '10px',
      borderRadius: '3px',
      background: props.data.style.bgColor,
      width: width,
      height: height,
      textAlign: 'center'
    }} onClick={handleClick}>
      <Handle type="target" position={Position.Top} />
      <p>{props.data.label} {props.data.isShowComponents === true ? 'true' : 'false'}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}