#!/usr/bin/env node
"use strict";

const info = require( "./index" );
const colors = require( "colors" );
const nconf = require( "nconf" );
const log = require( "./helpers" ).log;

nconf.argv( {
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
} ).env( {
	verbose: /^verbose$/i,
	excludePaths: /^exclude_paths$/i,
	depth: /^depth$/i,
	afterDot: /^after_dot$/i
} ).defaults( {
	verbose: true,
	excludePaths: [],
	depth: Infinity,
	afterDot: 2
} );

let targetpath, _ = nconf.get("_")
switch (_.length) {
	case 0:
		targetpath = process.cwd()
		break;

	case 1:
		targetpath = _[0]
		break;

	default:
		// TODO: add support for mult. files
		throw new Error("a single target file must be provided")
		break;
}

put(
	info( targetpath, null, nconf.get( "depth" ),
				nconf.get( "excludePaths" ), nconf.get( "verbose" ) ) );

function put( info ) {
	let totalSize = 0;
	let exts = Object.keys( info.exts );
	let out = [];
	let colSize = [ -Infinity, -Infinity, -Infinity ];
	let wSpace = " ";
	let colColors = [];
	let outInd = 0;

	colColors[ 0 ] = colors.blue.bind( colors );
	colColors[ 1 ] = colors.magenta.bind( colors );
	colColors[ 2 ] = colors.magenta.bind( colors );

	log( colors.black.bold( "---------------" ) );
	for ( const key of exts ) {
		const ext = info.exts[ key ];
		const size = ext.size;
		const o = out[ outInd++ ] = [];
		const byteHuman = byteToHuman( size, nconf.get( "afterDot" ) )

		// override max size if found
		colSize[ 0 ] = Math.max( colSize[ 0 ], ( "" + key ).length );
		o.push( key + "" );
		colSize[ 1 ] = Math.max( colSize[ 1 ], ( "" + ext.fileCount ).length );
		o.push( ext.fileCount );
		colSize[ 2 ] = Math.max( colSize[ 2 ], byteHuman.length );
		o.push( byteHuman );
		totalSize += size;
	}

	for ( const o of out ) {
		let line = [],
			whole = "";
		for ( const ind in o ) {
			if ( !o.hasOwnProperty( ind ) ) continue;
			let oo = String( o[ ind ] );
			let clearance = colSize[ ind ] - oo.length;
			line[ ind ] = String( oo );
			while ( clearance-- ) line[ ind ] += wSpace;
			line[ ind ] = colColors[ ind ]( line[ ind ] );
		}
		whole = line.join( wSpace );
		log( whole );
	}

	totalSize = byteToHuman( totalSize, nconf.get( "afterDot" ) );
	log( colors.black.bold( "---------------" ) );
	log( colors.green( `found ${info.fileCount} files, ${totalSize}` ) );

	return void ( 0 );
}

function byteToHuman( bytes, afterDot ) {
	afterDot = Number( afterDot );
	bytes = +bytes;

	let units = [ "b", "kb", "mb", "gb", "tb", "?", "??", "???", "????" ];
	let count,
		dotInd;

	for ( count = 0; bytes > 1024; bytes = bytes / 1024, count++ ) ;

	bytes = String( bytes );
	dotInd = bytes.indexOf( "." );

	if ( ~dotInd ) {
		if ( afterDot === 0 ) {
			bytes = bytes.slice( 0, dotInd );
		} else {
			bytes = bytes.slice( 0, dotInd + afterDot + 1 );
		}
	}
	return "" + bytes + units[ count ];
}
