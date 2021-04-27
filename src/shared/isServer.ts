/**
 * check if currently running on server or client
 */
const isServer = () => {
  try {
    return process && process.env && process.env.IS_SERVER;
  } catch {
    return false;
  }
};

export default isServer;
