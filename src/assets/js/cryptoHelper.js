/**
 * 加解密工具
 * AES、HASH(MD5、SHA256)、base64
 * @author: qiang
 */
// import CryptoJS from 'crypto-js';
var CryptoJS = require('crypto-js')
const KP = {
  key: '1234567812345678', // 秘钥 16*n:
  iv: '1234567812345678' // 偏移量
}

/**
 *  加密
 * @param {string} data 待加密字符
 * @param {string} key
 * @param {string} iv
 */
function getAesString (data, key, iv) {
  key = CryptoJS.enc.Utf8.parse(key)
  // alert(key）;
  iv = CryptoJS.enc.Utf8.parse(iv)
  let encrypted = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString() // 返回的是base64格式的密文
}

/**
 * 解密
 * @param {string} encrypted
 * @param {string} key
 * @param {string} iv
 */
function getDAesString (encrypted, key, iv) {
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8) //
}

// AES 对称秘钥加密
const aes = {
  en: (data) => getAesString(data, KP.key, KP.iv),
  de: (data) => getDAesString(data, KP.key, KP.iv)
}
// BASE64
const base64 = {
  en: (data) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)),
  de: (data) => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
}
// SHA256
const sha256 = (data) => {
  return CryptoJS.SHA256(data).toString()
}
// MD5
const md5 = (data) => {
  return CryptoJS.MD5(data).toString()
}

/**
 * 签名
 * @param {string} token 身份令牌
 * @param {string} timestamp 签名时间戳
 * @param {*} data 签名数据
 */
const sign = (signkey, data) => {
  // const sign = (signkey, timestamp, data) => {

  // 签名格式： signkey + data(字典升序)
  let ret = []
  for (let it in data) {
    let val = data[it]
    if (!it || it === 'sign' || val === undefined || val === null || val.length <= 0) {
      continue
    }

    if (typeof val === 'object' && //
      (!(val instanceof Array) || (val.length > 0 && (typeof val[0] === 'object')))) {
      val = JSON.stringify(val)
    }
    ret.push(it + val)
  }

  // 字典升序
  ret.sort()
  let signsrc = signkey + ret.join('')

  return md5(signsrc)
}

export {
  aes,
  md5,
  sha256,
  base64,
  sign
}
