const getOS = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("win")) return "Windows";
  if (userAgent.includes("mac")) return "MacOS";
  if (userAgent.includes("linux")) return "Linux";
  if (userAgent.includes("iphone") || userAgent.includes("ipad")) return "iOS";
  if (userAgent.includes("android")) return "Android";
  return "Unknown";
};

const setLocalStorageItem = <T = string>(key: string, value: T) => {
  const stringifiedValue = JSON.stringify(value);
  localStorage.setItem(key, stringifiedValue);
}

const getLocalStorageItem = <T = string>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  return JSON.parse(item) as T;
};

export { getOS, setLocalStorageItem, getLocalStorageItem };
