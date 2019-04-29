var fs = require('fs');

// read claims.txt
fs.readFile(__dirname + '/data/claims.txt', {encoding: 'utf8'}, function(err, claims){

    // if there was error reading the file then throw error
    if(err) {
		throw err;
    }

    // display raw data
    console.log(claims);

    // convert text claims to a structured hierarchical format
    var result = convert(claims);

    // display formatted data ready to use in array
    console.log(result); 

    return result;
 
});

/**
 * converts a string to a two dimentional array based on a language
 * somthing like this: 
 * {{claim1, {dependent1, dependent2}}, {claim2, {}},{claim3, {dependent1, dependent2, dependent3}},...}
 * 
 * @param {String} claims Claims as text
 * @return {Object} array object of claims
 */
function convert(claims)
{

    /* pseudocode:

    var result = {};

     FOR EACH claim IN claims

        SPLIT claim by , as claimDetails

        IF claimDetails[0] is a dependent THEN
            add claim as a dependent to child array for last main claim
        ELSE
            add claim as a main claim to result
        END IF 

     END FOR


     RETURN result;

    */
    return "hello";
}
