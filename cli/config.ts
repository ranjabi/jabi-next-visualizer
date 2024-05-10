import process from 'process';

// export const getConfig = () => {
//   const config = {
//     cliPath: process.cwd() + '/cli-build',
//     rawFileOutputPath: process.cwd() + '/node_modules/jabi-next-visualizer/app/.visualizer/data.json'
//   }

//   console.log('Config:', config)

//   return config
// }

export const config = {
  cliPath: process.cwd() + '/cli-build',
  rawFileOutputPath: process.cwd() + '/node_modules/jabi-next-visualizer/app/.visualizer/data.json',
  appPath: process.cwd() + '/node_modules/jabi-next-visualizer/app/out',
  appIndexPath: process.cwd() + '/node_modules/jabi-next-visualizer/app/out/index.html'
}