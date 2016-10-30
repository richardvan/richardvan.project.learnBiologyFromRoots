var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));
//
//// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//
app.get('/', function(request, response) {
  response.send ("learn biology project! - look in console");
	
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
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

	
//////////////////
// MAIN body START
console.log("************* START OF MAIN");
//	console.log(" -- DEBUG:  findRoots('"+inputDictionaryToClean+"')");
console.log(" *CALL: cleanRawDictionary -----");
var dictionaryOfRootEntries = cleanRawDictionary(inputDictionaryToClean);


console.log(" *CALL: findRoots -----");
//console.log(findRoots("abdicate",dictionaryOfRootEntries));			// TEST basic test, one result
//console.log(findRoots("adolescence",dictionaryOfRootEntries));
//console.log(findRoots("actuary",dictionaryOfRootEntries));
console.log(findRoots("acus",dictionaryOfRootEntries));					// TEST against =acus
console.log(findRoots("agnus",dictionaryOfRootEntries));				// TEST against agn, -i, =us
console.log(findRoots("myostatin",dictionaryOfRootEntries));				

console.log("************* END OF MAIN");


////////
// FUNCTIONS
//		== 	Initialization
//				Dictionary Setup
function DictionaryEntry(root,language,meaning) {
    this._root = root;
    this._language = language;
    this._meaning = meaning;
				
    
}
function cleanRawDictionary(dictionaryToClean){
	var returnValue = "TODO_cleanDictionaryReturnVALUE";
	console.log (" -- DEBUG: dictionaryToClean START");
	
	// when copied, some longer entries finish as multi-entries, 
	// change these to one line by knowing its multi if it 
	// doesn't have a language which is delimited by (*)
	// where * is a wildcard with possible abbreviations
	
	// ## abbreviations 
	//	Af - African //	Ar - Arabi	//	AS - Anglo-Saxon //	Br - Brazilian
	//	Ch - Chilean //	Dan - Danish //	Ε - English //	EI - East Indian
	//	F - French //	Far - Faroese //	G - Greek //	Ger - German
	//	Go - Gothlandic //	H - Hindustani //	Hb - Hebrew //	Ice - Icelandic
	//	It - Italian //	L - Latin //	LL - Low Latin; Late Latin //	Mai - Malayan
	//	Mex - Mexican //	ME - Middle English //	ML - Middle Latin //	My - Mythology
	//	Ν - a proper name //	NL - New Latin //	OF - Old French //	OHG - Old High German
	//	Pg - Portuguese //	Pp - Papuan //	Ps - Persian //	Pv - Peruvian
	//	Rs - Russian //	SAm - South American //	Sp - Spanish //	Sw - Swedish
	
	var dictionaryFormattedAsEntries = [];
	for (var key in dictionaryToClean)
	{
//  	console.log("key: %s, value: %s", key, dictionaryToClean[key])
		
		// skip spaces
		if (dictionaryToClean[key] == "")
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
		if (matches == null || matches[1] == null)
		{
//			console.log("  - this is MULTILINE");
			// previous value will be on top of list
			var updatedPreviousValue = dictionaryFormattedAsEntries.pop();
			updatedPreviousValue._meaning += dictionaryToClean[key];
			dictionaryFormattedAsEntries.push(updatedPreviousValue);
		}
		else
		{
//			console.log(" matches[0]: " + matches[0]); 	// (G)
//			console.log(" Language: " + matches[1]);		// G																			
			var splits = dictionaryToClean[key].split(' ' + matches[0] + '. '); // split on ' (L). '
//			console.log(splits); // [0] = root /w variability, [1] = meaning
			var newEntry = new DictionaryEntry(splits[0],matches[1],splits[1]);
													
			// TODO LATER - have the language as abbreviation, convert later and display
			dictionaryFormattedAsEntries.push(newEntry);
		}
	}
	
//	console.log (" -- DEBUG: dictionaryToClean after FIRST CLEAN");
//	console.log (dictionaryFormattedAsEntries);
	console.log ("    LENGTH: " + dictionaryFormattedAsEntries.length);



	console.log (" -- DEBUG: dictionaryToClean END");

	// TODO - update this once it's further cleaned
	returnValue = dictionaryFormattedAsEntries;
	return returnValue;
}




////////
// FUNCTIONS
//		== 	Main Routines
//				

function findRoots(wordToCheck, dictionaryToCheckAgainst) {
		var returnValue = 0;
	
		// TODO - look up all posibile comibinations of root on this, return all hits
	
		// see if root is a subscript of wordToCheck
		var foundAtLeastOne = false;
		for (var i = 0, len = dictionaryToCheckAgainst.length; i < len; i++) {
				var curObj = dictionaryToCheckAgainst[i];
				
//				console.log("dictionary[i]: " + curObj._root);
				// root might be a single word (ex. '=acus'
																					// acus (possible on its own
				if (curObj._root.charAt(0) == '=' ||
						curObj._root.charAt(0) == '-' )
					 
				{
					curObj._root = curObj._root.substring(1, curObj._root.length);
				}
			
				// root might have variations (ex.  'aeti, =a, -o' )
																					//  aeti
																					//  aetia (more likely because of =)
																					//  aetio
				var variations = [];	
				var splits = curObj._root.split(', '); // split on ', '
				
//				console.log ("--splits: " + splits);
				
				if (splits.length == 1)						// no variations
					variations.push (curObj._root); 							
				else															// variations exist
				{
					variations.push (splits[0]);		// base type is variations
					
					for (var j=1; j<splits.length; j++)
					{
//						console.log("  [currentVariation] " + splits[0] + splits[j].substring(1,splits[j].length));
						variations.push (splits[0] + splits[j].substring(1,splits[j].length));
					}
				}
			
			
//				console.log ("--finalVariations: " + variations);
			
			
				////////////////
				//		CHECK EACH VARIATION HERE FOR MATCH
				////////////////			
				// at a minimum there will be one (the base)
				// check backwards so if there is a hit, it's more specific
				for (var z=variations.length-1; z>=0 ; z--)
				{
					if (variations[z].length > 1 && 											// skipping single letter
							wordToCheck.indexOf(variations[z]) > -1 )					// is root or subscript of
					{
						if (!foundAtLeastOne)
						{
							console.log("-[wordToCheck]: " + wordToCheck);	// display once
							foundAtLeastOne = true;
						}
						console.log("-  [variation]: " + variations[z]);
						console.log("-       [root]: " + curObj._root);
						console.log("-       [lang]: " + curObj._language);
						console.log("-    [meaning]: " + curObj._meaning);
						returnValue++;
						break;
					}
				}

		}
	
		//console.log(lookupRoot(wordToCheck));
    
	// TODO - return object needs to be json with all the info to be used on a website
	returnValue = "- Found " + returnValue + " match!\n";
	
  return returnValue;
}
