const numeroCandidatoInput = document.querySelector('#iNumeroCandidato')
let nomeCandidato = document.querySelector('.nomeCandidato')
let imgCandidato = document.querySelector('.imgCandidato')

const infoButton = document.querySelector('.info')
const modalInfo = document.querySelector('#modalCandidatos')

const btnConfirma = document.querySelector('.confirma')
const btnCorrige = document.querySelector('.corrige')
const btnBranco = document.querySelector('.branco')

const elementosDesabilitaveis = document.querySelectorAll('button, input')

numeroCandidatoInput.addEventListener('keydown', fetchCandidatos)
numeroCandidatoInput.addEventListener('change', fetchCandidatos)

infoButton.addEventListener('click', () => {
    modalInfo.style.display = 'block'
})

const candidato = {}

btnCorrige.addEventListener('click', () => {
    numeroCandidatoInput.value = '00'
    nomeCandidato.innerHTML = 'Ivan Borchardt'
    imgCandidato.src = 'assets/img/politico.png'
})

btnConfirma.addEventListener('click', fetchVoto)
btnBranco.addEventListener('click', votoBranco)

imgCandidato.src = 'assets/img/politico.png'

async function fetchCandidatos() {
    try {
        const response = await fetch('http://localhost:3000/cargainicial')
        const candidatos = await response.json()

        const numeroCandidato = numeroCandidatoInput.value

        const candidatoIndex = candidatos.indexOf(numeroCandidato)

        if (candidatoIndex !== -1) {

            candidato.numero = candidatos[candidatoIndex]
            candidato.nome = candidatos[candidatoIndex + 1]
            candidato.imagem = candidatos[candidatoIndex + 2]

            nomeCandidato.innerHTML = candidato.nome
            imgCandidato.src = candidato.imagem

            console.log(imgCandidato)
        } else {
            nomeCandidato.innerHTML = 'Escolha um candidato válido'
            imgCandidato.src = 'assets/img/politico.png'
            console.log('Candidato não encontrado.')
        }

    } catch (error) {
        console.error('Erro ao buscar candidatos: ', error)
    }
}

function getDataFormatada() {
    const currentDate = new Date()

    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')

    const hours = String(currentDate.getHours()).padStart(2, '0')
    const minutes = String(currentDate.getMinutes()).padStart(2, '0')
    const seconds = String(currentDate.getSeconds()).padStart(2, '0')
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0')

    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`

    return formattedDate
}

async function fetchVoto() {
    const dataConcatenada = getDataFormatada()

    var option = {
        method: "POST",
        body: JSON.stringify({
            rg: '',
            numeroCandidato: numeroCandidatoInput.value,
            timeStamp: dataConcatenada
        }),
        headers: { "Content-Type": "application/json" }
    };

    let response = await fetch("http://localhost:3000/voto", option)
    let mensagem = await response.json()

    if (mensagem.status == 200 && numeroCandidatoInput.value.trim() != '') {
        mostrarModal('modalSucesso')

        let somSucesso = new Audio('../assets/audio/confirma-urna.mp3')
        somSucesso.play()
        somSucesso.volume = 0.1

        // Desabilitar todos os elementos da tela
        elementosDesabilitaveis.forEach(elemento => elemento.classList.add('disabled'))

        setTimeout(() => fecharModal('modalSucesso'), 2000)
    }
    else {
        console.error('Erro ao registrar voto. Contate o administrador do sistema.')
        mostrarModal('modalErro');
        btnConfirma.setAttribute('disabled', '')
        btnConfirma.classList.add('disabled')

        let somError = new Audio('../assets/audio/error-urna.mp3')
        somError.play()
        somError.volume = 0.7
    }
}

async function votoBranco() {
    const dataConcatenada = getDataFormatada()

    var option = {
        method: "POST",
        body: JSON.stringify({
            rg: '',
            numeroCandidato: 'BRANCO',
            timeStamp: dataConcatenada
        }),
        headers: { "Content-Type": "application/json" }
    };

    let response = await fetch("http://localhost:3000/voto", option)
    let mensagem = await response.json()

    if (mensagem.status == 200) {
        mostrarModal('modalSucesso')

        let somSucesso = new Audio('../assets/audio/confirma-urna.mp3')
        somSucesso.play()
        somSucesso.volume = 0.1

        setTimeout(() => fecharModal('modalSucesso'), 2000)
    }
    else {
        console.error('Erro ao registrar voto. Contate o administrador do sistema.')
        mostrarModal('modalErro');
        btnConfirma.setAttribute('disabled', '')
        btnConfirma.classList.add('disabled')

        let somError = new Audio('../assets/audio/error-urna.mp3')
        somError.play()
        somError.volume = 0.7
    }
}

function mostrarModal(idModal) {
    var modal = document.getElementById(idModal)
    modal.style.display = "flex"


}

function fecharModal(idModal) {
    var modal = document.getElementById(idModal)
    modal.style.display = "none"
    
    elementosDesabilitaveis.forEach(elemento => elemento.classList.remove('disabled'))
}