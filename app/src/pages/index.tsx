import { useEffect, useState } from "react";
import type { RawFile } from "@/types";
import { setupInitialNodesEdges } from "@/lib/parser";
import { InitialStateContext, IsLayoutedContext, ViewTypeStateContext } from "@/context";
import {
  type Node as FlowNode,
  type Edge as FlowEdge
} from 'reactflow';
import VisualizerWrapper from "@/components/Visualizer";

export default function Home() {
  function helper(viewType: string, testFile: RawFile[]) {
    const initialState = setupInitialNodesEdges(testFile)
    return { initialNodes: initialState.initialNodes, initialEdges: initialState.initialEdges }
  }

  const [viewType, setViewType] = useState('route')
  const [initialState, setInitialState] = useState({
    initialNodes: [] as FlowNode[],
    initialEdges: [] as FlowEdge[]
  })
  const [isLayouted, setIsLayouted] = useState(false)

  useEffect(() => {
    const getRawFile = async () => {
      console.log('fetching start')
      const rawFileRes = await fetch('http://localhost:3010/raw-file')
      const rawFile = await rawFileRes.json()

      setInitialState(helper(viewType, rawFile))
      console.log('fetching finished')
    }

    getRawFile()
  }, [])

  return (
    <>
      <ViewTypeStateContext.Provider value={{ viewType, setViewType }}>
        <InitialStateContext.Provider value={{ initialState, setInitialState, helper }}>
          <IsLayoutedContext.Provider value={{ isLayouted, setIsLayouted }}>
            <VisualizerWrapper />
          </IsLayoutedContext.Provider>
        </InitialStateContext.Provider>
      </ViewTypeStateContext.Provider>
      {/* <ul>
        {testFile.map((file) => {
          return (
            <li key={file.path}>
              <p>{"{"}</p>
              <p>"path": "{file.path}",</p>
              <p>"name": "{file.name}",</p>
              <p>"content":</p>
              <p>"{escapeHtml(file.content)}"</p>
              <p>{"},"}</p>
            </li>
          )
        })}
      </ul> */}
    </>
  );
}
