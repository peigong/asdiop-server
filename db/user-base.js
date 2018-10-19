const fs = require('fs');
const path = require('path');

const filename = path.join(__dirname, '../../../__data__/users.json');

function getJson(){
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if(err){
                reject(err);
            }else{
                try{
                    let json = JSON.parse(data);
                    resolve(json);
                }catch(ex){
                    reject(ex);
                }
            }
        });
    });
}

function writeJson(json){
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, JSON.stringify(json), (err) => {
            if(err){
                reject(err);
            }else{
                resolve(true);
            }
        });
    });
}

module.exports = {
    getJson,
    writeJson
};
