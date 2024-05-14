import useStore, { selector } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type SidebarProps = {
}

const Sidebar = (props: SidebarProps) => {
  const { selectedNode, setNodeViewToComponents, setNodeViewToRoute, setSelectedNode, setIsLayouted, isLayouted, setAllRoute, setAllComponents } = useStore(
    useShallow(selector),
  );

  const getToggleValue = (isShowComponents: boolean) => {
    if (isShowComponents) {
      return 'component'
    }
    return 'route'
  }

  return (
    <div className='h-full w-[300px] bg-white p-4'>
      <div className="flex flex-col">
        <button onClick={() => {
          setAllRoute()
          setIsLayouted(false)
        }}>set all route</button>
        <button onClick={() => {
          setAllComponents()
          setIsLayouted(false)
        }}>set all component</button>
      </div>
      <p className="mt-4">Selected Node:</p>
      <p className="font-semibold mt-3">Node Name:</p>
      <p>{selectedNode?.data.label ?? 'None'}</p>
      <p className="font-semibold mt-3">View Type:</p>
      {selectedNode ?
        (<ToggleGroup
          type="single"
          value={getToggleValue(selectedNode.data.isShowComponents)}
          onValueChange={(value) => {
            if (value == 'route') {
              setNodeViewToRoute(selectedNode?.data.id!)
            } else if (value == 'component') {
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
    </div>
  )
}

export default Sidebar