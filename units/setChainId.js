import { Players } from '../models.js';

export const setChainId = async(playerId, chainId) => {
    return new Promise(resolve => {
        Players.findOne({
            where: {name: playerId}
        }).then(user => {
            user.blockchainaddr = chainId;
            user.save();
            resolve(true);
        })
    })
}