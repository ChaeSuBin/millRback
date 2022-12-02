import filestream from "fs";
import path from "path";

const __dirname = '/home/giparang/threadweb/fortune/server/archive';
// file path
const STATIC_FILES = path.join(__dirname, './static/files')
// Temporary path to upload files
const STATIC_TEMPORARY = path.join(__dirname, './static/temporary')

export const fileUpload = (body) => {
  let bufferData;
  const fileName = body.fileName;
  const section = body.section;
  const chunk = body.chunk;
  const dir = `${STATIC_TEMPORARY}/${fileName}`;
  //console.log(fileName, section, chunk);
  try{
    if(!filestream.existsSync(dir)){
      filestream.mkdirSync(dir);
    }
    bufferData = Buffer.from(chunk);
    //const buffer = filestream.readFileSync(chunk);
    const stream = filestream.createWriteStream(`${dir}/${section}`);
    stream.write(bufferData);
    stream.close();
    return (`${fileName}-${section} Section uploaded successfully`);
  } catch(err){
    return err.message;
  }
}
export const fileMerge = (_fileName, _fileHash) => {
  const FILES_DIR = `${STATIC_FILES}/${_fileHash}`;
  if(!filestream.existsSync(FILES_DIR)){
    filestream.mkdirSync(FILES_DIR);
    console.log(FILES_DIR);
  }
  try {
    let len = 0
    const bufferList = filestream.readdirSync(`${STATIC_TEMPORARY}/${_fileName}`).map((hash,index) => {
      const buffer = filestream.readFileSync(`${STATIC_TEMPORARY}/${_fileName}/${index}`)
      len += buffer.length
      return buffer
    });
    //Merge files
    const buffer = Buffer.concat(bufferList, len);
    const ws = filestream.createWriteStream(`${FILES_DIR}/${_fileName}`)
    ws.write(buffer);
    ws.close();
    return 'Section merge completed';
  } catch (err) {
    return err.message;
  } 
}

export const mkdirtemp = (_fileHash) => {
  const FILES_DIR = `${STATIC_FILES}/${_fileHash}`;
  if(!filestream.existsSync(FILES_DIR)){
    filestream.mkdirSync(FILES_DIR);
    console.log(FILES_DIR);
  }
}