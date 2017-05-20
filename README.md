# Let's Encrypt X CloudXNS
Use DNS-01 challenge on CloudXNS.

## Use
Install node.js >= 7.6 (requires `async` support).

Run `npm install` on the project root.

Copy `config-example.js` to `config.js` and place your [CloudXNS api key](https://www.cloudxns.net/AccountManage/apimanage.html) to it.

Run `./run your.domain.com` and enjoy!

> The IP of this machine will be publicly logged as having requested this certificate. If you're running certbot in manual mode on a machine that is not your server, please ensure you're okay with that.
