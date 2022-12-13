import fs from 'fs';

export interface Servico {
    id: string;
    url: string;
    nomeDoServico: String;
}

export async function addUrl(servico: Servico, fileName: string) {
    let rawdata = fs.readFileSync(fileName);
    let data = JSON.parse(rawdata.toString());
    data.servicos.push(servico);
    console.log('serviço:', servico);
    fs.writeFile(fileName, JSON.stringify(data), 'utf8', function (err) {
        console.log("arquivo salvo.");
    });
    return;
}

export async function getUrls(fileName): Promise<Array<any>> {
    let rawdata = fs.readFileSync(fileName);
    let data = JSON.parse(rawdata.toString());
    return data.servicos;
}

export async function removeUrl(id: string, fileName: string) {
    let rawdata = fs.readFileSync(fileName);
    let data = JSON.parse(rawdata.toString());
    var filteredObj = data.servicos.findIndex(function (item): any {
        return item.id === id
    });
    delete data.servicos[filteredObj]
    data.servicos.splice(filteredObj,1);  
    fs.writeFile(fileName, JSON.stringify(data), 'utf8', function (err) {
        console.log("arquivo salvo.");
    });
    return;
}
