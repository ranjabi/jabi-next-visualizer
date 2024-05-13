import { RouteNodePayload } from "@/types"
import { Handle, Position, Rect } from "reactflow"

type RouteNodeProps = {
  bounds: Rect
  setBounds: React.Dispatch<React.SetStateAction<Rect>>
  // width: number
  // height: number
  data: RouteNodePayload
  handleClick: () => void
}

const RouteNode = (props: RouteNodeProps) => {
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
      <p>{props.data.label} {props.data.isShowComponents === true ? 'true' : 'false'}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default RouteNode