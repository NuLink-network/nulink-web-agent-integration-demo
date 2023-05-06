import storage, { storagePrefix } from "./storage";
const tokenStorage = {
  getToken: () => {
    const key = `${storagePrefix}token`;
    return storage.getItem(key) as any;
  },
  setToken: (token: string) => {
    const key = `${storagePrefix}token`,
      value = JSON.stringify(token);
    storage.setItem(key, value);
  },
  clearToken: () => {
    const key = `${storagePrefix}token`;
    storage.removeItem(key);
  },
}
export default tokenStorage;