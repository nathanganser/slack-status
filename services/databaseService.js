const fs = require('fs');

const FILE_NAME = 'data.json';
const FILE_ENCODING = "utf8";

const initData = {
    users: []
}

const readFileAsJson = () => JSON.parse(fs.readFileSync(FILE_NAME, FILE_ENCODING));

module.exports =  {
     get: (userId) => {
        return readFileAsJson().users.find(u => u.userId == userId);
    },
    save: async (userId, token) => {
        var content = readFileAsJson();

        var existingUser = content.users.find(u => u.userId == userId);

        if(!existingUser){
            
            content.users.push({ userId, token })

            fs.writeFile(FILE_NAME, JSON.stringify(content), FILE_ENCODING, () => {
                console.log('Updated database')
            });
        }
    },
    init: async () => {
        try{

            fs.exists(FILE_NAME, (exists) => {
                if(!exists){
                    fs.writeFile(FILE_NAME, JSON.stringify(initData), FILE_ENCODING, () => {
                        console.log('Created database')
                    });
                }

            })
        }catch(error){
            console.log(error)
        }
    }
}