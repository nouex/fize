#!/usr/bin/env node
"use strict";

const info = require( "./index" );
const colors = require("colors");
const nconf = require("nconf");
const log = require("./helpers").log;

nconf.argv({
	verbose: {
		alias: "v",
		type: "boolean"
	},
	excludePaths: {
		type: "array"
	},
	depth: {
		alias: "d"
	},
	afterDot: {
		type: "number"
	}
}).env({
	verbose: /^verbose$/i,
	excludePaths: /^exclude_paths$/i,
	depth: /^depth$/i,
	afterDot: /^after_dot$/i
}).defaults({
	verbose: true,
	excludePaths: [],
	depth: Infinity,
	afterDot: 2
});
/*
console.log(nconf.get("verbose"), nconf.get("excludePaths"), nconf.get("depth"), nconf.get("afterDot"))

process.exit(0)
*/
let targetpath = process.argv[ process.argv.length -1 ];

put(
	info( targetpath, null, nconf.get("depth"),
				nconf.get("excludePaths"), nconf.get("verbose") ));

function put( info ) {
	let totalSize = 0;
	let exts = Object.keys( info.exts )

	log( colors.black.bold("---------------") );
	for ( const key of exts ) {
		const ext = info.exts[ key ];
		const size = ext.size;
		totalSize += size;
		log( `${colors.blue(key)} ${colors.magenta(ext.fileCount)} ${colors.magenta(byteToHuman( size, nconf.get("afterDot")))}` );
	}

	totalSize = byteToHuman( totalSize, nconf.get("afterDot"));
	log( colors.black.bold("---------------") );
	log( colors.green(`found ${info.fileCount} files, ${totalSize}`) );

	return void ( 0 );
}

function byteToHuman( bytes, afterDot ) {
	bytes = +bytes;

	let units = [ "b", "kb", "mb", "gb", "tb", "?", "??", "???", "????" ];
	let count,
		dotInd;

	for ( count = 0; bytes > 1024; bytes = bytes / 1024, count++ ) ;

	bytes = String( bytes );
	dotInd = bytes.indexOf( "." );

	if ( ~~dotInd ) bytes = bytes.slice( 0, dotInd + afterDot +1 );

	return "" + bytes + units[ count ];
}
