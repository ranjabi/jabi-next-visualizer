// @ts-nocheck

import { uuid } from "./helper";
import type { Ast, Edge, FileUpload, RawFile, Node, RouteNode } from "@/types";
import {
  type Node as FlowNode,
  type Edge as FlowEdge
} from 'reactflow';
import { parse } from "@babel/parser";
import RouteNode from "@/components/RouteNode";
const leafColor = '#ff0072'

/**
 * convert file content into ast
 */
export const parseAst = (fileContent: string) => {
  // TODO: find type of rawAst
  const rawAst = parse(fileContent, {
    sourceType: "module",
    plugins: [
      "jsx",
      "typescript"
    ],
  })

  const importedFile = []

  rawAst.program.body.filter(e => e.type === 'ImportDeclaration').forEach(e => {
    const splitted = e.source.value.split('/')

    if (splitted[0] === '@') {
      let componentName = splitted[splitted.length - 1]

      if (!componentName.includes('.tsx')) {
        componentName += '.tsx'
      }
      importedFile.push(componentName)
    }
  })

  let initialJsxElement = undefined

  // ExportDefaultDeclaration: "export default function Name()"
  const ExportDefaultDeclaration = rawAst.program.body.find(
    (astNode) => astNode.type === 'ExportDefaultDeclaration',
  )

  
  if (ExportDefaultDeclaration?.declaration.type === 'FunctionDeclaration') {
    initialJsxElement = ExportDefaultDeclaration.declaration
  } else if (ExportDefaultDeclaration?.declaration.type === 'Identifier') {
    const declarationName = ExportDefaultDeclaration.declaration.name
    const FunctionDeclaration = rawAst.program.body.find(
      (astNode) => astNode.type === 'FunctionDeclaration' && astNode.id.name === declarationName,
    )

    if (FunctionDeclaration) {
      initialJsxElement = FunctionDeclaration
    } else {
      const VariableDeclaration = rawAst.program.body.find((astNode) => astNode.type === 'VariableDeclaration' && astNode.declarations.find(dec => dec.id.name === declarationName))
      const AppDeclaration = VariableDeclaration?.declarations.find(dec => dec.id.name === declarationName)
      initialJsxElement = AppDeclaration.init
    }
  }

  let jsxElement

  if (initialJsxElement.body.type === 'BlockStatement') {
    jsxElement = initialJsxElement.body.body.find(n => n.type === 'ReturnStatement').argument
  } else if (initialJsxElement.body.type === 'JSXElement') {
    jsxElement = initialJsxElement.body
  }

  const parsedAst = parseNode([], jsxElement) as Ast[]

  return { parsedAst: parsedAst[0], importedFile: importedFile }
}

// @ts-ignore
const parseNode = (oldNode, currentNode) => {
  let element = {};
  if (currentNode.type === 'JSXElement') {
    element = {
      id: uuid().slice(0, 8) + '-' + currentNode.openingElement.name.name,
      name: currentNode.openingElement.name.name,
      children: [],
    };
    oldNode.push(element);
  } else if (currentNode.type === 'JSXFragment') {
    element = {
      id: uuid().slice(0, 8) + '-' + 'Fragment',
      name: 'Fragment',
      children: [],
    };
    oldNode.push(element);
  }

  if ('children' in currentNode) {
    currentNode.children.forEach(
      // @ts-ignore
      (node) => {
        if (oldNode.length > 0) {
          // @ts-ignore
          parseNode(element.children, node)
        } else {
          parseNode(oldNode, node)
        }
      }
    );
  }

  return oldNode;
};

const tidyRoute = (routeNode: RouteNode) => {
  if (routeNode.children.length === 1 && routeNode.children[0].path.includes('index')) {
    routeNode = routeNode.children[0]
  }
  const newChildren = routeNode.children.map(n => {
    return tidyRoute(n)
  })
  routeNode.children = newChildren

  return routeNode
}

/**
 * Create an array of nodes and edges of route tree
 */
