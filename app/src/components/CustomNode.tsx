import useStore from '@/store';
import { RouteNodePayload } from '@/types';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import CustomNodeWrapper from './ComponentNode';
import RouteNode from './RouteNode';

type CustomNodeProps = {
  data: RouteNodePayload
}

export default function CustomNode(props: CustomNodeProps) {
  const setNodeViewToComponents = useStore(state => state.setNodeViewToShowComponents)
  const [bounds, setBounds] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 50
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
    setIsLayouted(false)
    setNodeViewToComponents(props.data.id)
    console.log('clicked id:', props.data.id)
  }

  const RouteView = (
    <RouteNode bounds={bounds} setBounds={setBounds} data={props.data} handleClick={handleClick} />
  )

  const ComponentView = (
    <CustomNodeWrapper data={props.data} bounds={bounds} setBounds={setBounds} />
  )

  return (
    props.data.isShowComponents ? ComponentView : RouteView
  );
}