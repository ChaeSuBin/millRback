import express from "express";
import filestream from "fs";
import https from 'https';
import cors from "cors";
import { 
  Items,
  Players
} from "./models.js";
import { setChainId } from "./units/setChainId.js";
import { loginProc, regiCompletePage, sendMailRegi, sendMailReset } from "./units/loginRegi.js";
import { fileUpload, fileMerge, fileIdxUpload } from "./units/fileUploader.js";
import { 
  findOpenedItems,
  buyToknChange, 
  findOpenedTokns, 
  hashToItem, 
  mintToknIdx, 
  toknIdToHash, 
  setToknSaleStart} from "./units/saveIDX.js";
import { addrToId, getItemsId, nameToAddr, ownedItemList, ownedItemHashList } from './units/userInfo.js';
import { itemOpenBatch } from "./units/toknStt.js";

const app = express();
app.use(cors());
//app.use(express.json());
app.use(express.json({limit: '1mb'})); // jsonをパースする際のlimitを設定
//app.use(express.urlencoded({limit: '30mb', extended: true}));// urlencodeされたボディをパースする際のlimitを設定

var options = {
  key: filestream.readFileSync('./certification/key.pem'),
  cert: filestream.readFileSync('./certification/cert.pem')
};
var server = https.createServer(options,app);

// process.env.TZ = 'Asia/Tokyo';
const port = process.env.PORT || 8139;
server.listen(port, () => {
  console.log(`Listening at ${port} port`);
});
  
app.get("/", function (req, res) {
  res.send("(╯°ㅁ°)╯︵┻━┻");
});
app.get("/openeditems", async(req, res) => {
  const item = await findOpenedItems();
  return res.json(item);
});
app.get("/openedtokns", async(req, res) => {
  const item = await findOpenedTokns();
  return res.json(item);
});
app.get("/resetpass/:userid", async(req, res) => {
  const result = await sendMailReset(req.params.userid);
  return res.json(result);
});
app.get("/getuserid/:chainaddr", (req, res) => {
  addrToId(req.params.chainaddr).then(userId => {
    return res.json(userId); })
});
app.get("/chainacc/:userid", async(req, res) => {
  const addr = await nameToAddr(req.params.userid);
  return res.json(addr);
});
app.get("/getowneditem/:userid", async(req, res) => {
  const items = await ownedItemList(req.params.userid);
  return res.json(items);
});
app.get("/getownedtokn/:userid", async(req, res) => {
  const items = await ownedItemHashList(req.params.userid);
  return res.json(items);
});
app.get("/getidlist/:userid/:itemhash", async(req, res) => {
  const idList = await getItemsId(req.params.userid, req.params.itemhash);
  return res.json(idList);
})
app.get("/iteminfo/:filehash", async(req, res) => {
  const item = await hashToItem(req.params.filehash);
  return res.json(item);
});
app.get("/toknhash/:toknid", async(req, res) => {
  const filehash = await toknIdToHash(req.params.toknid);
  return res.json(filehash);
});
app.get("/merge/:filename/:filehash", async(req, res) => {
  const result = fileMerge(req.params.filename, req.params.filehash);
  res.json(result);
});
app.get("/downpath/:dirname/:filename", async(req, res) => {
  const downloadPath = `./archive/static/files/${req.params.dirname}/${req.params.filename}`;
  res.download(downloadPath);
});
app.get("/dirsync/:dirname", async(req, res) => {
  try {
    res.json(filestream.readdirSync(`/home/giparang/threadweb/fortune/server/archive/static/files/${req.params.dirname}`));  
  } catch (err) {
    console.log(err)
  }
})
app.get("/regiplayer/:vcode", async(req, res) => {
  const result = await regiCompletePage(req.params.vcode);
  res.end(result);
})
app.put("/usercheckin", async(req, res) => {
  const result = await loginProc(req.body);
  res.json(result);
})
app.put("/settoknsale", async(req, res) => {
  const result = await setToknSaleStart(req.body.toknId, req.body.price, req.body.state);
  res.json(result);
})
app.put("/opentokn", async(req, res) => {
  const result = await itemOpenBatch(req.body.toknId, req.body.price);
  res.json(result);
})
app.put("/setchainid", async(req, res) => {
  const result = await setChainId(req.body.playerId, req.body.chainId);
  res.json(result);
})
app.put("/buytoknchange", async(req, res) => {
  const result = await buyToknChange(req.body.toknId, req.body.userId);
  res.json(result);
})
app.post("/createtempuser", async(req, res) => {
  const result = sendMailRegi(req.body.playerId, req.body.playerPass);
  res.json(result);
})
app.post("/fileupload", async(req, res) => {
  const result = fileUpload(req.body);
  res.json(result);
});
app.post("/fileinfoupload", async(req, res) => {
  const result = await fileIdxUpload(req.body);
  res.json(result); 
})
app.post("/minttoknidx", async(req, res) => {
  const result = await mintToknIdx(req.body);
  res.json(result);
})