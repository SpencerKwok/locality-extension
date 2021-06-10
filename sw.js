let storageCache = {};
const initStorageCache = getAllStorageSyncData().then((items) => {
  Object.assign(storageCache, items);
});

function getAllStorageSyncData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(items);
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handler(request).then(sendResponse);
  return true;
});

async function handler(request) {
  try {
    await initStorageCache;
  } catch (e) {
    console.log(e);
  }

  switch (request.message) {
    case "clear":
      return await new Promise((resolve) => {
        storageCache = {};
        chrome.storage.sync.clear();
        resolve(true);
      });
    case "get":
      const { keys } = request;
      const results = [];
      keys.forEach((key) => {
        results.push(storageCache[key]);
      });
      return results;
    case "set":
      const { key, value } = request;
      pair = {};
      pair[key] = value;
      storageCache[key] = value;
      return await new Promise((resolve) =>
        chrome.storage.sync.set(pair, () => {
          resolve(true);
        })
      );
    default:
      break;
  }

  return false;
}
