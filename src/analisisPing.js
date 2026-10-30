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

module.exports = { contarRespuestasReales, extraerLatencias };