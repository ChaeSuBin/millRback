import { sequelize, TokenIdx, Items } from "../models.js";

export const itemClose = (_itemId) => {
	return new Promise(resolve => {
		Items.update(
			{ open: false },
			{ where: {itemid: _itemId}}
		).then(()=> {
			resolve(true);
		})
	})
}
export const idToItem = (_rowId) => {
	return new Promise(resolve => {
		Items.findOne({
			where: {id: _rowId}})
			.then(item => {
				resolve(item);
		})
	})
}
export const toknIdToItem = (_toknId) => {
	return new Promise(resolve => {
		TokenIdx.findOne({
			where: { toknid: _toknId}
		}).then(toknIdx => {
			Items.findOne({
				where: {itemid: toknIdx.itemid}
			}).then(item => {
				resolve(item);
			})
		})
	})
}
export const toknIdToHash = (_toknId) => {
	return new Promise(resolve => {
		TokenIdx.findOne({
			where: {toknid: _toknId}
		}).then(result => {
			resolve(result.hash);
		})
	})
}
export const findOpenedItems = () => {
	return new Promise(resolve => {
		Items.findAll({
			where: {open: true}
		}).then(items => {
			resolve(items);
		})
	})
}
export const findOpenedItemsnew = (_page) => {
	return new Promise(resolve => {
		const perPage = 5;

		Items.findAndCountAll({
			where: {open: true},	
			offset: (_page - 1) * perPage,
			limit: perPage
		}).then(result => {
		const count = result.count; // 全データの件数
		const rows = result.rows;   // 条件をみたすデータ
		resolve([rows, count]);
		});
	})
}
export const findOpenedTokns = () => {
	let hashList = [];
	let toknIdList = [];
	let len = 0;
	return new Promise(resolve => {
		sequelize.query('select * from (select distinct on (hash) hash, toknid from toknidxes where open=true) p order by toknid')
		.then(([idxItems, count]) => {
			while(idxItems.length > len){
				console.log(len);
				hashList.push(idxItems[len].hash);
				toknIdList.push(idxItems[len].toknid);
				++len;
			}
			Items.findAll({
				where: { hash: hashList }
			}).then(items => {
				resolve({items, toknIdList});
			})
		}).catch(err => {
			console.log(err);
		})
	})
}
export const setToknSaleStart = (_toknId, _price, _state) => {
	return new Promise(resolve => {
		TokenIdx.update({
			open: _state, price: _price},
			{where: {toknid: _toknId}}).then(result => {
				resolve(true);
		})
	})
}
export const getDonateList = () => {
	return new Promise(resolve => {
		sequelize.query('select tempdonate from items where tempdonate is not null')
		.then(([orgNames]) => {
			console.log(orgNames);
			resolve(orgNames);
		})
	})
}