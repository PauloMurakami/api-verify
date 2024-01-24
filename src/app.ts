import express from 'express';
import fs from 'fs';
import { addUrl, getUrls, removeUrl, Servico } from './utils';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
const app = express();
const port = 8092;
import https from 'https'
const fileNameDB = 'output.json';
app.use(express.json());

try {
    fs.readFileSync(fileNameDB);
} catch (error) {
    fs.writeFile(fileNameDB, JSON.stringify({ servicos: [] }), 'utf8', function (err) {
        console.log("Aqruivo JSON Criado");
    });
}
// fs.writeFile("output.json", JSON.stringify(data), 'utf8', function (err) {

//     console.log("JSON file has been saved.");
// });
app.get('/health', (req, res) => {
    res.sendStatus(200)
})
app.post('/salvar-url', async (req, res) => {
    try {
        const servico = req.body
        servico.id = uuidv4();
        await addUrl(servico, fileNameDB);
        res.send().status(204)
    } catch (error) {
        res.sendStatus(500)
    }
})
app.get('/verificar-url/:url', (req, res) => {
    // const url = req.params.url;
    res.send().status(200)
})
app.get('/verificar-urls', async (req, res) => {
    try {
        res.json(await verificaUrls()).status(200)
    } catch (error) {
        res.sendStatus(500)
    }
})
app.delete('/delete-url/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await removeUrl(id, fileNameDB)
        res.sendStatus(204)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.use('/', express.static('public'));

app.listen(port, () => {
    console.log(`service is running on port ${port}`)
})

export async function verificaUrls() {
    let servicesOpen = [];
    let servicesClose = [];
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    })
    axios.defaults.httpsAgent = httpsAgent
    for (const url of await getUrls(fileNameDB)) {
        await axios.get(url.url).then((response) => {
            servicesOpen.push(url)
        }).catch((error) => {
            console.log(new Date().toLocaleDateString() + ' - SERVICO: '+ url.nomeDoServico + ' - URL: '+url.url +'- Mensagem de Erro: ' + error.message)
            servicesClose.push(url)
        });
    }
    return {
        servicesOpen: servicesOpen,
        servicesClose: servicesClose
    }
}