export const setupInitialNodesEdges = (fileUpload: RawFile[]) => {
  const fileUploadWithComponentTreeNodesAndEdges = initComponentTreeNodesAndEdges(fileUpload)
  const _routeTree = convertToTree(fileUploadWithComponentTreeNodesAndEdges)
  const routeTree = tidyRoute(_routeTree)
  const initialNodes = generateRouteNodes(routeTree)
  const initialEdges = generateRouteEdges(routeTree)

  return { initialNodes, initialEdges }
}

/**
 * Add array of nodes and edges of component tree to each route file
 */
export const initComponentTreeNodesAndEdges = (testFile: RawFile[]) => {
  let res = testFile.map(file => {
    const parsedResult = parseAst(file.content as string)
    const parsedAst = parsedResult.parsedAst
    
    const nodes = generateComponentNodes(parsedAst)
    const edges = generateComponentEdges(parsedAst)
    const newFileTree = {
      name: file.name,
      path: file.path,
      content: file.content,
      nodes: nodes,
      edges: edges,
      importedFile: parsedResult.importedFile
    }
    
    return newFileTree
  })

  res = res.map(resItem => {
    if (resItem.importedFile.length > 0) {
      const resWithImportedFile = res.find(item => item.name === resItem.importedFile[0])

      if (resWithImportedFile) {
        resItem.nodes.forEach(resItemNode => {
          if ((resItemNode.data.label + '.tsx') === resItem.importedFile[0]) {
            const extendedNodes = resWithImportedFile.nodes.map(node => {
              return {
                ...node,
                id: 'ext-' + uuid().slice(0,6) + '-' + node.id
              } 
            })
            const extendedEdges = resWithImportedFile.edges.map(edge => {
              return {
                id: 'ext-' + uuid().slice(0,6) + '-' + edge.id,
                source: extendedNodes.find(ns => ns.id.includes(edge.source)).id,
                target: extendedNodes.find(nt => nt.id.includes(edge.target)).id
              } 
            })
            resItem.nodes.push(...extendedNodes)
            resItem.edges.push({
              id: 'extended-' + resItemNode.id + '-TO-' + resItem.importedFile[0],
              source: resItemNode.id,
              target: extendedNodes[0].id
            })
            resItem.edges.push(...extendedEdges)
          }
        })
      }
    }
    return resItem
  })

  return res
}

// convert to react flow node format
function generateComponentNodes(ast: Ast) {
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
const convertToTree = (fileUploads: FileUpload[]) => {
  const beginPath = fileUploads.find(e => e.path.includes('src')) ? 'src/pages' : 'pages'
  const slicePos = beginPath === 'src/pages' ? 2 : 1

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
      fileName: '',
      initialNodes: [],
      initialEdges: [],
      isShowComponents: false,
      style: {
        color: 'black',
        bgColor: 'white'
      },
      componentsViewBounds: undefined,
      isLeaf: false
    }
  }  as RouteNode;

  fileUploads.forEach(item => {
    if (!item.path.includes(beginPath)) {
      return
    }
    const pathParts = item.path.split('/').slice(slicePos);
    let currentNode = root;

    pathParts.forEach((part, index) => {
      if (part !== '' && part[0] !== '_') {
        let foundChild = currentNode.children.find(child => child.name === part);
        if (!foundChild) {
          const id = `${uuid().slice(0, 6)}-${part}`
          // to add components
          const lookupNode = fileUploads.find(e => e.path === beginPath + '/' + pathParts.slice(0, index + 1).join('/'))

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
            path: beginPath + '/' + pathParts.slice(0, index + 1).join('/'),
            data: {
              id: id,
              fileName: part,
              // Append component nodes and edges
              initialNodes: lookupNode ? lookupNode.nodes : [],
              initialEdges: lookupNode ? lookupNode.edges : [],
              label: getLabel(part, currentNode.data.label),
              style: {
                color: 'black',
                bgColor: 'white'
              },
              isShowComponents: isLeaf(part) ? true : false,
              componentsViewBounds: undefined,
              isLeaf: isLeaf(part) ? true : false
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
          bgColor: node.data.style.bgColor,
          color: node.data.style.bgColor === leafColor ? 'white' : 'black'
        }
      },
      position: { x: 0, y: 0 },
      type: node.data.initialNodes.length === 0 ? 'custom' : 'custom',
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