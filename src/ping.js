const childProcess = require("child_process");
const util = require("util");
const dns = require("dns");

const execFileAsync = util.promisify(childProcess.execFile);
const CANTIDAD_PAQUETES = 4;


async function ejecutarPing(host) {

    if (!esIPv4Valida(host)) {
        throw new Error("La funcion solo acepta IPV4, valor recibido: " + host);
    }

    try {
        const procesoPing = await execFileAsync("ping", ["-n", String(CANTIDAD_PAQUETES), host]);

        return procesoPing.stdout;

    } catch (error) {
        if (error.code === 1 && error.stdout) {
            return error.stdout;
        }

        throw error;
    }
}

const hosts = ["8.8.8.8", "google.com", "localhost", "192.0.2.1", "estonoexiste.invalid"];

async function probar(direccionesHosts) {

    const resultados = [];

    for (let i = 0; i < direccionesHosts.length; i++) {

        try {
            const ipHost = await resolverHost(direccionesHosts[i]);
            const salidaPing = await ejecutarPing(ipHost);
            const latenciasExtraidas = extraerLatencias(salidaPing);
            const latenciasResumidas = resumirLatencias(latenciasExtraidas);
            const recibidos = contarRespuestasReales(salidaPing);
            let estado = "";

            if (recibidos > 0) { estado = "responde" } else { estado = "caído" };

            const resultado = {
                host: direccionesHosts[i],
                ip: ipHost,
                enviados: CANTIDAD_PAQUETES,
                recibidos: recibidos,
                perdida: (CANTIDAD_PAQUETES - recibidos) / CANTIDAD_PAQUETES * 100,
                latenciaMin: latenciasResumidas.min,
                latenciaMax: latenciasResumidas.max,
                latenciaPromedio: latenciasResumidas.promedio,
                estado: estado,
                motivo: null
            }
            resultados.push(resultado);

        } catch (error) {

            const resultado = {
                host: direccionesHosts[i],
                ip: null,
                enviados: null,
                recibidos: null,
                perdida: null,
                latenciaMin: null,
                latenciaMax: null,
                latenciaPromedio: null,
                estado: "no evaluado",
                motivo: error.code
            }
            resultados.push(resultado);
        }

    }

    console.table(resultados);
    return resultados;

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

async function resolverHost(host) {

    if (esIPv4Valida(host)) {
        return host;
    }

    const respuestaDns = await dns.promises.lookup(host, { family: 4 });

    return respuestaDns.address;

}


function contarRespuestasReales(salida) {

    return filtrarRespuestasReales(salida).length;
}

function filtrarRespuestasReales(salida) {

    const lineas = salida.split("\n");
    const lineasReales = [];


    for (let i = 0; i < lineas.length; i++) {

        if (lineas[i].includes("TTL=")) {
            lineasReales.push(lineas[i]);
        }

    }

    return lineasReales;

}

function extraerLatencias(salida) {

    const latencias = [];
    const lineas = filtrarRespuestasReales(salida);

    for (let i = 0; i < lineas.length; i++) {
        const lineaMatcheada = lineas[i].match(/[=<](\d+)ms?/);

        if (lineaMatcheada !== null) {

            latencias.push(Number(lineaMatcheada[1]));

        }


    }

    return latencias;

}

function calcularPromedio(latencias) {
    let sumaLatencias = 0;

    if (latencias.length === 0) {
        return null;
    }

    for (let i = 0; i < latencias.length; i++) {
        sumaLatencias += latencias[i];
    }



    return sumaLatencias / latencias.length;
}

function resumirLatencias(latencias) {

    if (latencias.length === 0) {

        const latenciaResumida = {
            min: null,
            max: null,
            promedio: null
        }

        return latenciaResumida;
    }

    const latenciaResumida = {
        min: Math.min(...latencias),
        max: Math.max(...latencias),
        promedio: calcularPromedio(latencias)

    };

    return latenciaResumida;


}

// const respuestasReales = "Respuesta desde 8.8.8.8: bytes=32 tiempo=3ms TTL=119\nRespuesta desde 8.8.8.8: bytes=32 tiempo=4ms TTL=119";
// const inaccesible = "Respuesta desde 192.168.1.58: Host de destino inaccesible.\nRespuesta desde 192.168.1.58: Host de destino inaccesible.";
// const timeout = "Tiempo de espera agotado para esta solicitud.\nTiempo de espera agotado para esta solicitud.";
// const enIngles = "Reply from 8.8.8.8: bytes=32 time=3ms TTL=119\nReply from 8.8.8.8: bytes=32 time=5ms TTL=119\nReply from 8.8.8.8: bytes=32 time=3ms TTL=119";
// const mezcla = "Respuesta desde 8.8.8.8: bytes=32 tiempo=3ms TTL=119\nTiempo de espera agotado para esta solicitud.";
// const ttlExpirado = "Respuesta desde 10.0.0.1: TTL expiró durante el tránsito.";
// const vacio = "";

// console.log("respuestasReales (esperado 2) →", contarRespuestasReales(respuestasReales));
// console.log("inaccesible (esperado 0) →", contarRespuestasReales(inaccesible));
// console.log("timeout (esperado 0) →", contarRespuestasReales(timeout));
// console.log("enIngles (esperado 3) →", contarRespuestasReales(enIngles));
// console.log("mezcla (esperado 1) →", contarRespuestasReales(mezcla));
// console.log("ttlExpirado (esperado 0) →", contarRespuestasReales(ttlExpirado));
// console.log("vacio (esperado 0) →", contarRespuestasReales(vacio));



// console.log("8.8.8.8 →", esIPv4Valida("8.8.8.8"));
// console.log("192.168.1.250 →", esIPv4Valida("192.168.1.250"));
// console.log("0.0.0.0 →", esIPv4Valida("0.0.0.0"));
// console.log("255.255.255.255 →", esIPv4Valida("255.255.255.255"));
// console.log("256.1.1.1 →", esIPv4Valida("256.1.1.1"));
// console.log("1.2.3 →", esIPv4Valida("1.2.3"));
// console.log("1.2.3.4.5 →", esIPv4Valida("1.2.3.4.5"));
// console.log("a.b.c.d →", esIPv4Valida("a.b.c.d"));
// console.log("1..2.3 →", esIPv4Valida("1..2.3"));
// console.log("1.2.3.-4 →", esIPv4Valida("1.2.3.-4"));
// console.log("inyección →", esIPv4Valida("8.8.8.8 & del C:\\"));
// console.log("google.com →", esIPv4Valida("google.com"));

probar(hosts);