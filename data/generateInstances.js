
/* 
let listaDeVertices = [];

for (let i = 0; i < 100; i++) {
    listaDeVertices.push(i);
}

console.log(listaDeVertices) */


let pesos = []

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

pesos = zeros([25, 25]);

for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
        if (j > i) {
            let value = Math.floor(Math.random() * 25) + 1;
            pesos[j][i] = value;
            pesos[i][j] = value;

        }
    }
}

console.log(pesos)