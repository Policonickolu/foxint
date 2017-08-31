// HTML parser
const ch = require('cheerio');

const inputFileName = 'test.html';
const outputFileName = 'test-result.json';

// File System functions
var io = require('./fileio');

var scraper = require('./scraper');
var formatter = require('./formatter');

var html = io.readCleanedFile(inputFileName);

// HTML elements accessor function, $variable => HTML element
var $ = ch.load(html, {
          ignoreWhitespace: true,
          xmlMode: true,
        });

var data = scraper.getDataFromHTML($);

var result = formatter.format(data);

io.writeFile(result, outputFileName);


