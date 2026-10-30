const { resolverHost } = require("./dns");
const { ejecutarPing, CANTIDAD_PAQUETES } = require("./ping");
const { resumirLatencias } = require("./estadisticas");
const { contarRespuestasReales, extraerLatencias } = require("./analisisPing");

const CODIGOS_ERRORES = ["EAI_AGAIN", "EAI_FAIL", "ENOTFOUND"];

async function auditoriaHosts(direccionesHosts) {

    const resultados = [];

    for (let i = 0; i < direccionesHosts.length; i++) {

        const hostEvaluado = await evaluarHost(direccionesHosts[i]);

        resultados.push(hostEvaluado);

    }

    console.table(resultados);
    return resultados;

}


async function evaluarHost(host) {

    try {
        const ipHost = await resolverHost(host);
        const salidaPing = await ejecutarPing(ipHost);
        const latenciasExtraidas = extraerLatencias(salidaPing);
        const latenciasResumidas = resumirLatencias(latenciasExtraidas);
        const recibidos = contarRespuestasReales(salidaPing);
        let estado = "";

        if (recibidos > 0) { estado = "responde" } else { estado = "caído" };

        const resultado = {
            host: host,
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
        return resultado;

    } catch (error) {
        if (CODIGOS_ERRORES.includes(error.code)) {

            const resultado = {
                host: host,
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
            return resultado;
        }

        throw error;

    }

}

module.exports = { evaluarHost, auditoriaHosts };