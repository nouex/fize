"use strict";

// TODO: outpu with colors
const info = require( "./index" );

let targetpath = process.argv[ 2 ];

function put( info ) {
	let totalSize = 0;
	let exts = Object.keys( info.exts )

	console.log( "\n\n" );
	for ( const key of exts ) {
		const ext = info.exts[ key ];
		const size = ext.size;
		totalSize += size;
		console.log( `${key} ${ext.fileCount} ${byteToHuman( size )}` )
	}

	totalSize = byteToHuman( totalSize );
	console.log( "-------------" );
	console.log( `found ${info.fileCount} ${totalSize}` );
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
// usage

put( info( targetpath ) );
