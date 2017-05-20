"use strict";
const request = require('request-promise'),
      config = require('./config.js'),
      md5 = require('md5'),
      os = require('os');
function encodeQueryData(data) {
   let ret = [];
   for (let d in data)
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
}

module.exports.tmpPath = function(domain) {
    return os.tmpdir() + `/.cloudxns_acme.${domain}.json`;
}
module.exports.xns = async function(op, method, data) {
    const reqTime = new Date().toString();
    let hmacString = config.APIKEY;
    let actualUri = "https://www.cloudxns.net/api2/" + op;
    let body;
    if (data === {} || data === null || data === undefined) {
        body = "";
    } else if (method === 'GET' || method === 'DELETE') {
        actualUri += "?" + encodeQueryData(data);
        body = "";
    } else {
        body = JSON.stringify(data);
    }
    hmacString += (actualUri + body + reqTime + config.SECRETKEY);
    const hmac = md5(hmacString);
    let opt = {
        method: method,
        uri: actualUri,
        headers: {
            "Content-Type": "application/json",
            "API-KEY": config.APIKEY,
            "API-REQUEST-DATE": reqTime,
            "API-HMAC": hmac,
            "API-FORMAT": "json"
        },
        resolveWithFullResponse: true,
        simple: false
    };
    if (body !== "")
        opt.body = body;

    const response = await request(opt);
    const result = JSON.parse(response.body);
    if (response.statusCode === 200 && result.code === 1)
        return (result.hasOwnProperty('data')) ? result.data : true;
    else
    {
        throw new Error(response.body);
    }
};
