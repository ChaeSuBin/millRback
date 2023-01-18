import dotenv from 'dotenv';
import express from "express";
import serverlessExpress from '@vendia/serverless-express';
import filestream from "fs";
import https from 'https';
import cors from "cors";
import { setChainId } from "./units/setChainId.js";
import { checkExistId, loginProc, matchCheck, regiComplete, sendMailRegi } from "./units/loginRegi.js";
import { fileUpload, fileMerge } from "./units/fileUploader.js";
import { fileIdxUpload, mintedToknId, mintToknIdx, buyToknChange } from "./units/observer.js";
import { 
  findOpenedItems,
  findOpenedTokns, 
  idToItem,
  toknIdToHash, 
  setToknSaleStart,
  itemClose,
  toknIdToItem,
  getDonateList} from "./units/saveIDX.js";
import { addrToId, getItemsId, nameToAddr, ownedItemList, ownedItemHashList } from './units/userInfo.js';

dotenv.config();
const app = express();
app.use(cors());
//app.use(express.json());
app.use(express.json({limit: '1mb'})); // jsonをパースする際のlimitを設定
//app.use(express.urlencoded({limit: '30mb', extended: true}));// urlencodeされたボディをパースする際のlimitを設定

// ローカル確認用
if (process.env.NODE_ENV === `develop`){
  var options = {
    key: filestream.readFileSync('./certification/key.pem'),
    cert: filestream.readFileSync('./certification/cert.pem')
  };
  var server = https.createServer(options,app);
  
  // process.env.TZ = 'Asia/Tokyo';
  const port = process.env.PORT;
  server.listen(port, () => {
    console.log(`Listening at ${port} port`);
  });
}

app.get("/", function (req, res) {
  res.send("(╯°ㅁ°)╯︵┻━┻");
});
app.get('/donatelist', async(req, res) => {
  console.log(1000022);
  const result = await getDonateList();
  return res.json(result);
})
app.get("/openeditems/:page", async(req, res) => {
  console.log(100000)
  const item = await findOpenedItems(req.params.page);
  return res.json(item);
});
app.get("/openedtokns", async(req, res) => {
  console.log(100001);
  const item = await findOpenedTokns();
  return res.json(item);
});
app.get("/getmatchvcode/:userid/:vcode", (req, res) => {
  console.log(100002);
  matchCheck(req.params.userid, req.params.vcode).then(result => {
    return res.json(result);})
})
app.get("/getuserid/:chainaddr", (req, res) => {
  console.log(100003);
  addrToId(req.params.chainaddr).then(userId => {
    return res.json(userId); })
});
app.get("/getmatchuserid/:userid", (req, res) => {
  console.log(100004);
  checkExistId(req.params.userid).then(result => {
    return res.json(result); })
});
app.get("/chainacc/:userid", async(req, res) => {
  console.log(100005);
  const addr = await nameToAddr(req.params.userid);
  return res.json(addr);
});
app.get("/getowneditem/:userid", async(req, res) => {
  console.log(100006);
  const items = await ownedItemList(req.params.userid);
  return res.json(items);
});
app.get("/getownedtokn/:userid", async(req, res) => {
  console.log(100007);
  const items = await ownedItemHashList(req.params.userid);
  return res.json(items);
});
app.get("/getitemtitle/:toknid", async(req, res) => {
  console.log(100008);
  const item = await toknIdToItem(req.params.toknid);
  return res.json(item);
})
app.get("/getidlist/:userid/:itemhash", async(req, res) => {
  console.log(100009);
  const idList = await getItemsId(req.params.userid, req.params.itemhash);
  return res.json(idList);
})
app.get("/iteminfo/:rowid", async(req, res) => {
  console.log(1000010);
  const item = await idToItem(req.params.rowid);
  return res.json(item);
});
app.get("/toknid/:fromaddr", async(req, res) => {
  console.log(1000011);
  const toknId = await mintedToknId(req.params.fromaddr);
  return res.json(toknId);
})
app.get("/toknhash/:toknid", async(req, res) => {
  console.log(1000012);
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
app.get("/getimagestock/:dirname/:filename", async(req, res) => {
  filestream.readFile(`./archive/static/files/${req.params.dirname}/${req.params.filename}`, (err, data) => {
    res.type('jpeg');
    res.send(data);
  })
})
app.get("/getaudiostock/:dirname/:filename", async(req, res) => {
  filestream.readFile(`./archive/static/files/312710ec11393e9458af70f5737e76da29e29a230017602f13fe7d8e5441a4ba/mountain-path-125573.mp3`, (err, data) => {
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg' });
    res.end(data);
  })
})
app.put("/usercheckin", async(req, res) => {
  console.log(1000013);
  const result = await loginProc(req.body);
  res.json(result);
})
app.put("/setitemclose", async(req, res) => {
  console.log(1000014);
  const result = await itemClose(req.body.itemID);
  res.json(result);
})
app.put("/settoknsale", async(req, res) => {
  console.log(1000015);
  const result = await setToknSaleStart(req.body.toknId, req.body.price, req.body.state);
  res.json(result);
})
app.put("/setchainid", async(req, res) => {
  console.log(1000016);
  const result = await setChainId(req.body.playerId, req.body.chainId);
  res.json(result);
})
app.put("/buytoknchange", async(req, res) => {
  console.log(1000017);
  const result = await buyToknChange(req.body.userId, req.body.fromAddr);
  res.json(result);
})
app.post("/regiplayer", async(req, res) => {
  console.log(1000018);
  const result = await regiComplete(req.body.userId, req.body.pass, req.body.addr);
  res.json(result);
})
app.post("/createtempuser", async(req, res) => {
  console.log(1000019);
  const result = sendMailRegi(req.body.playerId);
  res.json(result);
})
app.post("/fileupload", async(req, res) => {
  console.log(1000020);
  const result = fileUpload(req.body);
  res.json(result);
})
app.post("/fileinfoupload", async(req, res) => {
  const result = await fileIdxUpload(req.body);
  res.json(result); 
})
app.post("/minttoknidx", async(req, res) => {
  console.log(1000021);
  const result = await mintToknIdx(req.body);
  res.json(result);
})

export const handler = serverlessExpress({
  app,
  resolutionMode: 'CALLBACK'
});

// export const handler = serverlessExpress({ app });