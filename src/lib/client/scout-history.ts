export type ScoutSnapshot = {
  username: string;
  stars: number;
  commits: number;
  ovr: number;
  at: string;
};

const DB_PREFIX = "iceovr-scout-history:";
const STORE_NAME = "scout-history";
const VERSION = 1;

function openDatabase(username: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(`${DB_PREFIX}${username.toLowerCase()}`, VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "username" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getScoutSnapshot(username: string): Promise<ScoutSnapshot | null> {
  const database = await openDatabase(username);
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(username.toLowerCase());
    request.onsuccess = () => resolve((request.result as ScoutSnapshot | undefined) ?? null);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

export async function saveScoutSnapshot(snapshot: ScoutSnapshot): Promise<void> {
  const database = await openDatabase(snapshot.username);
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put({ ...snapshot, username: snapshot.username.toLowerCase() });
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}
