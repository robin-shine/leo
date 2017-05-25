'use strict'

var fs = require('fs');
var log4js = require('log4js');
var path = require('path');

var DIR = path.resolve(__dirname, './test');


var logger = log4js.getLogger();
logger.warn(DIR);

function eachFile(dir) {
	fs.stat(dir, function (err, stats) {
    	if (err) return callback(err);
    	if (stats.isFile()) {
    		logger.warn(stats)
    	} else if (stats.isDirectory()) {
    		fs.readdir(DIR, function (err, stats) {
    			if (err) return callback(err);
    			logger.warn(stats)
    		})
    	}
	})
}

eachFile(DIR)