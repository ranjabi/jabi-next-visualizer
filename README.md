# jabi-next-visualizer
Visualizer for Next.js routes and components

## How to Use On a Project:
1. Install package
`npm install /Users/ranjabi/Desktop/Coding/jabi-next-visualizer`
2. Run listdir to parse project source code into rawFile
`node ./node_modules/jabi-next-visualizer/cli-build/index.js listdir`
3. Run server for visualizer app preview
`node ./node_modules/jabi-next-visualizer/cli-build/server.js`

## Deployment:
After developing package:
1. `npm run tsc`

## Development:
To run package inside sample app (so we don't need to switch into test project folder):
Javascript: ```ranjabi: sample-app main > node ../index.js listdir```
Typescript: ```ranjabi: sample-app main > npm run ts-node ../index.ts listdir```

On project directory:
```
pwd = /Users/ranjabi/Desktop/Coding/jabi-next-visualizer-test
lib = /Users/ranjabi/Desktop/Coding/jabi-next-visualizer-test/node_modules/jabi-next-visualizer
cli = /Users/ranjabi/Desktop/Coding/jabi-next-visualizer-test/node_modules/jabi-next-visualizer/cli-build
app = /Users/ranjabi/Desktop/Coding/jabi-next-visualizer-test/node_modules/jabi-next-visualizer/app
```

Plan:
-./ prepare typescript compile flow
-./ bikin cli
    -./ ngehasilin data.json hasil parsing
-./ bikin app
    - baru bisa jalan kalo udah jalanin command parsing
    -./ homepage nampilin visualisasi