import Web3 from "web3";
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const MintServiceABI = require("../contracts/MintService.json") // use the require method
const TradeMarketABI = require('../contracts/MarketPlace.json');
// const web3 = new Web3('');

const MintServiceADDR = '0x55c2cF09ab6f15119ffc7024A27f83A69802D11a';
const TradeServiceADDR = '0x1434F691eCefeA03ce6532a4cA99FD7E08764e2d';

const options = {
  reconnect: {
      auto: true,
      delay: 15000, // ms
      maxAttempts: 5,
      onTimeout: false
  }
};
console.log(process.env.WEB3_PROVIDER);
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_PROVIDER, options));

const mintService = () => {
  const contract_Instance = new web3.eth.Contract(
    MintServiceABI, MintServiceADDR
  )
  return contract_Instance;
}
const tradeService = () => {
  const contract_Instance = new web3.eth.Contract(
    TradeMarketABI, TradeServiceADDR
  )
  return contract_Instance;
}

export const eventCreateItem = async(ADDR) => {
  return new Promise((resolve, reject) => {
    try{
      mintService().events.createItemEvt({filter: {creator: ADDR}, fromBlock: 'latest'},
      (err, evt) => {
        if(evt){
          console.log('event call: ', evt);
          resolve(evt.returnValues);
        }
        else{
          console.log('ERR:', err);
          reject(err);
        }
    })
    }catch(err){
      console.log('err: catch');
      reject(err);
    }
  })
}
export const eventMintTokn = async(ADDR) => {
  return new Promise((resolve, reject) => {
    mintService().events.mintingEvt({filter: {buyer: ADDR}, fromBlock: 'latest'},
      (err, evt) => {
        if(!err){
          console.log('event call: ', evt);
          resolve(evt.returnValues);
        }
        else{
          reject(err);
        }
    })
  })
}
export const eventTradeTokn = async(ADDR) => {
  return new Promise(resolve => {
    tradeService().events.tradingEvt(
      {filter: {buyer: ADDR},
      fromBlock: 'latest'},
      (err, evt) => {
        console.log('event call: ', evt);
        resolve(evt.returnValues);            
    })
  })
}