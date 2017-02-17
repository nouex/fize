"use strict";
/**
  * Stats for
  *   1. n of files by lang
  *   2. n of bytes by lang
  * TODO: add verbose ooption for loggins
  * TODO: use nconf to get config of opts:
  *   verbose
  *   exlude-paths=NIL
  *   depth=INFINITY
  *   format-size:2after dot
  */

module.exports = traverseDir;

const fs = require( "fs" );
const path = require( "path" );
const assert = require( "assert" );

const TYPE_FILE = Symbol();
const TYPE_DIR = Symbol();

function traverseDir( dirPath, info ) {
	if ( info === undefined ) {
		info = {
			fileCount: 0,
			exts: {}
		};
	}

	let dir;

	dir = path.resolve( dirPath );
	assert.strictEqual( exists( dir ), TYPE_DIR );
	dir = fs.readdirSync( dir );
	dir.forEach( ( filePath ) => {
		filePath = path.resolve( dirPath, filePath );
		let fileType = exists( filePath );
		switch ( fileType ) {
		case TYPE_DIR:
			traverseDir( filePath, info );
			break;
		case TYPE_FILE:
			foundFile( filePath, info );
			break;
		default:
        // skip
			break;
		}
	}, void ( 0 ) );

	return info;
}

/**
  * If new ext, register it.
  *   1. update fileCount
  *   2. update size
  */
function checkExtension( ext, byteCount, info ) {
	ext = ext || "<no-ext>";
	byteCount = +byteCount;

	let extArr;

	if ( info.exts[ ext ] === undefined ) {
		info.exts[ ext ] = {
			size: 0,
			fileCount: 0
		};
	}

	extArr = info.exts[ ext ];
	extArr.size += byteCount;
	extArr.fileCount += 1;

	return void ( 0 );
}

function foundFile( filePath, info ) {
	let buffer,
		fileParsed;

	info.fileCount += 1;
	fileParsed = path.parse( filePath );
	buffer = fs.readFileSync( filePath );
	checkExtension( fileParsed.ext, buffer.length, info );
	return void ( 0 );
}

function exists( path ) {
	let stat;

	stat = fs.statSync( path );
	if ( stat == null ) return null;
	else if ( stat.isFile() ) return TYPE_FILE;
	else if ( stat.isDirectory() ) return TYPE_DIR;
  // something we don't care about
	else return null;
}
