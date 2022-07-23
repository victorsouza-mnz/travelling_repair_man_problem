import { pesos } from "../../data/structures.js";

const f = (solucao) => {
    let resultado = 0;
    for (let i = 1; i < solucao.length; i++) {
        resultado += latencia(i, solucao);
    }
    return resultado;
}

const latencia = (indice, solucao) => {
    let latencia = 0;
    for (let j = 1; j <= indice; j++) {
        latencia += pesos[solucao[j - 1]][solucao[j]];
    }
    return latencia;
}

const solucao = [0, 4, 2, 3, 1, 5, 6];

export default f;