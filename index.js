
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
console.log(findRoots("abdicate",dictionaryOfRootEntries));
console.log(findRoots("adolescence",dictionaryOfRootEntries));
console.log(findRoots("actuary",dictionaryOfRootEntries));
console.log(findRoots("acus",dictionaryOfRootEntries));					// TEST against =acus
console.log(findRoots("agnus",dictionaryOfRootEntries));				// TEST against agn, -i, =us

console.log("************* END OF MAIN");


////////
// NEW FUNCTIONS
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
	console.log (dictionaryFormattedAsEntries);
	console.log ("    LENGTH: " + dictionaryFormattedAsEntries.length);



	console.log (" -- DEBUG: dictionaryToClean END");

	// TODO - update this once it's further cleaned
	returnValue = dictionaryFormattedAsEntries;
	return returnValue;
}






/////////////////////////
//							HELPER FUNCTIONS
/////////////////////////

//Short code - REGEX from http://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
function matchRuleShort(str, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

function findRoots(wordToCheck, dictionaryToCheckAgainst) {
		var returnValue = 0;
	
		// TODO - look up all posibile comibinations of root on this, return all hits
	
		// see if root is a subscript of wordToCheck
		var foundAtLeastOne = false;
		for (var i = 0, len = dictionaryToCheckAgainst.length; i < len; i++) {
				var currentObject = dictionaryToCheckAgainst[i];
				var currentObjectRootToCheckAgainst = currentObject._root;
				
				// root might be a single word (ex. '=acus'
																					// acus (possible on its own
				if (currentObjectRootToCheckAgainst.charAt(0) == '=' ||
						currentObjectRootToCheckAgainst.charAt(0) == '-' )
					 
				{
					currentObjectRootToCheckAgainst = currentObjectRootToCheckAgainst.substring(1, currentObjectRootToCheckAgainst.length);
				}
			
				// root might have variations (ex.  'aeti, =a, -o' )
																					//  aeti
																					//  aetia (more likely because of =)
																					//  aetio
				var splits = currentObjectRootToCheckAgainst.split(', '); // split on ', '
				var variations = "";
				if (splits.length == 1)
					variations = currentObjectRootToCheckAgainst;
				else
				{
//					console.log ("--splits: " + splits);
					variations = []; 	// one variation will always be the first term
					variations.push (splits[0]);
					
//					console.log ("--variations (with splits): " + variations);
					for (var j=1; j<splits.length; j++)
					{
						var currentVariation = splits[j];
//						console.log("  [currentVariation] " + currentVariation);
						variations.push (splits[0] + currentVariation.substring(1,currentVariation.length));
					}
				}
			
			
//				console.log ("--finalVariations: " + variations);
				// check each variation, at a minimum there will be one
					
			
				if (currentObject._root.length > 1 && 								// skipping single letter
						wordToCheck.indexOf(currentObjectRootToCheckAgainst) > -1 )
				{
					if (!foundAtLeastOne)
					{
						console.log("--[wordToCheck]: " + wordToCheck);					// display once
						foundAtLeastOne = true;
					}
					console.log("-   [root]: " + currentObject._root);
					console.log("-    [lang]: " + currentObject._language);
					console.log("-    [meaning]: " + currentObject._meaning);
					returnValue++;
				}

		}
	
		//console.log(lookupRoot(wordToCheck));
    
	returnValue = "----- Found " + returnValue + " match!\n";
	
  return returnValue;
}
