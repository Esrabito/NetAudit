const dns = require("dns");
const { esIPv4Valida } = require("./validacion");

async function resolverHost(host) {

    if (esIPv4Valida(host)) {
        return host;
    }

    const respuestaDns = await dns.promises.lookup(host, { family: 4 });

    return respuestaDns.address;

}

module.exports = { resolverHost };