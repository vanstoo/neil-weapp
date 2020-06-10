import Taro from '@tarojs/taro'

// 订阅消息模版
export const subscribeInfo = (callback: Function) => {
  console.log('subscribeInfo订阅消息模版')
  Taro.requestSubscribeMessage({
    tmplIds: ['qEkGB7m_A1nNDCDp2ceSWWmSYL4v0KvPhReSzFAthC8'],
    success(res) {
      console.log('requestSubscribeMessage', res)
    },
    complete() {
      callback()
    },
  })
}
