/**
 * Randomly generate a fixed-length string
 * @param {Number} len 
 * @returns {String}
 */
export const generateRandomString = (len:number) => {    
  len = len || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
  a = t.length,
  n = "";
  for (let i = 0; i < len; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
};