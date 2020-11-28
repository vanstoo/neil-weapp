import Taro from '@tarojs/taro'
import dayjs from 'dayjs'

// 格式化时间
export const formatDate = (
  date: string | dayjs.Dayjs | undefined,
  formatType = 'YYYY-MM-DD',
  emptyStr: string = '',
): string =>
  date
    ? dayjs(date).isValid()
      ? dayjs(date).format(formatType)
      : typeof date === 'string'
      ? date
      : emptyStr
    : emptyStr

// 订阅消息模版
export const subscribeInfo = (callback: Function) => {
  console.log('subscribeInfo订阅消息模版')
  Taro.showLoading({ mask: true, title: '' })
  Taro.requestSubscribeMessage({
    tmplIds: ['qEkGB7m_A1nNDCDp2ceSWWmSYL4v0KvPhReSzFAthC8'],
    success(res) {
      console.log('requestSubscribeMessage', res)
    },
    complete() {
      Taro.hideLoading()
      callback()
    },
  })
}

export const goToLoginPage = () => {
  Taro.showToast({
    title: '请先授权登陆',
    icon: 'none',
    mask: true,
  })
  let timer = setTimeout(() => {
    Taro.removeStorageSync('userInfo')
    clearTimeout(timer)
    Taro.redirectTo({ url: '/pages/index/index?current=3' })
  }, 2000)
}
