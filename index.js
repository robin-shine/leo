'use strict'

var fs = require('fs');
var log4js = require('log4js');
var path = require('path');
var os = require('os');

var DIR = path.resolve(__dirname, './test');
var THREAD_NUM = os.cpus().length;

var logger = log4js.getLogger();
logger.log('目前检测的文件夹路径为：');
logger.log(DIR);

function getFullPath(dir, files) {
  return files.map(function (f) {
    return path.join(dir, f);
  });
}

var REG = {
	LET : /\blet\b/,
	CONST: /\bconst\b/,
	AWAIT: /\bawait\b/,
}

function pathWalk(path, floor, cb) {  
    cb(path, floor);  
    floor++;  
    fs.readdir(path, function(err, files) {  
        if (err) return logger.error('read dir error');  

        files.forEach(function(item) {  
            var tmpPath = path + '/' + item;  
            fs.stat(tmpPath, function(err1, stats) {  
                if (err1) return logger.error('stat error');  
                if (stats.isDirectory()) {  
                    pathWalk(tmpPath, floor, cb);  
                } else {  
                    cb(tmpPath, floor);  
                }  
           	});  
        });  
    });  
}  

function handleFile(path, floor) {  
    fs.stat(path, function(err1, stats) {  
        if (err1) return logger.error('stat error');   

        if (stats.isDirectory()) {  
            // logger.log(path);  
        } else {  
            fs.readFile(path, 'utf8', function(err, data){
				if(err) return logger.error(err);

				checkES6(data, path);
			});
		}   
    })   
}

function checkES6 (dataString, path) {
	for (var key in REG) {
		var isWithES6 = REG[key].test(dataString);
		if (isWithES6) {
			logger.warn('代码中包含ES6代码!!!');
			logger.warn('ES6语法代码为:');
			logger.warn(key);
			logger.warn('ES6代码所在文件名为:');
			logger.warn(path)
		} 
	}
}

pathWalk(DIR, 0, handleFile)