#!/usr/bin/env node
"use strict";
const utils = require('./cloudxns'),
    xns = utils.xns,
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs'));
    

const vDomain = process.env.CERTBOT_DOMAIN;

(async function () {
    const path = utils.tmpPath(vDomain);
    const data = JSON.parse(await fs.readFileAsync(path, 'utf8'));
    await xns(`record/${data.recordId}/${data.domainId}`, 'DELETE');
    await fs.unlinkAsync(path);
})().then(() => {process.exit(0);}, (err) => {console.log(err);process.exit(1);});
