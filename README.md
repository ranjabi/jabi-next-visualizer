# jabi-next-visualizer
Visualizer for Next.js routes and components

To run package inside sample app:
Javascript: ```ranjabi: sample-app main > node ../index.js listdir```
Typescript: ```ranjabi: sample-app main > npm run ts-node ../index.ts listdir```

To run package from project app:
```node ./node_modules/jabi-next-visualizer/index.js listdir```

Plan:
- prepare typescript compile flow
- bikin cli
    - ngehasilin data.json hasil parsing
- bikin app
    - baru bisa jalan kalo udah jalanin command parsing
    - api untuk parsing
    - homepage nampilin visualisasi