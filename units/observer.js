import { eventMintTokn, eventCreateItem, eventTradeTokn } from "./contractEvt.js";
import { Items, TokenIdx } from "../models.js";

export const buyToknChange = async(buyerId, FROM_ADDR) => {
  const listen = await eventTradeTokn(FROM_ADDR);
	return new Promise(resolve => {
		TokenIdx.update({
			open: false, owner: buyerId},
			{where: {toknid: listen.toknId}}).then(() => {
				resolve(true);
		})
	})
}
export const mintedToknId = async(FROM_ADDR) => {
	const listen = await eventMintTokn(FROM_ADDR);
	return new Promise(resolve => {
		resolve(listen.toknId);
	})
}
export const mintToknIdx = async(body) => {
	return new Promise(resolve => {
		TokenIdx.create({
			toknid : body.toknId,
      		itemid: body.itemId,
			hash: body.hash,
			owner: body.userId,
			price: 0,
			open: false
		}).then(() => {
			resolve(true);
		}).catch(() => {
			console.log('endpoint connect failed');
			resolve(false);
		})
	})
}
export const fileIdxUpload = async(body) => {
    const listen = await eventCreateItem(body.fromAddr);
    return new Promise(resolve => {
      Items.create({
        itemid: listen.itemId,
        title: body.title,
        description: body.desc,
        hash: body.hash,
        owner: body.userId,
        open: true
      }).then(() => {
        resolve(true);
      }).catch(err => {
        console.log(err);
        console.log(31999);
      })
    })
  }