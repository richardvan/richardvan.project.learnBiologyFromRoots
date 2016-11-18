var express = require('express');					// node framework for handling request/response
																							// high-level api on top of [html][url]
var json2html = require('node-json2html')	// node library
																					// TODO: node library mongoose and mongodb setup
																					// TODO: node library moment for date handling
																	
																					// TODO: node library jade or handlebars for templating
// var sassMiddleware = require('node-sass-middleware'); // node library css preprocessor

var browserify = require('browserify-middleware');
																					

var app = express();


/**
 * Module dependencies.
 */

var debug = require('debug')('richardvan.project.learnBiologyFromRoots:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


//app.use(express.static(__dirname + '/public'));
//
//// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
app.get('/javascripts/bundle.js', browserify('./client/script.js'));	//browserify setup
if (app.get('env') === 'development') {																//browser-sync setup
  var browserSync = require('browser-sync');
  var config = {
    files: ["public/**/*.{js,css}", "client/*.js", "sass/**/*.scss", "views/**/*.jade"],
    logLevel: 'debug',
    logSnippet: false,
    reloadDelay: 3000,
    reloadOnRestart: true
  };
  var bs = browserSync(config);
  app.use(require('connect-browser-sync')(bs));
}

app.get('/', function(request, response) {
  console.log('[calling..] /');
	// create html on the fly from json object 
	var html = 	'<h1>Learn biology project!</h1>' +
							'		<h2> Root Finder 1.0 </h2>' + 
							'			<div>	type in /findRoots/[wordToLookUp] <div>' +
							'			<br>' +
							'			<div>	TODO - put as textbox on this page <div>' +
							'			<div>	TODO - GRE word in MongoDB?' +
							'			<div>	TODO - GRE last 5 words' +
							'			<div>	 <div>';
		
  response.send (html);
});

app.get('/findRoots/:word', function(request, response) {
  console.log('[calling..] /findRoots/'+request.params.word);
	
	// create html on the fly from json object using JSON2HTML
	//	 http://json2html.com/#tabs
	var html = '<h2>'+request.params.word+'</h2>';
	
	var transform = {"<>":"div","id":"${_variation}","style":"display: inline-block;margin-left: 30px","html":[
										{"<>":"div","html":"<b>${_variation}</b> (${_root})"},
										{"<>":"div","html":" <i>${_language}</i>"},
										{"<>":"div","html":" ${_meaning}</i>"},
										{"<>":"div","html":"<br>"}
									]};
	
	var roots = findRoots(request.params.word, dictionaryOfRootEntries);
	html += json2html.transform(roots,transform);
	
  response.send(html);
});



/////////////////////////////////////////////////////////
// Getting the raw data from relative file path
//////////////////////////
var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, 'testData_letterB.input');
var inputDictionaryToClean = "TODO_dictionary";

inputDictionaryToClean = fs.readFileSync(filePath).toString().split("\n");
//for(i in inputDictionaryToClean) {
//    console.log(inputDictionaryToClean[i]);
//}

// ## abbreviations 
var dictionaryOfAbbreviationsToLanguage = {
	Af: 'African',
	Ar: 'Arabic',
	AS: 'Anglo-Saxon',
	Br: 'Brazilian',
	Ch: 'Chilean',
	Dan: 'Danish',
	E: 'English',
	EI: 'East Indian',
	F: 'French',
	Far: 'Faroese',
	G: 'Greek',
	Ger: 'German',
	Go: 'Gothlandic',
	H: 'Hindustani',
	Hb: 'Hebrew',
	Ice: 'Icelandic',
	It: 'Italian',
	L: 'Latin',
	LL: 'Low Latin; Late Latin',
	Mai: 'Malayan',
	Mex: 'Mexican',
	ME: 'Middle English',
	ML: 'Middle Latin',
	My: 'Mythology',
	N: 'a proper name',
	NL: 'New Latin',
	OF: 'Old French',
	OHG: 'Old High German',
	Pg: 'Portuguese',
	Pp: 'Papuan',
	Ps: 'Persian',
	Pv: 'Peruvian',
	Rs: 'Russian',
	SAm: 'South American',
	Sp: 'Spanish',
	Sw: 'Swedish'
}

	
//////////////////
// MAIN body START
console.log("************* START OF MAIN");
//	console.log(":- DEBUG: ' findRoots('"+inputDictionaryToClean+"')");
console.log(" *CALL: 'cleanRawDictionary:----");
var dictionaryOfRootEntries = cleanRawDictionary(inputDictionaryToClean);


