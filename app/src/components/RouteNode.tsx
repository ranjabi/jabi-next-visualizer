import { IsLayoutedContext } from '@/context';
import { RouteNodePayload } from '@/types';
import { useContext, useState } from 'react';
import { Handle, Position } from 'reactflow';
 
type RouteNodeProps = {
  data: RouteNodePayload
}
 
export default function RouteNode(props: RouteNodeProps) {
  const [width, setWidth] = useState(150)
  const [height, setHeight] = useState(46)
  const {isLayouted, setIsLayouted} = useContext(IsLayoutedContext)
  const handleClick = () => {
    setWidth(prev => prev * 2)
    setHeight(prev => prev * 2)
    setIsLayouted(false)
    console.log('clicked id:', props.data.id)
  }
  
  return (
    <div style={{
      border: '1px solid #1a192b',
      padding: '10px',
      borderRadius: '3px',
      background: props.data.style.backgroundColor,
      width: width,
      height: height,
      textAlign: 'center'
    }} onClick={handleClick}>
      <Handle type="target" position={Position.Top} />
      <p>{props.data.label}</p>
      <Handle type="source" position={Position.Bottom}/>
    </div>
  );
}