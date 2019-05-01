var fs = require('fs');

// read claims.txt
fs.readFile(__dirname + '/data/claims2.txt', { encoding: 'utf8' }, function(err, data) {

    // if there was error reading the file then throw error
    if (err) {
        throw err;
    }

    console.log('\n\n-----------------\n\n');

    // convert text claims to a structured hierarchical format
    var result = convert(data);

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
function convert(data) {

    /* pseudocode:

    var result = {};

     FOR EACH currentclaim IN claims

        SPLIT currentclaim by , as claimDetails

        IF claimDetails[0] is a dependent THEN
            add currentclaim as a dependent to child array for last main currentclaim
        ELSE
            add currentclaim as a main currentclaim to result
        END IF 

     END FOR


     RETURN result;

    */


    var result = [];

    // get claims from string and save to array
    claims = getClaims(data);

    // process each claim in claims
    claims.forEach(claim => {

        // SPLIT currentclaim by , as claimDetails
        var claimDetails = claim.split(',');

        // read first section to pull claim id and dependent id 
        var ids = claimDetails[0].match(/(^[0-9]+)[.]([a-zA-Z ]+)([0-9]*)/);

        // if id[3] is set means this is a dependent
        if(ids[3]) {

            // find parent
            // TODO: to solution : recursive search or always keep the parent
            var foundclaim = result.find(function(element){
                return element.id == ids[3];
            });

            // if parent is valid add to parent else add as main Claim
            if(foundclaim) {

                // add as dependent to the parent Claim
                foundclaim.dependent.push({
                    'id': ids[1],
                    'claim': claim,
                    'dependent': []
                });
            }
        } else {
            // add to result array
            result.push({
                'id': ids[1],
                'claim': claim,
                'dependent': []
            });
        }
    });

    return JSON.stringify(result);
}

/**
 * get claims from string and save to array
 * 
 * @param {Stirng} data  claims string
 * @return {Object} array object of claims
 */
function getClaims(data) {

    // match line by line
    var lines = data.match(/.*/g);

    // claims array
    var result = [];

    // current currentclaim
    var currentclaim = null;

    lines.forEach(line => {

        // if line format is like : 1. A Product tag....
        if (line.match(/[0-9]+[.][ ].*/)) {

            // if currentclaim is not null means we reached to next currentclaim, so push current one to result array and reset currentClaim 
            if (currentclaim) {
                result.push(currentclaim);
                currentclaim = null;
            }
            currentclaim = line;
        } else {
            currentclaim += line;
        }
    });

    // push the last claim to result
    result.push(currentclaim);

    return result;
}