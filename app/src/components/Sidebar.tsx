import useStore, { RFState } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { Switch } from "./ui/switch";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useReactFlow } from "reactflow";
import ELK, { ELK as ELKType } from 'elkjs/lib/elk.bundled.js';


const defaultOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': 100,
  'elk.spacing.nodeNode': 80,
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.direction': 'DOWN'
};

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  isLayouted: state.isLayouted,
  setIsLayouted: state.setIsLayouted,
  viewType: state.viewType
});

// const useLayoutedElements = (nodes, setNodes, edges) => {
  
//   const { fitView } = useReactFlow();
//   const defaultOptions = {
//     'elk.algorithm': 'layered',
//     'elk.layered.spacing.nodeNodeBetweenLayers': 100,
//     'elk.spacing.nodeNode': 80,
//     'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
//     'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
//     'elk.direction': 'DOWN'
//   };

//   const getLayoutedElements = () => {
    
//     const layoutOptions = { ...defaultOptions };
//     const graph = {
//       id: 'root',
//       layoutOptions: layoutOptions,
//       children: nodes.map(n => {
//         console.log('isShow', n.data.isShowComponents)
//         // if (n.data.componentsViewBounds) {
//         //   const x = n.data.componentsViewBounds.x
//         //   const y = n.data.componentsViewBounds.y
//         //   const width = n.data.componentsViewBounds.width
//         //   const height = n.data.componentsViewBounds.height
//         //   console.log('use bounds for', n.id, width, height)
//         //   return {...n, width: width + (2 * x), height: height + (2 * y)}
//         // }

//         return {...n}

//         }
//         // if (n.id.includes('kambing')) {
//         //   console.log('bounds:', n.data.componentsViewBounds)
//         // }
//         // return n
//       ),
//       edges: edges,
//     };

//     const globalOptions = {
//       layoutOptions: {
//         'elk.alignment': 'TOP'
//       }
//     }

//     elk.layout(graph, globalOptions).then(({ children }) => {
//       children?.forEach((node) => {
//         node.position = { x: node.x, y: node.y };
//       });

//       setNodes(children);
//       window.requestAnimationFrame(() => {
//         fitView();
//       });
//     });
//   }

//   return { getLayoutedElements };
// };

type SidebarProps = {

}

const Sidebar = (props: SidebarProps) => {
  const elk = new ELK();
  const { nodes, edges, setNodes } = useStore(
    useShallow(selector),
  );
  const getLayoutedElements = (elk, nodes, edges, setNodes) => {
    
    const layoutOptions = { ...defaultOptions };
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: nodes.map(n => {
        // console.log('node', n.data.id, n.data.isShowComponents)
        // console.log(n.data.componentsViewBounds)
        if (n.data.isShowComponents) {
          if (n.data.componentsViewBounds) {
            const x = n.data.componentsViewBounds.x
            const y = n.data.componentsViewBounds.y
            const width = n.data.componentsViewBounds.width
            const height = n.data.componentsViewBounds.height
            // console.log('use bounds for', n.id, width, height)
            return {...n, width: width + (2 * x), height: height + (2 * y)}
          }
          return {...n}
        } else {
          return {...n, width: 150, height: 40}
        }

        return {...n}

        }
        // if (n.id.includes('kambing')) {
        //   console.log('bounds:', n.data.componentsViewBounds)
        // }
        // return n
      ),
      edges: edges,
    };

    const globalOptions = {
      layoutOptions: {
        'elk.alignment': 'TOP'
      }
    }

    elk.layout(graph, globalOptions).then(({ children }) => {
      children?.forEach((node) => {
        node.position = { x: node.x, y: node.y };
      });

      setNodes(children);
      // window.requestAnimationFrame(() => {
      //   fitView();
      // });
    });
  }
  // const { getLayoutedElements } = useLayoutedElements(nodes, setNodes, edges);
  // const nodes = useStore(state => state.nodes)
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
        // getLayoutedElements(elk, nodes, edges, setNodes)
        }}>set all route</button>
      <button onClick={() => {
        setAllComponents()
        setIsLayouted(false)
        // getLayoutedElements(elk, nodes, edges, setNodes)
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