import useStore from "@/store";
import { useShallow } from "zustand/react/shallow";
import { Switch } from "./ui/switch";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type SidebarProps = {

}

const Sidebar = (props: SidebarProps) => {
  const nodes = useStore(state => state.nodes)
  const selectedNode = useStore(state => state.selectedNode)
  const setNodeViewToComponents = useStore(state => state.setNodeViewToShowComponents)
  const setNodeViewToRoute = useStore(state => state.setNodeViewToShowRoute)
  const setSelectedNode = useStore(state => state.setSelectedNode)
  const setIsLayouted = useStore(state => state.setIsLayouted)
  const isLayouted = useStore(state => state.isLayouted)
  const setAllRoute = useStore(state => state.setAllRoute)
  const setAllComponents = useStore(state => state.setAllComponents)

  const getToggleValue = (isShowComponents: boolean) => {
    if (isShowComponents) {
      return 'component'
    }
    return 'route'
  }

  const handleAllRoute = () => {

  }

  return (
    <div className='h-full w-[300px] bg-white p-4'>
      <button onClick={() => {
        setAllRoute()
        setIsLayouted(false)
        }}>set all route</button>
      <button onClick={() => {
        setAllComponents()
        setIsLayouted(false)
        }}>set all component</button>
      <p>isLayouted: {isLayouted === true ? 'true' : 'false'}</p>
      <p>selected node:</p>
      <p className="font-semibold mt-3">Node Name:</p>
      <p>{selectedNode?.data.label ?? 'none'}</p>
      <p className="font-semibold mt-3">View Type:</p>
      {selectedNode ? (<p>{getToggleValue(selectedNode.data.isShowComponents)}</p>) : (<></>)}
      {selectedNode ?
        (<ToggleGroup
          type="single"
          value={getToggleValue(selectedNode.data.isShowComponents)}
          onValueChange={(value) => {
            console.log('value:', value)
            if (value == 'route') {
              console.log('ganti ke route')
              setNodeViewToRoute(selectedNode?.data.id!)
            } else if (value == 'component') {
              console.log('ganti ke component')
              setNodeViewToComponents(selectedNode?.data.id!)
            }
            setSelectedNode(selectedNode.id)
            setIsLayouted(false)
          }}
        >
          <ToggleGroupItem value="route" aria-label="Toggle route">
            <p>Route</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="component" aria-label="Toggle component">
            <p>Component</p>
          </ToggleGroupItem>
        </ToggleGroup>)
        :
        (<p>None</p>)}
        <p>{JSON.stringify(selectedNode?.data.componentsViewBounds)}</p>

      {/* <div className="flex gap-x-2 items-center">
        <p>Route</p>
        <Switch />
        <p>Component</p>
      </div> */}
    </div>
  )
}

export default Sidebar