async function obterApuracao() {
    try {
        const resposta = await fetch('http://localhost:3000/apuracao')
        const resultadoApuracao = await resposta.json()

        exibirResultado(resultadoApuracao)
    } catch (error) {
        console.error('Deu erro aqui: ', error)
    }
}

function exibirResultado(resultado) {
    resultado.sort((a, b) => b.qtdVotos - a.qtdVotos)

    const primeiroLugar = document.getElementById('primeiroLugar')
    const segundoLugar = document.getElementById('segundoLugar')
    const terceiroLugar = document.getElementById('terceiroLugar')

    if (resultado.length > 0) {
        const vencedor1 = resultado[0]
        preencherPosicao(primeiroLugar, vencedor1, 1)

        if (resultado.length > 1) {
            const vencedor2 = resultado[1]
            preencherPosicao(segundoLugar, vencedor2, 2)
        }

        if (resultado.length > 2) {
            const vencedor3 = resultado[2]
            preencherPosicao(terceiroLugar, vencedor3, 3)
        }
    }

    // preencher quarto e quinto lugar
    for (let i = 3; i < resultado.length && i < 5; i++) {
        const posicaoDiv = document.getElementById(`posicao${i + 1}`)
        const nomeQuartoLugar = resultado[i].nomeCandidato

        if (posicaoDiv) {
            posicaoDiv.innerHTML = `
            <p class="nomeQuartoLugar"><b>${nomeQuartoLugar}</b></p>
        `;
        }
    }
}

function preencherPosicao(elemento, candidato, posicao) {
    elemento.innerHTML = `
        <img src="${candidato.urlFotoCandidato}" alt="Imagem do candidato ${candidato.nomeCandidato}">
        <p class="nomePodio"><b>${candidato.nomeCandidato}<b></p>
        <span class="posicaoPodio">${posicao}º lugar</span>
        `
}

window.onload = function () {
    obterApuracao()
}