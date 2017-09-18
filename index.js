"use strict";

module.exports = traverseDir;

const fs = require( "fs" );
const path = require( "path" );
const assert = require( "assert" );
const colors = require( "colors" );
const log = require( "./helpers" ).log;

const TYPE_FILE = Symbol();
const TYPE_DIR = Symbol();

function traverseDir( objectPath, info, depth, excludePaths, verbose ) {
	if ( depth <= -1 ) return;
	if ( info == undefined ) {
		info = {
			fileCount: 0,
			exts: {}
		};
	}

	let object, type

	object = path.resolve( objectPath );
	type = exists( object )
	if (type === TYPE_DIR) {
		object = fs.readdirSync( object );
		object.forEach( ( filePath ) => {
			filePath = path.resolve( objectPath, filePath );
			// FIXME: the user doesn't pass fully resolved path names i don't think
			//	so this woul'dnt work
			if ( ~excludePaths.indexOf( filePath ) ) return;
			let fileType = exists( filePath );
			switch ( fileType ) {
			case TYPE_DIR:
				traverseDir( filePath, info, --depth, excludePaths, verbose );
				break;
			case TYPE_FILE:
				foundFile( filePath, info, verbose );
				break;
			default:
	        // skip
				break;
			}
		}, void ( 0 ) );
	} else if (type === TYPE_FILE) {
		foundFile(object, info, verbose)
	} else throw new Error("last arg must be an existing file or directory")

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

function foundFile( filePath, info, verbose ) {
	let buffer,
		fileParsed;

	info.fileCount += 1;
	fileParsed = path.parse( filePath );
	buffer = fs.readFileSync( filePath );
	checkExtension( fileParsed.ext, buffer.length, info );
	verbose ? log( colors.blue( "file: " ) + filePath ) : void ( 0 );
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
