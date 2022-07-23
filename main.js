// TRP - Travelling repair main problem, variante do TSP - travelling salesman problem, porém aqui minimizamos
// o tempo de espera do cliente, e não o tempo de viajem do repair man.
import { pesos, vertices, alpha, numeroDeIteracoesDoGrasp, matrizDeProximidades } from './data/structures.js'
import f from './domain/TRP/funcaoObjetivo.js'


const GRASP_construcao = () => {
    // coloca o vertice atual como sendo o inicial
    let verticeAtual = vertices[0].id;
    // seta o vertice inicial como ja visitado
    vertices[0].visitado = true
    // Inicializa a solucao com apenas o vertice inicial por enquanto
    let solucao = [verticeAtual];

    // Um loop externo q vai iterar em todos os nós e ir adicionando um por um na solucao
    for (let i = 0; i < vertices.length - 1; i++) {
        // Inicializa a lista restrita de candidatos inicial mente vazia
        let LRC = []
        // Nesse loop vamos procurar os elementos para por na lista de candidatos
        for (let n of matrizDeProximidades[verticeAtual]) {
            // se a lista estiver cheia saimos do loop
            if (LRC.length === alpha) { break }
            // como a matriz de proximidades nos da o indice do vertice no array de vertices temos :
            if (!vertices[n].visitado) {
                LRC.push(n);
            }
        }
        // Escolha aleatoria do alpha
        const indiceEscolhido = Math.floor(Math.random() * LRC.length);
        verticeAtual = LRC[indiceEscolhido];
        solucao.push(verticeAtual);
        vertices[verticeAtual].visitado = true;
    }
    return solucao;
}

// É um swap de tamanho reduzido para ajudar na performance
const swapFixado = (solucaoInicial) => {
    let melhorOjetivo = f(solucaoInicial);
    let resultado = solucaoInicial;

    // Fixe um indice aleatorio entre 1 e o ultimo indice do array de solucoes
    const indiceFixado = Math.floor(Math.random() * solucaoInicial.length - 1) + 1;
    for (let i = 1; i < solucaoInicial.length; i++) {
        let solucaoTemp = [...solucaoInicial];
        // Performa o swap
        if (i !== indiceFixado) {
            let temp = solucaoTemp[indiceFixado];
            solucaoTemp[indiceFixado] = solucaoTemp[i];
            solucaoTemp[i] = temp;
            if (f(solucaoTemp) < melhorOjetivo) {
                melhorOjetivo = f(solucaoTemp);
                resultado = [...solucaoTemp];
            }
        }
    }
    return resultado;
}

// É um subset do swap
const swapAdjacente = (solucaoInicial) => {
    let melhorOjetivo = f(solucaoInicial);
    let resultado = solucaoInicial;
    for (let i = 1; i < solucaoInicial.length - 1; i++) {
        let solucaoTemp = [...solucaoInicial];
        //Performa o swap
        let temp = solucaoTemp[i];
        solucaoTemp[i] = solucaoTemp[i + 1];
        solucaoTemp[i + 1] = temp;
        let objetivoTemp = f(solucaoTemp);
        if (objetivoTemp < melhorOjetivo) {
            melhorOjetivo = objetivoTemp;
            resultado = [...solucaoTemp];
        }
    }
    return resultado;
}

const removeInsere = (solucaoInicial) => {
    let melhorOjetivo = f(solucaoInicial);
    let resultado = solucaoInicial;
    for (let i = 0; i < solucaoInicial.length; i++) {
        let solucaoTemp = [...solucaoInicial];
        // Acha o elemento mais distante do vertice analisado (resultado[i])
        let verticeMaisDistante = matrizDeProximidades[solucaoTemp[i]][matrizDeProximidades[0].length - 1];
        let posicao = solucaoTemp.indexOf(verticeMaisDistante);

        // Pega o elemento em ''posicao'' e joga ele pro final do array
        let temp = solucaoTemp[posicao];
        solucaoTemp[posicao] = solucaoTemp[solucaoTemp.length - 1];
        solucaoTemp[solucaoTemp.length - 1] = temp;
        let objetivoTemp = f(solucaoTemp);
        if (objetivoTemp < melhorOjetivo) {
            melhorOjetivo = objetivoTemp;
            resultado = [...solucaoTemp];
        }
    }
    console.log({ melhorOjetivo, resultado, 'tira-teima': f(resultado) });
    return resultado;
}


