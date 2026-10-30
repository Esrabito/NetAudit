const childProcess = require("child_process");
const util = require("util");

const { esIPv4Valida } = require("./validacion");


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

        if (error.code === "ENOENT") {
            throw new Error("No se encontró el comando ping en este equipo", { cause: error });
        }

        throw error;
    }
}

module.exports = { ejecutarPing, CANTIDAD_PAQUETES };