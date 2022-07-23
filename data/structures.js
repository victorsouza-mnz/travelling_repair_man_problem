import { criaMatrizDeProximidades } from "./initializers.js";

export const listaDeVertices = [0, 1, 2, 3, 4, 5, 6];


// matriz de pesos será sempre considera simetrica para o que esse algoritmo se propõe.
export const pesos = [
    [0.0, 2.1, 6.1, 7.4, 5.7, 5.6, 4.0],
    [2.1, 0.0, 6.3, 8.6, 6.9, 7.6, 6.0],
    [6.1, 6.3, 0.0, 4.0, 3.6, 8.3, 8.4],
    [7.4, 8.6, 4.0, 0.0, 1.8, 6.5, 7.6],
    [5.7, 6.9, 3.6, 1.8, 0.0, 5.2, 6.0],
    [5.6, 7.6, 8.3, 6.5, 5.2, 0.0, 2.2],
    [4.0, 6.0, 8.4, 7.6, 6.0, 2.2, 0.0]]


// Cria uma lista de vertices como uma de hashes que tem algumas informações necessarias
// Tempo gasto, também chamado de latencia do vertice, é o tempo que foi gasto para chegar em determinado vertice
// começando do ponto inicial e percorrendo o caminho escolhido.
export const vertices = listaDeVertices.map(id => ({ id: id, visitado: false, tempoGasto: -1 }));

export const numeroDeIteracoesDoGrasp = 100;

export const matrizDeProximidades = criaMatrizDeProximidades();

export const alpha = 3;