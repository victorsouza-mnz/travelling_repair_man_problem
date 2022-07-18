import { listaDeVertices, pesos } from "./structures.js";
//Cada linha i da matriz contém a lista ordenada crescentemente dos vertices baseados nas suas distancias para o
//Vertice i.
export const criaMatrizDeProximidades = () => {
    const matrizDeProximidades = []
    for (let i = 0; i < listaDeVertices.length; i++) {
        let linha = pesos[i]
            .map((el, idx) => {
                if (i !== idx) return { el, idx }
            })
            .filter((el) => el)
            .sort((a, b) => a.el - b.el)
            .map((el) => el.idx);
        console.log(linha);
    }
    return matrizDeProximidades;
}