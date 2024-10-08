"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = __importDefault(require("process"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var commander_1 = require("commander");
var config_1 = require("./config");
var execSync = require('child_process').execSync;
var program = new commander_1.Command();
program
    .name('jabi-next-visualizer')
    .description('Visualizer for Next.js routes and components');
program.command('extract')
    .description('Extract routes and components files in project\'s directory')
    .action(function () {
    console.log('Starting to extract routes and components');
    var getFileExtension = function (filename) { return filename.split('.').pop(); };
    var allowedExtensions = new Set(['tsx']);
    var isPagesFolderFound = false;
    var isUsingNextPackage = false;
    function rec_file(folderPath, prefix, res) {
        var dirs = fs_1.default.readdirSync(folderPath, { withFileTypes: true });
        dirs.forEach(function (dir) {
            var fullPath = (prefix + '/' + dir.name).substring(1);
            if (dir.name.endsWith('package.json')) {
                var content = fs_1.default.readFileSync(fullPath, 'utf8');
                if (content.includes('"next"')) {
                    isUsingNextPackage = true;
                }
            }
            if (fullPath === 'pages' || fullPath === 'src/pages') {
                isPagesFolderFound = true;
            }
            if (dir.isDirectory() && dir.name !== 'node_modules' && !dir.name.startsWith('.')) {
                rec_file(path_1.default.join(dir.path, dir.name), prefix + '/' + dir.name, res);
            }
            if (allowedExtensions.has(getFileExtension(dir.name))) {
                var fullPath_1 = (prefix + '/' + dir.name).substring(1);
                try {
                    res.push({
                        name: dir.name,
                        path: fullPath_1,
                        content: fs_1.default.readFileSync(fullPath_1, 'utf8')
                    });
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    }
    var currentPath = process_1.default.cwd();
    console.log('Start parsing from: ', currentPath);
    var dirRes = [];
    rec_file(currentPath, '', dirRes);
    if (!isUsingNextPackage) {
        console.log('Fail to parse: Next.js not found in package');
        return;
    }
    if (!isPagesFolderFound) {
        console.log('Fail to parse: Pages folder not found');
        return;
    }
    console.log('Starting to write the result to data.json');
    console.log('Writing to:', config_1.config.rawFileOutputPath);
    try {
        fs_1.default.writeFileSync(config_1.config.rawFileOutputPath, JSON.stringify(dirRes));
    }
    catch (err) {
        console.error(err);
    }
    console.log('Parse finished');
});
program.command('config')
    .description('Show user config')
    .action(function () {
    console.log('Config:', config_1.config);
});
program.command('visualize')
    .description('Run visualizer website')
    .action(function () {
    execSync("node ".concat(config_1.config.serverPath), { stdio: 'inherit' });
});
program.parse();
