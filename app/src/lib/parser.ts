// @ts-nocheck

import { uuid } from "./helper";
import type { Ast, Edge, FileUpload, RawFile, Node, RouteNode } from "@/types";
import {
  type Node as FlowNode,
  type Edge as FlowEdge,
  ReactFlowProvider,
} from 'reactflow';
import { parse } from "@babel/parser"
const leafColor = '#ff0072'

// convert file content into ast
export const parseAst = (fileContent: string) => {
  // TODO: find type of rawAst
  const rawAst = parse(fileContent, {
    sourceType: "module",
    plugins: [
      "jsx",
      "typescript"
    ],
  })

  // ExportDefaultDeclaration: "export default function Name()"
  const initialAst = rawAst.program.body.find(
    (astNode) => astNode.type === 'ExportDefaultDeclaration',
  ).declaration.body.body[0].argument;

  const parsedAst = parseNode([], initialAst) as Ast[]

  return parsedAst[0]
}

const parseNode = (oldNode, currentNode) => {
  let element = {};
  if (currentNode.type === 'JSXElement') {
    element = {
      id: uuid().slice(0, 8) + '-' + currentNode.openingElement.name.name,
      name: currentNode.openingElement.name.name,
      children: [],
    };
    oldNode.push(element);
  }
  if ('children' in currentNode) {
    currentNode.children.forEach(
      (node) => {
        if (oldNode.length > 0) {
          parseNode(element.children, node)
        } else {
          parseNode(oldNode, node)
        }
      }
    );
  }
  return oldNode;
};

/**
 * option: 1 = route only, 2 = route with component
 */
export const setupInitialNodesEdges = (fileUpload: RawFile[], viewType: string) => {
  const fileUploadWithComponentTreeNodesAndEdges = initComponentTreeNodesAndEdges(fileUpload)
  const routeTree = convertToTree(fileUploadWithComponentTreeNodesAndEdges, viewType)
  const initialNodes = generateRouteNodes(routeTree)
  const initialEdges = generateRouteEdges(routeTree)

  return { initialNodes, initialEdges }
}

/**
 * Add array of nodes and edges for component tree in each file
 */
export const initComponentTreeNodesAndEdges = (testFile: RawFile[]) => {
  const res = testFile.map(file => {
    const parsedAst = parseAst(file.content as string)
    const nodes = generateComponentNodes(parsedAst)
    const edges = generateComponentEdges(parsedAst)
    const newFileTree = {
      name: file.name,
      path: file.path,
      content: file.content,
      nodes: nodes,
      edges: edges
    }
    return newFileTree
  })
  return res
}

// convert to react flow node format
function generateComponentNodes(ast: Ast) {
  // console.log('raw:', raw)
  let nodes = [] as Node[];

  function traverse(node: Ast) {
    const newNode = {
      id: node.id || node.name,
      data: { label: node.name },
      position: { x: 0, y: 0 }
    };

    nodes.push(newNode);

    if (node.children.length > 0) {
      node.children.forEach(child => {
        traverse(child);
      });
    }
  }

  traverse(ast);

  return nodes;
}

// convert to react flow edge format
function generateComponentEdges(ast: Ast) {
  let edges = [] as Edge[];

  function traverse(node: Ast) {
    const source = node.id || node.name
    if (node.children.length > 0) {
      node.children.forEach(child => {
        const target = child.id || child.name
        const edge = {
          id: `e-${source}-TO-${target}`,
          source: source,
          target: target,
          animated: false
        }
        edges.push(edge);
        traverse(child);
      });
    }
  }

  traverse(ast);

  return edges;
}

/**
 * @param path "sample/src/pages/_document.tsx"
 * @returns "sample/src/pages/""
 */
function getParentDirectory(path: string) {
  // Find the last occurrence of '/' in the string
  const lastSlashIndex = path.lastIndexOf('/');
  
  // Extract the substring from the start to the last occurrence of '/'
  const parentDirectory = path.substring(0, lastSlashIndex);
  
  return parentDirectory;
}

/**
 * The fileUploadWithComponentTreeNodesAndEdges format is arrays,
 * we want to create a route tree with every data filled with
 * component tree nodes and edges
 */
const convertToTree = (fileUploads: FileUpload[], viewType: string) => {
  // const beginPath = 'sample/src/pages/'
  const beginPath = getParentDirectory(fileUploads[0].path)
  const rootId = uuid().slice(0, 6) + '-root'

  const root = {
    id: rootId,
    name: 'root',
    path: '',
    url: '',
    children: [],
    data: {
      id: rootId,
      label: "/",
      initialNodes: [],
      initialEdges: [],
      bgColor: 'white'
    }
  }  as RouteNode;

  fileUploads.forEach(item => {
    // slice(3) because we get rid of 'sample/src/pages/'
    const pathParts = item.path.split('/').slice(2);
    let currentNode = root;

    pathParts.forEach((part, index) => {
      if (part !== '' && part[0] !== '_') {
        let foundChild = currentNode.children.find(child => child.name === part);
        if (!foundChild) {
          const id = `${uuid().slice(0, 6)}-${part}`

          // to add components
          const lookupNode = fileUploads.find(e => e.path === beginPath + pathParts.slice(0, index + 1).join('/'))

          const getLabel = (part: string, parent: string) => {
            if (parent === '/') {
              parent = ''
            }
            if (part === 'index.tsx') {
              part = ''
              if (parent !== '') {
                return parent
              }
            }
            return parent + '/' + removeExtension(part)
          }

          foundChild = {
            id: id,
            name: part,
            url: '/' + removeExtension(part),
            path: beginPath + pathParts.slice(0, index + 1).join('/'),
            data: {
              id: id,
              // Append component nodes and edges
              initialNodes: lookupNode && viewType === 'component' ? lookupNode.nodes : [],
              initialEdges: lookupNode && viewType === 'component' ? lookupNode.edges : [],
              label: getLabel(part, currentNode.data.label),
              bgColor: isLeaf(part) ? leafColor : 'white'
            },
            children: []
          };
          
          currentNode.children.push(foundChild);
        }

        currentNode = foundChild;
      }
    });
  });

  return root;
}

const isLeaf = (part: string) => {
  return part.endsWith('.tsx')
}

function removeExtension(filename: string) {
  if (filename.endsWith('.tsx')) {
      return filename.slice(0, -4);
  } else {
      return filename;
  }
}

function generateRouteNodes(routeNode: RouteNode) {
  let nodes = [] as FlowNode[];

  traverse(routeNode);

  function traverse(node: RouteNode) {
    const newNode = {
      id: node.id || node.name,
      data: {...node.data,
        style: {
          backgroundColor: node.data.bgColor,
          color: node.data.bgColor === leafColor ? 'white' : 'black'
        }
      },
      position: { x: 0, y: 0 },
      type: node.data.initialNodes.length === 0 ? 'route' : 'component',
    };

    nodes.push(newNode);

    if (node.children.length > 0) {
      node.children.forEach(child => {
        traverse(child);
      });
    }
  }

  return nodes;
}

function generateRouteEdges(routeNode: RouteNode) {
  let edges = [] as FlowEdge[];

  traverse(routeNode);

  function traverse(node: RouteNode) {
    const source = node.id || node.name
    if (node.children.length > 0) {
      node.children.forEach(child => {
        const target = child.id || child.name
        const edge = {
          id: `e-${source}-TO-${target}`,
          source: source,
          target: target,
          animated: false
        }
        edges.push(edge);
        traverse(child);
      });
    }
  }

  return edges;
}