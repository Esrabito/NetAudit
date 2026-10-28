const childProcess = require("child_process");
const util = require("util");

const execFileAsync = util.promisify(childProcess.execFile);



async function ejecutarPing(host) {

    const procesoPing = await execFileAsync("ping", ["-n", "4", host]);

    return procesoPing.stdout;
}

const hosts = ["8.8.8.8", "192.168.1.250", "10.255.255.1", "estonoexiste.invalid", "192.0.2.1"];

async function probar(direccionesHosts) {

    for (let i = 0; i < direccionesHosts.length; i++) {

        try {

            const respuestaPing = await ejecutarPing(direccionesHosts[i]);
            console.log(respuestaPing);
        } catch (error) {
            console.error("Error al hacer ping en el host: ", direccionesHosts[i], error.message);
            console.log("Código:", error.code);
            console.log("Salida:", error.stdout);
        }

    }
}


function esIPv4Valida(texto) {

    const partesIpv4 = texto.split(".");

    if (partesIpv4.length !== 4) {
        return false;
    }

    for (let i = 0; i < partesIpv4.length; i++) {

        const octeto = Number(partesIpv4[i]);

        if (String(octeto) !== partesIpv4[i]) {
            return false;
        }

        if (octeto < 0 || octeto > 255) {
            return false;
        }

    }

    return true;
}

console.log("8.8.8.8 →", esIPv4Valida("8.8.8.8"));
console.log("192.168.1.250 →", esIPv4Valida("192.168.1.250"));
console.log("0.0.0.0 →", esIPv4Valida("0.0.0.0"));
console.log("255.255.255.255 →", esIPv4Valida("255.255.255.255"));
console.log("256.1.1.1 →", esIPv4Valida("256.1.1.1"));
console.log("1.2.3 →", esIPv4Valida("1.2.3"));
console.log("1.2.3.4.5 →", esIPv4Valida("1.2.3.4.5"));
console.log("a.b.c.d →", esIPv4Valida("a.b.c.d"));
console.log("1..2.3 →", esIPv4Valida("1..2.3"));
console.log("1.2.3.-4 →", esIPv4Valida("1.2.3.-4"));
console.log("inyección →", esIPv4Valida("8.8.8.8 & del C:\\"));
console.log("google.com →", esIPv4Valida("google.com"));

//probar(hosts);