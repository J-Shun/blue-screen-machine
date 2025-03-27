const getOS = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("win")) return "Windows";
  if (userAgent.includes("mac")) return "MacOS";
  if (userAgent.includes("linux")) return "Linux";
  if (userAgent.includes("iphone") || userAgent.includes("ipad")) return "iOS";
  if (userAgent.includes("android")) return "Android";
  return "Unknown";
};

export { getOS };
