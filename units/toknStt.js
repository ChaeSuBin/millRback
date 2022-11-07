import { TokenIdx } from '../models.js';

export const itemOpenBatch = (toknId, price) => {
  let toknHash;
  return new Promise(resolve => {
    TokenIdx.findOne({
      where: { toknid: toknId } }).then((item) => {
        openAllTokn(item.hash, price);
    })
    resolve(true);
  });
}
const openAllTokn = (_hash, _price) => {
  TokenIdx.update(
    { open: true, price: _price },
    { where: { hash: _hash }}
  )
}