//console.log(" *CALL: 'findRoots:----");
//console.log(findRoots("abdicate",dictionaryOfRootEntries));			// TEST basic test, one result
//console.log(findRoots("adolescence",dictionaryOfRootEntries));
//console.log(findRoots("actuary",dictionaryOfRootEntries));
//console.log(findRoots("acus",dictionaryOfRootEntries));					// TEST against =acus
//console.log(findRoots("agnus",dictionaryOfRootEntries));				// TEST against agn,:i, =us
//console.log(findRoots("myostatin",dictionaryOfRootEntries));				

console.log("************* END OF MAIN");


////////
// FUNCTIONS
//		== 	Initialization
//				Dictionary Setup
function DictionaryEntry(root,language,meaning) {			// js object, treated like struct
    this._root = root;																// *notice uppercase naming convention
    this._language = language;
    this._meaning = meaning;
}


function cleanRawDictionary(dictionaryToClean){
	var returnValue = "TODO_cleanDictionaryReturnVALUE";
	console.log (":- DEBUG: 'dictionaryToClean START");
	
	// when copied, some longer entries finish as multi-entries, 
	// change these to one line by knowing its multi if it 
	// doesn't have a language which is delimited by (*)
	// where * is a wildcard with possible abbreviations
	

	
	var dictionaryFormattedAsEntries = [];
	for (var key in dictionaryToClean)
	{
//  	console.log("key: '%s, value: '%s", key, dictionaryToClean[key])
		
		// skip spaces
		if (dictionaryToClean[key] === "")
		{
//			console.log("**Blank Line**");
			continue;
		}
		
		
		// there are no * or «, misread as =
		dictionaryToClean[key] = dictionaryToClean[key].replace(/[*«•]/g,'=');
	

	
		// if it doesn't have (*), then add it to previous entry
		var regExp = /\(([^)]+)\)/;
		var matches = regExp.exec(dictionaryToClean[key]);
		//		matches[1]  contains the value between the parentheses
		//					  		otherwise null means it is multiline
		if (matches === null || matches[1] === null)
		{
//			console.log(" : 'this is MULTILINE");
			// previous value will be on top of list
			var updatedPreviousValue = dictionaryFormattedAsEntries.pop();
			updatedPreviousValue._meaning += dictionaryToClean[key];
			dictionaryFormattedAsEntries.push(updatedPreviousValue);
		}
		else
		{
//			console.log(" matches[0]: '" + matches[0]); 	// (G)
//			console.log(" Language: '" + matches[1]);		// G																			
			var splits = dictionaryToClean[key].split(' ' + matches[0] + '. '); // split on ' (L). '
//			console.log(splits); // [0] = root /w variability, [1] = meaning
			var newEntry = new DictionaryEntry(splits[0],matches[1],splits[1]);
													
			dictionaryFormattedAsEntries.push(newEntry);
		}
	}
	
//	console.log (":- DEBUG: 'dictionaryToClean after FIRST CLEAN");
//	console.log (dictionaryFormattedAsEntries);
	console.log ("    LENGTH: '" + dictionaryFormattedAsEntries.length);



	console.log (":- DEBUG: 'dictionaryToClean END");

	// TODO: 'update this once it's further cleaned
	returnValue = dictionaryFormattedAsEntries;
	return returnValue;
}


///// TODO
// To further clean
// 1.) -ineae (ending of *something)
// 2.) anil, -t (L) old houese (G), creul
// 3.) tor (G), creul
// 4.) momol
// 5.) camp (G) (L)
// 6.) oxid
// 6.) e/r (seee also /y 
// 7.) *um
// 7.) gens/gent




