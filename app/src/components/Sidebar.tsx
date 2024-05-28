import useStore, { selector } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { NodePayload } from "@/types";
import type { Node } from "reactflow";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { useRouter } from "next/router";

type SidebarProps = {
}

const Sidebar = (props: SidebarProps) => {
  const { selectedNode, setNodeViewToComponents, setNodeViewToRoute, setSelectedNode, setIsLayouted, isLayouted, setAllRoute, setAllComponents, setFocusId, nodes, setSelectedNodeId, setIsNeedToFit, setNodeHiddenStatus, viewType, setViewType, recursiveView, setAllRecursiveView, setRecursiveView } = useStore(
    useShallow(selector),
  );
  const [routeQuery, setRouteQuery] = useState('')
  const getFilteredRoutes = (query: string, routes: Node<NodePayload>[]) => {
    if (!query) {
      return routes
    }

    return routes.filter((route => route.data.label.includes(query)))
  }
  const router = useRouter()
  const [userProjectPath, setUserProjectPath] = useState('')

  const filteredRoutes = getFilteredRoutes(routeQuery, nodes.filter(n => n.data.isLeaf))

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

  useEffect(() => {
    let ignore = false;

    const getUserProjectPath = async () => {
      const res = await fetch('http://localhost:3010/user-project-path')
      const userProjectRes = await res.json()

      if (!ignore) {
        setUserProjectPath(userProjectRes.path)
      }
    }

    getUserProjectPath()

    return () => {
      ignore = true;
    };
  }, [])

  return (
    <div className='flex flex-col h-[100vh]  min-w-[300px] max-w-[300px] bg-white p-4'>
      {/* Global Options */}
      <div className="border border-gray-300 rounded-md p-4">
        <p className="text-center">Global Options</p>
        <div className="mt-4">
          <p className="font-semibold">View Type:</p>
          <div className="flex gap-x-3 mt-2">
            <ToggleGroup
              size={'sm'}
              type="single"
              className='flex gap-x-3 w-full'
              variant={'outline'}
              value={viewType}
              onValueChange={(value) => {
                if (viewType === 'route') {
                  setViewType('component')
                  setAllComponents()
                } else if (viewType === 'component') {
                  setViewType('route')
                  setAllRoute()

                }
                setAllRecursiveView(false)
                setIsLayouted(false)
                setIsNeedToFit(true)
              }}
            >
              <ToggleGroupItem value="route" className="w-1/2" aria-label="Toggle route">
                <p>Route</p>
              </ToggleGroupItem>
              <ToggleGroupItem value="component" className="w-1/2" aria-label="Toggle component">
                <p>Component</p>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="mt-3">
          <p className="font-semibold">Recursive View:</p>
          <Switch
            className="mt-1"
            disabled={viewType === 'route'}
            checked={recursiveView}
            onCheckedChange={() => {
              if (recursiveView) {
                setAllRecursiveView(false)
              } else {
                setAllRecursiveView(true)
              }
              setIsLayouted(false)
            }}
          />
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
        <div>
          <p className="font-semibold mt-3">Recursive View:</p>
          <Switch
            className="mt-1"
            disabled={!selectedNode?.data.isShowComponents || !selectedNode}
            checked={selectedNode?.data.isRecursive}
            onCheckedChange={() => {
              if (selectedNode) {
                if (selectedNode.data.isRecursive) {
                  setRecursiveView(selectedNode?.id, false)
                } else {
                  setRecursiveView(selectedNode?.id, true)
                }
                setSelectedNode(selectedNode.id)
                setIsLayouted(false)
              }
            }}
          />
        </div>
        <div className="mt-3">
          <p className="font-semibold">Action:</p>
          <div className="flex gap-x-2 mt-1">
          <Button disabled={!selectedNode} size={'sm'} onClick={() => handleFocusNode(selectedNode ? selectedNode.data.id : null)}>Focus</Button>
          <Button disabled={!selectedNode} size={'sm'} onClick={() => router.push(`vscode://file${userProjectPath}/${selectedNode?.data.path}`)}>Open in VSCode</Button>
          </div>
        </div>
      </div>
      {/* Available Routes */}
      <div className="border border-gray-300 rounded-md p-4 mt-4 flex-1 overflow-auto">
        <p className="text-center">Available Routes</p>
        <Input className="mt-4" placeholder="Find route..." onChange={(e) => setRouteQuery(e.target.value)} />
        <div className="mt-4 flex flex-col gap-y-2">
          {filteredRoutes.map(node => {
            return (
              <div key={node.data.id} className="flex gap-x-2 items-center border p-2 rounded-md">
                <Checkbox className="rounded-sm" checked={!node.data.isHidden} onCheckedChange={() => {
                  if (node.data.isHidden) {
                    setNodeHiddenStatus(false, node.id)
                  } else {
                    setNodeHiddenStatus(true, node.id)
                  }
                  setIsLayouted(false)
                }} />
                <p className="text-left w-full hover:cursor-pointer" onClick={() => handleRouteClick(node.data.id)}>{node.data.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Sidebar