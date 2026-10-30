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

module.exports = { esIPv4Valida };