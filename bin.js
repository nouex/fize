"use strict";

// TODO: outpu with colors
const info = require( "./index" );
const colors = require("colors");

let targetpath = process.argv[ 2 ];

put( info( targetpath ) );

function put( info ) {
	let totalSize = 0;
	let exts = Object.keys( info.exts )

	log( colors.black.bold("---------------") );
	for ( const key of exts ) {
		const ext = info.exts[ key ];
		const size = ext.size;
		totalSize += size;
		log( `${colors.magenta(key)} ${colors.blue(ext.fileCount)} ${colors.blue(byteToHuman( size ))}` );
	}

	totalSize = byteToHuman( totalSize );
	log( colors.black.bold("---------------") );
	log( colors.green(`found ${info.fileCount} files, ${totalSize}`) );

	return void ( 0 );
}

function byteToHuman( bytes ) {
	bytes = +bytes;

	let units = [ "b", "kb", "mb", "gb", "tb", "?", "??", "???", "????" ];
	let count,
		dotInd;

	for ( count = 0; bytes > 1024; bytes = bytes / 1024, count++ ) ;

	bytes = String( bytes );
	dotInd = bytes.indexOf( "." );

	if ( ~~dotInd ) bytes = bytes.slice( 0, dotInd + 3 );

	return "" + bytes + units[ count ];
}

function log( _ ) {
	process.stdout.write( _+"\r\n", "utf8" );
}
