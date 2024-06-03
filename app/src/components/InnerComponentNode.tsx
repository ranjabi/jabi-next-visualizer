import { NodePayload } from "@/types"
import { Handle, Position, Rect } from "reactflow"

type InnerComponentNodeProps = {
  bounds: Rect
  setBounds: React.Dispatch<React.SetStateAction<Rect>>
  data: NodePayload
  handleClick: () => void
}
const InnerComponentNode = (props: InnerComponentNodeProps) => {
  return (
    <div style={{
      border: '1px solid #1a192b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '3px',
      background: 'white',
      width: 150,
      height: 40,
      textAlign: 'center'
    }}
      onClick={props.handleClick}
    >
      <Handle type="target" position={Position.Top} />
      <p className="break-all">{props.data.label}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default InnerComponentNode