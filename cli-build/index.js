"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDir = void 0;
var process_1 = __importDefault(require("process"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var commander_1 = require("commander");
var config_1 = require("./config");
var program = new commander_1.Command();
program
    .name('jabi-next-visualizer')
    .description('Visualizer for Next.js routes and components');
var listDir = function () {
    console.log('Starting to parse routes and components');
    var getFileExtension = function (filename) { return filename.split('.').pop(); };
    var allowedExtensions = new Set(['tsx']);
    function rec_file(folderPath, prefix, res) {
        var dirs = fs_1.default.readdirSync(folderPath, { withFileTypes: true });
        dirs.forEach(function (dir) {
            if (dir.isDirectory() && dir.name !== 'node_modules' && !dir.name.startsWith('.')) {
                rec_file(path_1.default.join(dir.path, dir.name), prefix + '/' + dir.name, res);
            }
            if (allowedExtensions.has(getFileExtension(dir.name))) {
                var fullPath = (prefix + '/' + dir.name).substring(1);
                try {
                    res.push({
                        name: dir.name,
                        path: fullPath,
                        content: fs_1.default.readFileSync(fullPath, 'utf8')
                    });
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    }
    var currentPath = process_1.default.cwd();
    var dirRes = [];
    rec_file(currentPath, '', dirRes);
    console.log('Starting to write the result to data.json');
    console.log('Writing to:', config_1.config.rawFileOutputPath);
    try {
        // fs.writeFileSync('/Users/ranjabi/Desktop/Coding/jabi-next-visualizer/app/.visualizer/data.json', JSON.stringify(dirRes));
        fs_1.default.writeFileSync(config_1.config.rawFileOutputPath, JSON.stringify(dirRes));
    }
    catch (err) {
        console.error(err);
    }
    console.log('Parse finished');
};
exports.listDir = listDir;
program.command('listdir')
    .description('List files in project\'s directories')
    .action(function () {
    (0, exports.listDir)();
});
program.command('curdir')
    .description('Curent dir from project directory')
    .action(function () {
    console.log("Curent dir from project directory:", process_1.default.cwd());
});
program.command('config')
    .action(function () {
    console.log('Config:', config_1.config);
});
program.parse();
