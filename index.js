var fs = require('fs');
var path = require('path');
const IN_PATH = path.resolve(__dirname, 'in');
const files = fs.readdirSync(IN_PATH);

var isCSV = function (fileName) {
    return fileName.split('.')
        .indexOf('csv') > -1;
};

var getFilePaths = function (fileName) {
    return path.resolve(__dirname, `in/${fileName}`);
};

var readFile = function (filePath) {
    try {
        const csvFile = fs.readFileSync(filePath, 'utf-8');
        const fileName = filePath.split('/')
            .pop();
        return {
            fileName,
            csvFile
        };
    } catch (e) {
        console.error(e);
    }
};

var writeFile = function (fileObject) {
    const FILE_NAME = fileObject.fileName;
    const WRITE_PATH = path.resolve(__dirname, `out/${FILE_NAME}`);

    // Write files asynchronously
    fs.writeFile(WRITE_PATH, fileObject.output,() => {
      console.log(`[WRITTEN]${WRITE_PATH}`);
    });
};
var processFile = function (fileObject) {
    const fileName = fileObject.fileName;
    const csvFile = fileObject.csvFile;
    const broken = csvFile.split('\n');
    const cleaned = broken.filter(line => {
        return line.indexOf('#') < 0 && //purge comments from output
            line.length > 0;
    });
    const output = cleaned[0].trim()
        .split(' ')
        .join();
    return {
        fileName,
        output
    };
};

files.filter(isCSV)
    .map(getFilePaths)
    .map(readFile)
    .map(processFile)
    .forEach(writeFile);
