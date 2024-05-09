import process from 'process';
import fs from 'fs';
import path from "path";
import { Command } from 'commander';

const program = new Command();

program
  .name('jabi-next-visualizer')
  .description('Visualizer for Next.js routes and components');

export function currentDirFromPackage() {
  console.log("currentDirFromPackage:", process.cwd());
}

export const listDir = () => {
  const getFileExtension = (filename) => filename.split('.').pop()
  const allowedExtensions = new Set(['tsx', 'ts'])

  function rec_file(folderPath, prefix, res) {
    const dirs = fs.readdirSync(folderPath, { withFileTypes: true })
    dirs.forEach((dir) => {
      if (dir.isDirectory() && dir.name !== 'node_modules' && !dir.name.startsWith('.')) {
        rec_file(path.join(dir.path, dir.name), prefix + '/' + dir.name, res)
      }
      if (allowedExtensions.has(getFileExtension(dir.name))) {
        res.set(prefix + '/' + dir.name, 'value')
      }
    })
  }

  const currentPath = process.cwd()
  let dirRes = new Map();
  rec_file(currentPath, '', dirRes)
  const objDirRes = Object.fromEntries(dirRes)
  console.log(objDirRes)
}

program.command('listdir')
  .description('List files in project\'s directories')
  .action(() => {
    console.log('list dir run')
    listDir()
  });

program.parse();