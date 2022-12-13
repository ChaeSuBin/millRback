import { sequelize, Players, Items, TokenIdx } from "../models.js";

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
        }).catch(err => {
            console.log(err);
        })
    })
}
export const ownedItemHashList = (_userId) => {
    let itemIdList = [];
    //sequelize.query(`select * from (select distinct on (hash) toknid, hash from toknidxes where owner=${_userId}) p order by toknid`)
    return new Promise(resolve => {
        TokenIdx.findAll({ where: { owner: _userId }}).then(mintedRow => {
            let count = mintedRow.length;
            while(count){
                itemIdList.push(mintedRow[count-1].itemid);
                --count;
            }
            getItems(itemIdList).then(items => {
                resolve([items, mintedRow]);
            })
        })
    })
}
const getItems = (_itemIdList) => {
    return new Promise((resolve, reject) => {
        Items.findAll({
            where: {itemid: _itemIdList}
        }).then(items => {
            resolve(items);
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