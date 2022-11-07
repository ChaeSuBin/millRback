import { sequelize, Players, Items } from "../models.js";

export const addrToId = (_addr) => {
    return new Promise(resolve => {
        Players.findOne({
            where: { blockchainaddr: _addr }
        }).then(user => {
            try{
                resolve(user.id);
            }
            catch(err){
                resolve(false);
            }
        })
    })
}
export const nameToAddr = (_userName) => {
    return new Promise(resolve => {
        Players.findOne({
            where: { name: _userName }
        }).then(user => {
            try{
                resolve(user.blockchainaddr);
            }
            catch(err){
                resolve(false);
            }
        })
    })
}
export const ownedItemList = (_userId) => {
    return new Promise(resolve => {
        sequelize.query(`select * from items where owner=${_userId}`)
        .then(([result, count]) => {
            resolve(result);
        })
    })
}
export const ownedItemHashList = (_userId) => {
    //sequelize.query(`select * from (select distinct on (hash) toknid, hash from toknidxes where owner=${_userId}) p order by toknid`)
    return new Promise(resolve => {
        sequelize.query(`select distinct on (hash) toknid, hash from toknidxes where owner=${_userId}`)
        .then(([items, count]) => {
            getItems(items, count.rowCount-1).then(result => {
                resolve([result, items]);
            }).catch(err => {
                console.log('!CATCH: UNDEFINED ERR AT rows[count].hash');
            })
        })
    })
}
const getItems = (rows, count) => {
    return new Promise((resolve, reject) => {
        let hashList = [];
        do{
            hashList.push(rows[count].hash);
            --count;
        }while(count >= 0)
        Items.findAll({ 
            where: { hash: hashList},
            order: [['id', 'DESC']]
        }).then(result => {
            resolve(result);
        })
    })
}
export const getItemsId = (_userId, _itemHash) => {
    return new Promise(resolve => {
        sequelize.query(`select toknid from toknidxes where owner=${_userId} and hash='${_itemHash}'`)
        .then(([items, count]) => {
            resolve(items);
        })
    })
}