import * as request from 'request'
import * as wechart from '../constants/WeChartsInfo'
import { OpenIdBindDTO } from '../dto/OpenIdBindDTO'
import { OpenIdBindModel, OpenIdBind } from '../models/OpenIdBind'

// 发送交易得到用户的openId
export const getOpenId = async (req, res) => {
  const jsCode = req.query.jsCode
  const requestUrl = `https://api.weixin.qq.com/sns/jscode2session?\
appid=${wechart.appid}&secret=${wechart.secret}&js_code=${jsCode}&grant_type=authorization_code`

  await request(requestUrl, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log(body) // Show the HTML for the baidu homepage.
      const openIdBindInfo = queryOpenIdBind(body.openid)
      console.log('data: ' + openIdBindInfo)
      res.json(openIdBindInfo)
    }
  })
}

const queryOpenIdBind = (openid) => {
  const openIdBind = OpenIdBind.findById(openid).exec()
  console.log('bind info = ' + openIdBind)
  const result: OpenIdBindDTO = getOpenIdBindInfo(openIdBind)
  return result
}

const getOpenIdBindInfo = (openIdBind) => {
  const openIdBindInfo = {
    is_bind: false,
    bind_info: null,
  }
  if (openIdBind && openIdBind.is_bind) {
    openIdBindInfo.is_bind = true
    openIdBindInfo.bind_info = openIdBind
  }
  console.log('execute ...' + openIdBindInfo)
  return openIdBindInfo as OpenIdBindDTO
}