////////
// FUNCTIONS
//		== 	Main Routines
//				

function findRoots(wordToCheck, dictionaryToCheckAgainst) {
		var returnValue = [];
	
		// TODO: 'look up all posibile comibinations of root on this, return all hits
	
		// see if root is a subscript of wordToCheck
		var foundAtLeastOne = false;
		for (var i = 0, len = dictionaryToCheckAgainst.length; i < len; i++) {
				var curObj = dictionaryToCheckAgainst[i];
				
//				console.log("dictionary[i]: '" + curObj._root);
				// root might be a single word (ex. '=acus'
																					// acus (possible on its own
				if (curObj._root.charAt(0) === '=' ||
						curObj._root.charAt(0) === '-' )
					 
				{
					curObj._root = curObj._root.substring(1, curObj._root.length);
				}
			
				// root might have variations (ex.  'aeti, =a,:o' )
																					//  aeti
																					//  aetia (more likely because of =)
																					//  aetio
				var variations = [];
				var splits = curObj._root.split(', '); // split on ', '
				
//				console.log ("--splits: '" + splits);
				
				if (splits.length === 1)						// no variations
				{
					variations.push (curObj._root);
				}
				else															// variations exist
				{
					variations.push (splits[0]);		// base type is variations
					
					for (var j=1; j<splits.length; j++)
					{
//						console.log("  [currentVariation] " + splits[0] + splits[j].substring(1,splits[j].length));
						variations.push (splits[0] + splits[j].substring(1,splits[j].length));
					}
					
					
					/// DEBUG -switch in what root you are trying to look for
//							if (curObj._root == "ne, -o"){
//							console.log("-[wordToCheck]: '" + wordToCheck);	// display once
//						console.log("-  [splists]: " + splits);
//						console.log("-  [variations]: " + variations);
//						console.log("-       [rozot]: " + curObj._root);
//						console.log("-       [lang]: " + fullLanguage);
//						console.log("-    [meaning]: " + curObj._meaning);
//					}
				}
			
			
//				console.log ("--finalVariations: '" + variations);
			
			
				////////////////
				//		CHECK EACH VARIATION HERE FOR MATCH
				////////////////			
				// at a minimum there will be one (the base)
				// check backwards so if there is a hit, it's more specific
				for (var z=variations.length-1; z>=0 ; z--)
				{
//					if (variations[z] == 'neo'){
//							console.log("-[wordToCheck]: '" + wordToCheck);	// display once
//						console.log("-  [variation]: '" + variations[z]);
//						console.log("-       [root]: '" + curObj._root);
//						console.log("-       [lang]: '" + fullLanguage);
//						console.log("-    [meaning]: '" + curObj._meaning);
//					}
					
					if (variations[z].length > 1 && 											// skipping single letter
							wordToCheck.indexOf(variations[z]) >= 0 )					// is root or subscript of
					{
						if (!foundAtLeastOne)
						{
//							console.log("-[wordToCheck]: '" + wordToCheck);	// display once
							foundAtLeastOne = true;
						}
						
						
						
						// convert language abbreviation
						var fullLanguage = dictionaryOfAbbreviationsToLanguage[curObj._language];
//						console.log("-  [variation]: '" + variations[z]);
//						console.log("-       [root]: '" + curObj._root);
//						console.log("-       [lang]: '" + fullLanguage);
//						console.log("-    [meaning]: '" + curObj._meaning);
//						
						
						
						var newHit = new DictionaryHitResponseObject (variations[z], 
																													curObj._root,
																													fullLanguage,		
																													curObj._meaning);
						
						returnValue.push(newHit);
						break;
					}
				}

		}
	
		//console.log(lookupRoot(wordToCheck));
    
	
  return returnValue;
}


function DictionaryHitResponseObject(variation,root,language,meaning) {	
		this._variation = variation;											// js object, treated like struct
    this._root = root;																// *notice uppercase naming convention
    this._language = language;
    this._meaning = meaning;
}
