#!/usr/bin/node

import FileStorage from "./storage/fileStorage";

// initializes the storage object

let storage: FileStorage;
// const storageType = process.env.TRIVIA_STORAGE_TYPE;

storage = new FileStorage();
storage.reload();

export default storage;
