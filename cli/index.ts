import process from 'process';
import fs from 'fs';
import path from "path";
import { Command } from 'commander';
import { RawFile } from './types';
import { config } from './config';
const { execSync } = require('child_process');

const program = new Command();

program
  .name('jabi-next-visualizer')
  .description('Visualizer for Next.js routes and components');

program.command('parse')
  .description('Parse routes file in project\'s directory')
  .action(() => {
    console.log('Starting to parse routes and components')
    const getFileExtension = (filename) => filename.split('.').pop()
    const allowedExtensions = new Set(['tsx'])

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
    console.log('Writing to:', config.rawFileOutputPath)

    try {
      // fs.writeFileSync('/Users/ranjabi/Desktop/Coding/jabi-next-visualizer/app/.visualizer/data.json', JSON.stringify(dirRes));
      fs.writeFileSync(config.rawFileOutputPath, JSON.stringify(dirRes));
    } catch (err) {
      console.error(err);
    }

    console.log('Parse finished')
  });

// program.command('curdir')
//   .description('Curent dir from project directory')
//   .action(() => {
//     console.log("Curent dir from project directory:", process.cwd());
//   });

program.command('config')
  .action(() => {
    console.log('Config:', config);
  });

program.command('server')
  .action (() => {
    execSync(`node ${config.serverPath}`, {stdio: 'inherit'})
  })

program.parse();