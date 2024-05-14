import useStore, { selector } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";

type SidebarProps = {
}

const Sidebar = (props: SidebarProps) => {
  const { selectedNode, setNodeViewToComponents, setNodeViewToRoute, setSelectedNode, setIsLayouted, isLayouted, setAllRoute, setAllComponents, setFocusId } = useStore(
    useShallow(selector),
  );

  const getToggleValue = (isShowComponents: boolean) => {
    if (isShowComponents) {
      return 'component'
    }
    return 'route'
  }

  const handleFocusNode = (nodeId: string | null) => {
    setFocusId(nodeId)
  }

  return (
    <div className='h-full w-[300px] bg-white p-4'>
      {/* Global Options */}
      <div className="border border-gray-300 rounded-md p-4">
        <p className="text-center">Global Options</p>
        <div className="mt-3">
          <p className="font-semibold">View Type:</p>
          <div className="flex gap-x-3 mt-1">
            <Button variant='outline' className="w-1/2" onClick={() => {
              setAllRoute()
              setIsLayouted(false)
            }}>Route</Button>
            <Button variant='outline' className="w-1/2" onClick={() => {
              setAllComponents()
              setIsLayouted(false)
            }}>Component</Button>
          </div>
        </div>
      </div>
      {/* Selected Node Options */}
      <div className="border border-gray-300 rounded-md p-4 mt-4">
        <p className="text-center">Selected Node Options</p>
        <div className="mt-3">
          <p className="font-semibold">Node Name:</p>
          <p>{selectedNode?.data.label ?? 'None'}</p>
        </div>
        <div className="mt-3">
          <p className="font-semibold">View Type:</p>
          {selectedNode ?
            (<ToggleGroup
              type="single"
              className="mt-1"
              variant={'outline'}
              value={getToggleValue(selectedNode.data.isShowComponents)}
              onValueChange={(value) => {
                if (value == 'route') {
                  setNodeViewToRoute(selectedNode?.data.id)
                } else if (value == 'component') {
                  setNodeViewToComponents(selectedNode?.data.id)
                }
                setSelectedNode(selectedNode.id)
                setIsLayouted(false)
              }}
            >
              <ToggleGroupItem value="route" className="w-1/2" aria-label="Toggle route">
                <p>Route</p>
              </ToggleGroupItem>
              <ToggleGroupItem value="component" className="w-1/2" aria-label="Toggle component">
                <p>Component</p>
              </ToggleGroupItem>
            </ToggleGroup>)
            :
            (<p>None</p>)}
        </div>
        <div className="mt-3">
        <p className="font-semibold">Action:</p>
          <Button className='mt-1' onClick={() => handleFocusNode(selectedNode ? selectedNode.data.id : null)}>Focus</Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar