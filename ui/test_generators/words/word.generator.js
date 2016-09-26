'use strict';
var fs = require('fs');
var uniqueRandomArray = require('unique-random-array');
var nounListPath = require('./nounlist');
var wordListPath = require('./wordlist');
/**
 * usage :
 * wordGen = require('./words/word.generator')
 * to generate any english word
 *      wordGen.word()
 * to generate an english noun
 *      wordGen.noun()
 * @type {{noun: *, word: *}}
 */
module.exports = {
    noun: uniqueRandomArray(fs.readFileSync(nounListPath, 'utf8').split('\n')),
    word: uniqueRandomArray(fs.readFileSync(wordListPath, 'utf8').split('\n')),
};
