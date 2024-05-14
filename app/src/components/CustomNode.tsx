import useStore from '@/store';
import { NodePayload } from '@/types';
import { useEffect, useState } from 'react';
import CustomNodeWrapper from './ComponentNode';
import RouteNode from './RouteNode';

type CustomNodeProps = {
  data: NodePayload
}

export default function CustomNode(props: CustomNodeProps) {
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
  }

  const setComponentsViewBounds = useStore(state => state.setComponentsViewBounds)

  useEffect(() => {
    if (props.data.isShowComponents === false) {
      setBounds((prev) => {
        return {
          ...prev,
          width: 150,
          height: 40
        }
      })
      // setComponentsViewBounds(props.data.id, undefined)
    }
  }, [props.data.isShowComponents])

  const RouteView = (
    <RouteNode bounds={bounds} setBounds={setBounds} data={props.data} handleClick={handleClick} />
  )

  const ComponentView = (
    <CustomNodeWrapper data={props.data} bounds={bounds} setBounds={setBounds} handleClick={handleClick} />
  )

  return (
    <>
      {props.data.isShowComponents ? ComponentView : RouteView}
    </>
  );
}