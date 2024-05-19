import { useEffect } from "react";
import { setupInitialNodesEdges } from "@/lib/parser";
import VisualizerWrapper from "@/components/Visualizer";
import useStore, { RFState } from "../store";
import { useShallow } from "zustand/react/shallow";

const selector = (state: RFState) => ({
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  setRawFile: state.setRawFile
});

export default function Home() {
  const { setNodes, setEdges, setRawFile } = useStore(
    useShallow(selector),
  );

  useEffect(() => {
    let ignore = false;

    const getRawFile = async () => {
      const rawFileRes = await fetch('http://localhost:3010/raw-file')
      const rawFile = await rawFileRes.json()

      const initialState = setupInitialNodesEdges(rawFile)

      if (!ignore) {
        setRawFile(rawFile)
        setNodes(initialState.initialNodes)
        setEdges(initialState.initialEdges)
      }
    }

    getRawFile()

    return () => {
      ignore = true;
    };
  }, [])

  return (
    <VisualizerWrapper />
  );
}
