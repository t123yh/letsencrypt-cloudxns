#!/usr/bin/env node
"use strict";
const _ = require('lodash'),
    utils = require('./cloudxns'),
    xns = utils.xns,
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs'));

const vDomain = process.env.CERTBOT_DOMAIN,
      vContent = process.env.CERTBOT_VALIDATION;

(async function () {
    const domains = await xns('domain','GET');
    const domain = _.find(domains, item => vDomain.endsWith(item.domain.slice(0, -1)));
    
    const txtName = `_acme-challenge.${vDomain}`.replace('.' + domain.domain.slice(0, -1), '');
    const result = await xns('record','POST', {
        domain_id: domain.id,
        host: txtName,
        value: vContent,
        type: 'TXT',
        line_id: "1"
    });

    const record = _.find(await xns(`record/${domain.id}`, 'GET', {
        host_id: 0,
        row_num: 1000
    }), (item) => item.host === txtName);

    await fs.writeFileAsync(utils.tmpPath(vDomain),
            JSON.stringify({ domainId: domain.id, recordId: record.record_id }), 'utf8');

    await new Promise((res) => setTimeout(() => { res(); }, 3000));
})().then(() => {process.exit(0);}, (err) => {console.log(err);process.exit(1);});
