/**
 * Every `timer` duration, the function `callback` is called once,
 * and the `repeatNumber` times are called
 * @param {Function} callback
 * @param {Object} {repeatNumber = 1, timer = 400} // unit of timer is `ms`
 * @returns {void}
 */
export const  repeatInterval = (
  callback:  (...args: any[]) => Promise<any>,
  { repeatNumber = 1, timer = 100 }
) => {
  let count = 0; // count number of callback

  const timeoutFunc = async () => {
    console.log("repeatInterval timeoutFunc count: ", count);
    
    const respond = await callback();
    count++;
    if (!respond  && count < repeatNumber) {
      //to setTimeout try again
      window.setTimeout(timeoutFunc, timer);
    }
  }

  window.setTimeout(timeoutFunc, timer);
};