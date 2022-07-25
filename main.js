// TRP - Travelling repair main problem, variante do TSP - travelling salesman problem, porém aqui minimizamos
// o tempo de espera do cliente, e não o tempo de viajem do repair man.
import { pesos, alpha, beta, constanteVNS, numeroDeIteracoesDoGrasp, matrizDeProximidades, listaDeVertices } from './data/structures.js'
import f from './domain/TRP/funcaoObjetivo.js'


const GRASP_construcao = () => {
    // coloca o vertice atual como sendo o inicial
    const vertices = listaDeVertices.map(id => ({ id: id, visitado: false, tempoGasto: -1 }));

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

function shuffleSubarray(arr, start, length) {
    var i = length, temp, index;
    while (i--) {
        index = start + Math.floor(i * Math.random());
        temp = arr[index];
        arr[index] = arr[start + i];
        arr[start + i] = temp;
    }
    return arr;
}

// É um swap de tamanho reduzido para ajudar na performance
const swapFixado = (solucaoInicial) => {
    let melhorOjetivo = f(solucaoInicial);
    let resultado = solucaoInicial;

    // Fixe um indice aleatorio entre 1 e o ultimo indice do array de solucoes
    const indiceFixado = Math.floor(Math.random() * (solucaoInicial.length - 1)) + 1;
    for (let i = 1; i < solucaoInicial.length; i++) {
        let solucaoTemp = [...solucaoInicial];
        // Performa o swap
        if (i !== indiceFixado) {
            let temp = solucaoTemp[indiceFixado];
            solucaoTemp[indiceFixado] = solucaoTemp[i];
            solucaoTemp[i] = temp;
            // Atualiza a melhor solução caso melhore.
            if (f(solucaoTemp) < melhorOjetivo) {
                //console.log('swapFixado melhorou');
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
            //console.log('swap adjacente melhorou');
            melhorOjetivo = objetivoTemp;
            resultado = [...solucaoTemp];
        }
    }
    return resultado;
}

// Fixa um index, e pega o elemento mais longe desse index de joga para o final
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
            //console.log('remove insere melhorou');
            melhorOjetivo = objetivoTemp;
            resultado = [...solucaoTemp];
        }
    }
    return resultado;
}

// Vizinhança de 2-otp com index fixo
const doisOptmal = (solucaoInicial) => {
    let melhorOjetivo = f(solucaoInicial);
    let resultado = solucaoInicial;
    const indiceFixado = Math.floor(Math.random() * (solucaoInicial.length - 2));
    for (let i = 0; i < solucaoInicial.length - 1; i++) {
        let solucaoTemp = [...solucaoInicial];
        if (i < indiceFixado - 1 || i > indiceFixado + 2) {
            // Performa o 2-opt
            if (i < indiceFixado) {
                let temp = solucaoTemp[i + 1];
                solucaoTemp[i + 1] = solucaoTemp[indiceFixado];
                solucaoTemp[indiceFixado] = temp;
            } else {
                let temp = solucaoTemp[indiceFixado + 1];
                solucaoTemp[indiceFixado + 1] = solucaoTemp[i];
                solucaoTemp[i] = temp;
            }
        }
        if (f(solucaoTemp) < melhorOjetivo) {
            //console.log('2-opt melhorou');
            melhorOjetivo = f(solucaoTemp);
            resultado = [...solucaoTemp];
        }
    }
    return resultado;
}

// Minha contribuição para a lista de vizinhos
const embaralha = (solucaoInicial) => {
    let melhorOjetivo = f(solucaoInicial);
    let resultado = solucaoInicial;
    const indiceFixado = Math.floor(Math.random() * (solucaoInicial.length - 1 - beta)) + 1;
    for (let i = 0; i < 5; i++) {
        let solucaoTemp = [...solucaoInicial];
        solucaoTemp = shuffleSubarray(solucaoTemp, indiceFixado, beta);
        if (f(solucaoTemp) < melhorOjetivo) {
            //console.log('******************embaralha melhorou*********************');
            melhorOjetivo = f(solucaoTemp);
            resultado = [...solucaoTemp];
        }
    }
    return resultado;

}

const shakeDoisOptmal = (solucaoInicial) => {
    let resultado = [...solucaoInicial];

    const indice1 = Math.floor(Math.random() * (solucaoInicial.length - 2));
    let indice2;
    while (true) {
        indice2 = Math.floor(Math.random() * (solucaoInicial.length - 2));
        if (indice2 < indice1 - 1 || indice2 > indice1 + 2) break;
    }

    if (indice1 < indice2) {
        let temp = resultado[indice1 + 1];
        resultado[indice1 + 1] = resultado[indice2];
        resultado[indice2] = temp;
    } else {
        let temp = resultado[indice2 + 1];
        resultado[indice2 + 1] = resultado[indice1];
        resultado[indice1] = temp;
    }
    return resultado;
}

// Lista de todas as buscas locais para cada uma das vizinhanças implmentadas
const listaDeBuscasLocais = [swapAdjacente, removeInsere, swapFixado, doisOptmal];


const VND = (solucaoInicial) => {
    let melhorOjetivo = f(solucaoInicial);
    let resultado = solucaoInicial;
    let k = 0;
    while (k < listaDeBuscasLocais.length) {
        let solucaoTemp = listaDeBuscasLocais[k](resultado);
        if (f(solucaoTemp) < melhorOjetivo) {
            resultado = [...solucaoTemp];
            melhorOjetivo = f(solucaoTemp);
        } else {
            k++;
        }
    }
    return resultado;
}

const VNS = (solucaoInicial) => {
    let melhorOjetivo = f(solucaoInicial);
    let resultado = solucaoInicial;
    let cp = 0;
    while (cp < constanteVNS) {

        let resultadoTemp = [...resultado];
        let k = 1;
        while (k < constanteVNS) {
            for (let i = 0; i < k; i++) {
                resultadoTemp = shakeDoisOptmal(resultadoTemp);
            }
            //busca local
            resultadoTemp = VND(resultadoTemp);
            if (f(resultadoTemp) < melhorOjetivo) {
                melhorOjetivo = f(resultadoTemp);
                resultado = [...resultadoTemp];
                k = 1;
            } else {
                k++;
            }
        }
        cp++;
    }

    return resultado;
}

const GRASP = () => {
    // Construção da solucao inicial
    let solucao = GRASP_construcao();
    /* solucao = VND(solucao);
    return VNS(solucao);
     */
    return VND(solucao);
}

// rodar o GRASP i vezes
let melhorSolucao = GRASP();
//console.log({ melhorOjetivo: f(melhorSolucao) })
let melhorOjetivo = f(melhorSolucao);
for (let i = 0; i < 100; i++) {
    let solucaoTemp = GRASP();
    //console.log({ melhorOjetivo: f(solucaoTemp) })
    if (f(solucaoTemp) < melhorOjetivo) {
        melhorSolucao = solucaoTemp;
        melhorOjetivo = f(solucaoTemp);
    }
}
console.log({ melhorSolucao, melhorOjetivo })

