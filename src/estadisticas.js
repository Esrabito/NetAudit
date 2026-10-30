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

module.exports = { resumirLatencias };