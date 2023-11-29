const express = require('express')
const cors = require('cors')
const fs = require('fs/promises')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(cors())

app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "client")))
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get('/resultado', (req, res) => {
    res.sendFile(__dirname + "/resultado.html")
})

app.get('/cargainicial', (req, res) => {
    async function lerCandidatos() {
        const readCsv = await fs.readFile('config.csv', 'utf-8')
        const candidatos = readCsv.split(',')
        res.send(candidatos)
    }

    lerCandidatos()
})


app.post('/voto', async (req, res) => {
    try {
        let { rg, numeroCandidato, timeStamp } = req.body

        let successMessage = {
            "status": "200",
            "mensagem": "Voto Registrado Com sucesso"
        }
        let errorMessage = {
            "status": "500",
            "mensagem": "Erro ao registrar voto, contate o administrador do sistema"
        }
        await fs.appendFile('votacao.csv', `${rg},${numeroCandidato},${timeStamp}\n`);

        res.json(successMessage)
    }
    catch (error) {
        console.error("Erro:", error)
        res.json(errorMessage)
    }
})


app.get('/apuracao', async (req, res) => {

    try {
        const conteudoCsv = await fs.readFile('votacao.csv', 'utf-8');
        const linhas = conteudoCsv.split('\n');

        const apuracao = {
            'nulo': 0,
            'branco': 0,
            '11': 0,
            '22': 0,
            '33': 0,
            '44': 0,
            '55': 0,
        };

        for (const linha of linhas) {
            const campos = linha.split(',');
            const numeroCandidato = campos[1];

            if (numeroCandidato in apuracao) {
                apuracao[numeroCandidato]++;
            } else {
                apuracao[numeroCandidato] = 1;
            }
        }

        // carregua as informações dos candidatos
        const candidatosCsv = await fs.readFile('config.csv', 'utf-8');
        const candidatosArray = candidatosCsv.split(',');

        // organiza os dados dos candidatos em um objeto para facilitar o acesso
        const candidatosInfo = {};
        for (let i = 0; i < candidatosArray.length; i += 4) {
            candidatosInfo[candidatosArray[i + 1]] = {
                nome: candidatosArray[i + 2],
                imagem: candidatosArray[i + 3],
            };
        }

        // formatando os resultados
        const resultadoApuracao = Object.entries(apuracao)
            .map(([numeroCandidato, qtdVotos]) => {
                const infoCandidato = candidatosInfo[numeroCandidato];

                return {
                    numeroCandidato,
                    qtdVotos,
                    nomeCandidato: infoCandidato ? infoCandidato.nome : numeroCandidato,
                    urlFotoCandidato: infoCandidato ? infoCandidato.imagem : null,
                };
            })
            .sort((a, b) => b.qtdVotos - a.qtdVotos); // ordena em ordem decrescente pela quantidade de votos

        res.json(resultadoApuracao);

    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({
            "Status": "500",
            "Mensagem": "Erro ao obter apuração, contate o administrador do sistema"
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
})