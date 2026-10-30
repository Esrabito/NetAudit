const { contarRespuestasReales } = require("../src/analisisPing");
const { esIPv4Valida } = require("../src/validacion");

const respuestasReales = "Respuesta desde 8.8.8.8: bytes=32 tiempo=3ms TTL=119\nRespuesta desde 8.8.8.8: bytes=32 tiempo=4ms TTL=119";
const inaccesible = "Respuesta desde 192.168.1.58: Host de destino inaccesible.\nRespuesta desde 192.168.1.58: Host de destino inaccesible.";
const timeout = "Tiempo de espera agotado para esta solicitud.\nTiempo de espera agotado para esta solicitud.";
const enIngles = "Reply from 8.8.8.8: bytes=32 time=3ms TTL=119\nReply from 8.8.8.8: bytes=32 time=5ms TTL=119\nReply from 8.8.8.8: bytes=32 time=3ms TTL=119";
const mezcla = "Respuesta desde 8.8.8.8: bytes=32 tiempo=3ms TTL=119\nTiempo de espera agotado para esta solicitud.";
const ttlExpirado = "Respuesta desde 10.0.0.1: TTL expiró durante el tránsito.";
const vacio = "";

console.log("respuestasReales (esperado 2) →", contarRespuestasReales(respuestasReales));
console.log("inaccesible (esperado 0) →", contarRespuestasReales(inaccesible));
console.log("timeout (esperado 0) →", contarRespuestasReales(timeout));
console.log("enIngles (esperado 3) →", contarRespuestasReales(enIngles));
console.log("mezcla (esperado 1) →", contarRespuestasReales(mezcla));
console.log("ttlExpirado (esperado 0) →", contarRespuestasReales(ttlExpirado));
console.log("vacio (esperado 0) →", contarRespuestasReales(vacio));



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