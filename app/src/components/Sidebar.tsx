import useStore, { selector } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";

type SidebarProps = {
}

const Sidebar = (props: SidebarProps) => {
  const { selectedNode, setNodeViewToComponents, setNodeViewToRoute, setSelectedNode, setIsLayouted, isLayouted, setAllRoute, setAllComponents, setFocusId, nodes, setSelectedNodeId, setIsNeedToFit } = useStore(
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

  const handleRouteClick = (nodeId: string) => {
    handleFocusNode(nodeId)
    setSelectedNodeId(nodeId)
  }

  return (
    <div className='flex flex-col h-[100vh] w-[300px] bg-white p-4'>
      {/* Global Options */}
      <div className="border border-gray-300 rounded-md p-4">
        <p className="text-center">Global Options</p>
        <div className="mt-4">
          <p className="font-semibold">View Type:</p>
          <div className="flex gap-x-3 mt-1">
            <Button variant='outline' className="w-1/2" onClick={() => {
              setAllRoute()
              setIsLayouted(false)
              setIsNeedToFit(true)
            }}>Route</Button>
            <Button variant='outline' className="w-1/2" onClick={() => {
              setAllComponents()
              setIsLayouted(false)
              setIsNeedToFit(true)
            }}>Component</Button>
          </div>
        </div>
      </div>
      {/* Selected Node Options */}
      <div className="border border-gray-300 rounded-md p-4 mt-4">
        <p className="text-center">Selected Node Options</p>
        <div className="mt-4">
          <p className="font-semibold">Node Name:</p>
          <p>{selectedNode?.data.label ?? 'None'}</p>
        </div>
        <div className="mt-3">
          <p className="font-semibold">View Type:</p>
          {selectedNode ?
            (<ToggleGroup
            size={'sm'}
              type="single"
              className={`mt-1 flex gap-x-3 ${!selectedNode.data.isLeaf ? 'justify-start' : ''}`}
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
              {selectedNode.data.isLeaf && (
                <ToggleGroupItem value="component" className="w-1/2" aria-label="Toggle component">
                  <p>Component</p>
                </ToggleGroupItem>)}
            </ToggleGroup>)
            :
            (<p>None</p>)}
        </div>
        <div className="mt-3">
          <p className="font-semibold">Action:</p>
          <Button size={'sm'} className='mt-1' onClick={() => handleFocusNode(selectedNode ? selectedNode.data.id : null)}>Focus</Button>
        </div>
      </div>
      {/* Available Routes */}
      <div className="border border-gray-300 rounded-md p-4 mt-4 flex-1 overflow-auto">
        <p className="text-center">Available Routes</p>
        <div className="mt-4 flex flex-col gap-y-3">
          {nodes.filter(n => n.data.isLeaf).map(node => {
            return (
              <Button key={node.data.id} variant={'outline'} onClick={() => handleRouteClick(node.data.id)}><p className="text-left w-full">{node.data.label}</p></Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Sidebar