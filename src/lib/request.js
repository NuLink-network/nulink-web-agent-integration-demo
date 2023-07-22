import { baseUrl as baseURL } from './url'

const username = process.env.REACT_APP_SERVER_USERNAME;
const password = process.env.REACT_APP_SERVER_PASSWORD;
/**
 * Get请求
 *
 * @param {*} url 请求URL
 * @param {*} params 请求参数
 */

export function get (url, params) {
  // 请求参数处理
  const param = params && { ...params }
  if (param) {
    const paramsArray = []
    Object.keys(param).forEach((key) =>
      paramsArray.push(key + '=' + param[key])
    )
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
    } else {
      url += '&' + paramsArray.join('&')
    }
  }
  return new Promise(function(resolve, reject) {
    fetch(`${baseURL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * POST请求，请求参数以JSON形式发送
 *
 * @param {*} url 请求URL
 * @param {*} params 请求参数
 */
export function post (url, params?) {
  const reqParams = JSON.stringify(params)
  const token = Buffer.from(`${username}:${password}`, "utf8").toString(
    "base64"
  );
  return new Promise((resolve, reject) => {
    fetch(`${baseURL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization':`Basic ${token}`
      },
      body: reqParams
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson)
      })
      .catch(function(err) {
        reject(err)
      })
  })
}

/**
 * PUT请求，请求参数以JSON形式发送
 *
 * @param {*} url 请求URL
 * @param {*} params 请求参数
 */
export function put (url, params) {
  const reqParams = JSON.stringify(params)
  const param = params && { ...params }
  if (param) {
    const paramsArray = []
    Object.keys(param).forEach((key) =>
      paramsArray.push(key + '=' + param[key])
    )
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
    } else {
      url += '&' + paramsArray.join('&')
    }
  }
  return new Promise((resolve, reject) => {
    fetch(`${baseURL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: reqParams
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson)
      })
      .catch(function(err) {
        reject(err)
      })
  })
}
