#!/usr/bin/node

import FileStorage from "./storage/fileStorage";

// initializes the storage object

let storage: FileStorage;
const storageType = process.env.TRIVIA_STORAGE_TYPE;

// if (storageType === 'db') {
//   (async () => {
//     const { DBStorage } = require("./engine/dbStorage");
//     storage = new DBStorage();
//     await storage.reload();
//   })();
// } else {
//   const FileStorage = require("./engine/fileStorage");
//   storage = new FileStorage();
//   storage.reload();
// }

storage = new FileStorage();
storage.reload();

export default storage;
