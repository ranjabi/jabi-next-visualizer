import process from 'process';
import fs from 'fs';
import path from "path";
import { Command } from 'commander';
import { RawFile } from './types';

const program = new Command();

program
  .name('jabi-next-visualizer')
  .description('Visualizer for Next.js routes and components');

export const listDir = () => {
  console.log('Starting to listdir')
  const getFileExtension = (filename) => filename.split('.').pop()
  const allowedExtensions = new Set(['tsx', 'ts'])

  function rec_file(folderPath, prefix, res) {
    const dirs = fs.readdirSync(folderPath, { withFileTypes: true })
    dirs.forEach((dir) => {
      if (dir.isDirectory() && dir.name !== 'node_modules' && !dir.name.startsWith('.')) {
        rec_file(path.join(dir.path, dir.name), prefix + '/' + dir.name, res)
      }
      if (allowedExtensions.has(getFileExtension(dir.name))) {
        const fullPath = (prefix + '/' + dir.name).substring(1)
        try {
          res.push({
            name: dir.name,
            path: fullPath,
            content: fs.readFileSync(fullPath, 'utf8')
          })
        } catch (err) {
          console.error(err);
        }

      }
    })
  }

  const currentPath = process.cwd()
  let dirRes = [] as RawFile[];
  rec_file(currentPath, '', dirRes)

  console.log('Starting to write the result to data.json')

  try {
    fs.writeFileSync('/Users/ranjabi/Desktop/Coding/jabi-next-visualizer/app/public/data.json', JSON.stringify(dirRes));
  } catch (err) {
    console.error(err);
  }

  console.log('Listdir finished')
}

program.command('listdir')
  .description('List files in project\'s directories')
  .action(() => {
    listDir()
  });

program.command('curdir')
  .description('Curent dir from project directory')
  .action(() => {
    console.log("Curent dir from project directory:", process.cwd());
  });

program.parse();