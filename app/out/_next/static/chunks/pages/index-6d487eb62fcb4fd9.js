(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(2426)}])},2426:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return T}});var i=n(5893),o=n(7294);function l(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){let t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)})}var a=n(7191);let d="#ff0072",s=e=>r([],(0,a.Qc)(e,{sourceType:"module",plugins:["jsx","typescript"]}).program.body.find(e=>"ExportDefaultDeclaration"===e.type).declaration.body.body[0].argument)[0],r=(e,t)=>{let n={};return"JSXElement"===t.type&&(n={id:l().slice(0,8)+"-"+t.openingElement.name.name,name:t.openingElement.name.name,children:[]},e.push(n)),"children"in t&&t.children.forEach(t=>{e.length>0?r(n.children,t):r(e,t)}),e},c=(e,t)=>{let n,i;let o=u(h(e),t);return{initialNodes:(n=[],function e(t){let i={id:t.id||t.name,data:{...t.data,style:{backgroundColor:t.data.bgColor,color:t.data.bgColor===d?"white":"black"}},position:{x:0,y:0},type:0===t.data.initialNodes.length?"route":"component"};n.push(i),t.children.length>0&&t.children.forEach(t=>{e(t)})}(o),n),initialEdges:(i=[],function e(t){let n=t.id||t.name;t.children.length>0&&t.children.forEach(t=>{let o=t.id||t.name,l={id:"e-".concat(n,"-TO-").concat(o),source:n,target:o,animated:!1};i.push(l),e(t)})}(o),i)}},h=e=>e.map(e=>{let t,n;let i=s(e.content),o=(t=[],!function e(n){let i={id:n.id||n.name,data:{label:n.name},position:{x:0,y:0}};t.push(i),n.children.length>0&&n.children.forEach(t=>{e(t)})}(i),t),l=(n=[],!function e(t){let i=t.id||t.name;t.children.length>0&&t.children.forEach(t=>{let o=t.id||t.name,l={id:"e-".concat(i,"-TO-").concat(o),source:i,target:o,animated:!1};n.push(l),e(t)})}(i),n);return{name:e.name,path:e.path,content:e.content,nodes:o,edges:l}}),u=(e,t)=>{let n=function(e){let t=e.lastIndexOf("/");return e.substring(0,t)}(e[0].path),i=l().slice(0,6)+"-root",o={id:i,name:"root",path:"",url:"",children:[],data:{id:i,label:"/",initialNodes:[],initialEdges:[],bgColor:"white"}};return e.forEach(i=>{let a=i.path.split("/").slice(2),s=o;a.forEach((i,o)=>{if(""!==i&&"_"!==i[0]){let h=s.children.find(e=>e.name===i);if(!h){var r,c;let u="".concat(l().slice(0,6),"-").concat(i),p=e.find(e=>e.path===n+a.slice(0,o+1).join("/"));h={id:u,name:i,url:"/"+x(i),path:n+a.slice(0,o+1).join("/"),data:{id:u,initialNodes:p&&"component"===t?p.nodes:[],initialEdges:p&&"component"===t?p.edges:[],label:(r=i,("/"===(c=s.data.label)&&(c=""),"index.tsx"===r&&(r="",""!==c))?c:c+"/"+x(r)),bgColor:g(i)?d:"white"},children:[]},s.children.push(h)}s=h}})}),o},g=e=>e.endsWith(".tsx");function x(e){return e.endsWith(".tsx")?e.slice(0,-4):e}let p=(0,o.createContext)({}),f=(0,o.createContext)({}),y=(0,o.createContext)({});var b=n(6851),m=n(7893),E=n.n(m);n(6793);let C={backgroundColor:"#B8CEFF"},j=e=>{let t=new(E()).graphlib.Graph().setDefaultEdgeLabel(()=>({})),n=(e,n,i)=>(t.setGraph({rankdir:i.direction}),n.forEach(e=>t.setEdge(e.source,e.target)),e.forEach(e=>t.setNode(e.id,e)),E().layout(t),{nodes:e.map(e=>{let{x:n,y:i}=t.node(e.id);return{...e,position:{x:n,y:i}}}),edges:n}),{fitView:l}=(0,b._K)(),[a,d,s]=(0,b.Rr)(e.initialNodes),[r,c,h]=(0,b.ll)(e.initialEdges),[u,g]=(0,o.useState)(!1),x=(0,b.RX)(a);return(0,o.useEffect)(()=>{0!==x.width&&0!==x.height&&u&&e.setBounds(x)},[a]),(0,o.useCallback)(e=>{let t=n(a,r,{direction:e});d([...t.nodes]),c([...t.edges])},[a,r]),(0,o.useEffect)(()=>{if(!u){let{nodes:e,edges:t}=n(a,r,{direction:"TB"});d([...e]),c([...t]),a.every(e=>e.width)&&g(!0)}},[a,r]),(0,i.jsx)(b.tV,{children:(0,i.jsx)("div",{style:{height:e.bounds.height+2*e.bounds.y,width:e.bounds.width+2*e.bounds.x},children:(0,i.jsx)(b.x$,{nodesDraggable:!1,panOnDrag:!1,nodes:a,edges:r,onNodesChange:s,onEdgesChange:h,style:C,children:(0,i.jsx)(b.s_,{position:"bottom-right",children:(0,i.jsx)("div",{children:JSON.stringify(x)})})})})})};var w=n(7295),N=n.n(w);let k={route:function(e){let[t,n]=(0,o.useState)(150),[l,a]=(0,o.useState)(46),{isLayouted:d,setIsLayouted:s}=(0,o.useContext)(y);return(0,i.jsxs)("div",{style:{border:"1px solid #1a192b",padding:"10px",borderRadius:"3px",background:e.data.style.backgroundColor,width:t,height:l,textAlign:"center"},onClick:()=>{n(e=>2*e),a(e=>2*e),s(!1),console.log("clicked id:",e.data.id)},children:[(0,i.jsx)(b.HH,{type:"target",position:b.Ly.Top}),(0,i.jsx)("p",{children:e.data.label}),(0,i.jsx)(b.HH,{type:"source",position:b.Ly.Bottom})]})},component:function(e){let[t,n]=(0,o.useState)({x:0,y:0,width:1,height:1});return(0,i.jsxs)("div",{className:"text-updater-node",style:{height:t.height+2*t.y,width:t.width+2*t.x},children:[(0,i.jsx)(b.HH,{type:"target",position:b.Ly.Top,isConnectable:e.isConnectable,id:"target"}),(0,i.jsx)("div",{children:(0,i.jsx)(j,{id:e.data.id,bounds:t,setBounds:n,initialNodes:e.data.initialNodes,initialEdges:e.data.initialEdges})}),(0,i.jsx)(b.HH,{type:"source",position:b.Ly.Bottom,isConnectable:e.isConnectable,id:"source"})]})}},v=new(N()),_=()=>{let{getNodes:e,setNodes:t,getEdges:n,fitView:i}=(0,b._K)(),l={"elk.algorithm":"layered","elk.layered.spacing.nodeNodeBetweenLayers":100,"elk.spacing.nodeNode":80,"elk.hierarchyHandling":"INCLUDE_CHILDREN","elk.layered.nodePlacement.strategy":"NETWORK_SIMPLEX","elk.direction":"DOWN"};return{getLayoutedElements:(0,o.useCallback)(()=>{let o={id:"root",layoutOptions:{...l},children:e(),edges:n()};v.layout(o,{layoutOptions:{"elk.alignment":"TOP"}}).then(e=>{let{children:n}=e;null==n||n.forEach(e=>{e.position={x:e.x,y:e.y}}),t(n),window.requestAnimationFrame(()=>{i()})})},[])}};function O(e){let{fitView:t}=(0,b._K)(),{viewType:n,setViewType:l}=(0,o.useContext)(f),{initialState:a,setInitialState:d,helper:s}=(0,o.useContext)(p),[r,c,h]=(0,b.Rr)(a.initialNodes),[u,g,x]=(0,b.ll)(a.initialEdges),{getLayoutedElements:m}=_(),[E,C]=(0,o.useState)(!1),{isLayouted:j,setIsLayouted:w}=(0,o.useContext)(y);return(0,o.useEffect)(()=>{console.log("node changes in layout effect"),!j&&r.length>1&&u.length>1&&(m(),r.every(e=>e.width&&2!==e.width&&e.height&&2!==e.height)&&(w(!0),console.log("layouted")))},[r,u]),(0,o.useEffect)(()=>{c(a.initialNodes),g(a.initialEdges),C(!1)},[a]),(0,i.jsx)("div",{style:{height:"90vh",width:"90vw"},children:(0,i.jsx)(b.x$,{nodes:r,edges:u,onNodesChange:h,onEdgesChange:x,nodeTypes:k,style:{background:"#008080"},children:(0,i.jsxs)(b.s_,{position:"top-right",children:[(0,i.jsxs)("button",{className:"border border-solid border-black mx-1",onClick:()=>{},children:["view type: ",n]}),(0,i.jsx)("button",{className:"border border-solid border-black mx-1",onClick:()=>{m(),console.log("elk run onclick")},children:"vertical layout"})]})})})}function S(e){return(0,i.jsx)(b.tV,{children:(0,i.jsx)(O,{})})}function T(){function e(e,t){let n=c(t,e);return{initialNodes:n.initialNodes,initialEdges:n.initialEdges}}let[t,n]=(0,o.useState)("route"),[l,a]=(0,o.useState)({initialNodes:[],initialEdges:[]}),[d,s]=(0,o.useState)(!1);return(0,o.useEffect)(()=>{(async()=>{console.log("fetching start");let n=await fetch("http://localhost:3010/raw-file");a(e(t,await n.json())),console.log("fetching finished")})()},[]),(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(f.Provider,{value:{viewType:t,setViewType:n},children:(0,i.jsx)(p.Provider,{value:{initialState:l,setInitialState:a,helper:e},children:(0,i.jsx)(y.Provider,{value:{isLayouted:d,setIsLayouted:s},children:(0,i.jsx)(S,{})})})})})}}},function(e){e.O(0,[241,797,987,534,888,774,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);