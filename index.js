var fs = require('fs');

// read raw data form claims.txt
fs.readFile(__dirname + '/data/claims.txt', { encoding: 'utf8' }, function(err, data) {

    // if there was error reading the file then throw error
    if (err) {
        throw err;
    }

    // build the hierarchy data structure
    claims = buildHierarchy(data);

    console.log(JSON.stringify(claims));

    return claims;

});

/**
 * builds Hirerarchical data structure
 * somthing like this: 
 * [{"id":"1","claim":"1. A product","dependent":[{"id":"2","claim":"2. The system of claim 1","dependent":[],"parent_id":"1"},{"id":"3","claim":"3. The system of claim 1","dependent":[{"id":"4","claim":"4. The system of claim 3","dependent":[],"parent_id":"3"}],"parent_id":"1"}],"parent_id":""}]
 * 
 * @param {Object} data object array of claims
 * @return {Object} structrued object array of claims
 */
function buildHierarchy(data)
{

    // process raw string and convert it to JSON objects
    var claims = initialClaims(data);

    // filter and process claims that parent_id is set
    claims.filter( claim => claim.parent_id !== '').forEach(

        (claim, index) => {

            // find parent claim and set the current claim as it's dependent
            claims.find(function(element){
                return element.id == claim.parent_id;
            }).dependent.push(claim);

        }
    );

    // retrun only claims that parent is empty
    return claims.filter( claim => claim.parent_id === '');
}

/**
 * get raw string and convert to structured JSON Objects
 * 
 * @param {Stirng} data  claims string
 * @return {Object} array object of claims
 */
function initialClaims(data) {

    // claims array
    var result = [];

    // current currentclaim
    var currentclaim = null;

    // read the raw string line by line
    data.match(/.*/g).forEach(line => {

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

    // run a map function on each result element to convert it to JSON Object
    return result.map(function(claim) { 

        // read first section to pull claim id and dependent id 
        var ids = claim.match(/(^[0-9]+)[.]([a-zA-Z ]+)([0-9]*)/);

        return {id: ids[1], parent_id: ids[3], claim: claim, dependent: []};
    });

}