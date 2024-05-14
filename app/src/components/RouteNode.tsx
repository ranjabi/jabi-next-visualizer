import useStore from "@/store"
import { NodePayload } from "@/types"
import { Handle, Position, Rect } from "reactflow"

type RouteNodeProps = {
  bounds: Rect
  setBounds: React.Dispatch<React.SetStateAction<Rect>>
  data: NodePayload
  handleClick: () => void
}

const RouteNode = (props: RouteNodeProps) => {
  const setComponentsViewBounds = useStore(state => state.setComponentsViewBounds)

  // useEffect(() => {
  //   setComponentsViewBounds(props.data.id, {
  //     x: 0,
  //     y: 0,
  //     width: 150,
  //     height: 40
  //   })
  //   // console.log('route node:', props.bounds.width, props.bounds.height)
  //   // return () => {
  //   //   setComponentsViewBounds(props.data.id, {
  //   //     x: 0,
  //   //     y: 0,
  //   //     width: 0,
  //   //     height: 0
  //   //   })
  //   // }
  // }, [])

  return (
    <div style={{
        border: '1px solid #1a192b',
        padding: '10px',
        borderRadius: '3px',
        background: props.data.style.bgColor,
        width: props.bounds.width,
        height: props.bounds.height,
        textAlign: 'center'
      }} 
      onClick={props.handleClick}>
      <Handle type="target" position={Position.Top} />
      <p>{props.data.label}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default RouteNode