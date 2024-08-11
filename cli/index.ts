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

program.command('extract')
  .description('Extract routes and components files in project\'s directory')
  .action(() => {
    console.log('Starting to extract routes and components')
    const getFileExtension = (filename) => filename.split('.').pop()
    const allowedExtensions = new Set(['tsx'])

    let isPagesFolderFound = false
    let isUsingNextPackage = false

    function rec_file(folderPath, prefix, res) {
      const dirs = fs.readdirSync(folderPath, { withFileTypes: true })
      dirs.forEach((dir) => {
        const fullPath = (prefix + '/' + dir.name).substring(1)
        if (dir.name.endsWith('package.json')) {
          const content = fs.readFileSync(fullPath, 'utf8')
          if (content.includes('"next"')) {
            isUsingNextPackage = true
          }
        }

        if (fullPath === 'pages' || fullPath === 'src/pages') {
          isPagesFolderFound = true
        }

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
    console.log('Start parsing from: ', currentPath)

    let dirRes = [] as RawFile[];
    rec_file(currentPath, '', dirRes)

    if (!isUsingNextPackage) {
      console.log('Fail to parse: Next.js not found in package')
      return
    }

    if (!isPagesFolderFound) {
      console.log('Fail to parse: Pages folder not found')
      return
    }

    console.log('Starting to write the result to data.json')
    console.log('Writing to:', config.rawFileOutputPath)

    try {
      fs.writeFileSync(config.rawFileOutputPath, JSON.stringify(dirRes));
    } catch (err) {
      console.error(err);
    }

    console.log('Parse finished')
  });

program.command('config')
  .description('Show user config')
  .action(() => {
    console.log('Config:', config);
  });

program.command('visualize')
  .description('Run visualizer website')
  .action (() => {
    execSync(`node ${config.serverPath}`, {stdio: 'inherit'})
  })

program.parse();