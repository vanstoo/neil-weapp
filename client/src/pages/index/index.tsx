import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabBar, AtButton, AtModal } from 'taro-ui'
import { Login, UpdateConfig, AppInfo } from '../../components'
import { subscribeInfo } from '../../utils'
import './index.scss'
import dayjs from 'dayjs'
const formatType = 'YYYY-MM-DD HH:mm:ss'

interface IdnexProps {}

type ConfigInfo = {
  updateTime: string
  config: string
  _id: string
}
interface IndexState {
  current: number
  isAdmin: boolean
  configInfo: ConfigInfo
  showModal: boolean
}

const envType = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'

export default class Index extends Component<IdnexProps, IndexState> {
  constructor(props: IdnexProps) {
    super(props)
    const { current } = this.$router.params
    let defaultCurrent = current ? Number(current) : 0
    console.log(defaultCurrent)
    this.state = {
      current: defaultCurrent,
      configInfo: {} as ConfigInfo,
      isAdmin: Taro.getStorageSync('openId') === 'oWL9M5TfBXk_-RiunU3S7OpyK5fQ',
      showModal: false,
    }
  }

  config: Config = {
    navigationBarTitleText: '你是哈批',
    enablePullDownRefresh: true,
  }

  onPullDownRefresh = () => {
    const { current } = this.state
    if (current === 1) {
      this.getConfigInfo()
    }
    Taro.stopPullDownRefresh()
  }

  onShareAppMessage(res) {
    console.log(res)
    let title = this.state.isAdmin ? '你爹王司徒给你分享了你是哈批小程序' : '哈批给你分享了你也是哈批小程序'
    return {
      title: title,
      path: `/pages/index/index?current=${this.state.current}`,
      imageUrl: require('../../res/sharePic.jpg'),
    }
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({ title: this.state.isAdmin ? '你很正常' : '你是哈批' })
    this.getConfigInfo()
  }

  // tab 切换
  handleTabClick = (value: number) => {
    console.log(value, typeof value)
    this.setState({ current: value })
  }

  // 获取当前配置
  getConfigInfo = () => {
    Taro.showLoading({
      title: this.state.isAdmin ? '获取配置信息中' : '获取哈批配置信息中',
      mask: true,
    })
    Taro.cloud.callFunction({
      name: 'configInfo',
      data: {
        type: 'get',
      },
      success: ({ result }) => {
        if (result) {
          this.setState({ configInfo: result as any })
        }
        Taro.hideLoading()
      },
      fail: () =>
        Taro.showLoading({
          title: this.state.isAdmin ? '获取配置失败' : '获取哈批配置失败',
          mask: true,
        }),
      complete: () => {
        Taro.hideLoading()
        Taro.stopPullDownRefresh()
      },
    })
  }

  copyLink = (data: string) => {
    console.log(data)
    Taro.setClipboardData({ data: data })
  }

  // 订阅消息模版
  subscribeInfo = () => {
    console.log('subscribeInfo')
    let that = this
    if (Taro.requestSubscribeMessage) {
      Taro.showLoading({
        mask: true,
        title: '发起订阅中...',
      })
      Taro.requestSubscribeMessage({
        tmplIds: ['qEkGB7m_A1nNDCDp2ceSWWmSYL4v0KvPhReSzFAthC8'],
        success(res) {
          console.log('requestSubscribeMessage', res)
          that.guidSubscribeMessageAuthAfter()
        },
        fail(res) {
          // 20004:用户关闭了主开关，无法进行订阅,引导开启
          if (res.errCode == 20004) {
            console.log(res, 'fail:用户关闭了主开关，无法进行订阅,引导开启---')
            that.guideOpenSubscribeMessage()
          }
        },
        complete() {
          Taro.hideLoading()
        },
      })
    } else {
      Taro.showToast({
        title: '请更新您微信版本，来获取订阅消息功能',
        icon: 'none',
        mask: true,
      })
    }
  }

  // 获取设置信息
  guidSubscribeMessageAuthAfter() {
    let that = this
    console.log('获取设置信息')
    Taro.showLoading({
      mask: true,
      title: '查询订阅设置...',
    })
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log(res, 'getSetting')
        let { subscriptionsSetting: { mainSwitch = false, itemSettings = {} } = {} } = res
        if (!mainSwitch) {
          console.log('未开启授权开关')
          that.guideOpenSubscribeMessage()
        }
        console.log(res.subscriptionsSetting, 'res.subscriptionsSetting', Object.values(itemSettings).length)
        // 点了总是保持以上选择
        if (
          Object.values(itemSettings).length > 0 &&
          itemSettings['qEkGB7m_A1nNDCDp2ceSWWmSYL4v0KvPhReSzFAthC8'] !== 'accept'
        ) {
          that.guideOpenSubscribeMessage()
        }
        if (
          Object.values(itemSettings).length > 0 &&
          itemSettings['qEkGB7m_A1nNDCDp2ceSWWmSYL4v0KvPhReSzFAthC8'] === 'accept'
        ) {
          Taro.showToast({
            title: '订阅成功咧',
            icon: 'none',
            mask: true,
          })
        }
      },
      complete() {
        setTimeout(() => Taro.hideLoading(), 2000)
      },
    })
  }

  // 打开弹窗提醒
  guideOpenSubscribeMessage = () => {
    console.log('打开设置页面')
    this.setState({ showModal: true })
  }

  // 跳转用户设置
  showUserSetting = () => {
    this.setState({ showModal: false })
    Taro.openSetting({})
  }

  render() {
    const { current, configInfo, isAdmin, showModal } = this.state
    const { updateTime, config } = configInfo
    const tabMenu = isAdmin
      ? [
          { title: '帮助', iconType: 'help' },
          { title: '配置', iconType: 'filter' },
          { title: '更新', iconType: 'settings' },
          { title: '信息', iconType: 'user' },
        ]
      : [
          { title: '哈批看的', iconType: 'help' },
          { title: '哈批配置', iconType: 'filter' },
          { title: '哈批不要点', iconType: 'settings' },
          { title: '哈批の信息', iconType: 'user' },
        ]
    return (
      <View className="home">
        {current === 0 ? (
          <AppInfo />
        ) : current === 1 ? (
          <View className="config-info">
            {updateTime && (
              <Text style={{ color: 'red', fontSize: '15px' }}>
                上次更新时间：{dayjs(configInfo.updateTime).format(formatType)}
              </Text>
            )}
            <View>版本信息：{envType}</View>
            {config && (
              <View className="config-item" style={{ color: 'blue' }}>
                v2ray链接(复制了直接打开shadowrocket就行)：
                <View> {config}</View>
              </View>
            )}
            {updateTime && (
              <AtButton type="secondary" onClick={() => subscribeInfo(() => this.copyLink(config))}>
                {isAdmin ? '复制🔗' : '复制哈批🔗'}
              </AtButton>
            )}
            <AtButton type="secondary" onClick={() => subscribeInfo(() => this.getConfigInfo())}>
              {isAdmin ? '获取最新配置' : '获取最新哈批配置'}
            </AtButton>
            <AtButton type="secondary" onClick={this.subscribeInfo}>
              订阅更新推送
            </AtButton>
            <AtModal
              isOpened={showModal}
              title="提示"
              confirmText="确认"
              onClose={() => this.setState({ showModal: false })}
              onCancel={() => this.setState({ showModal: false })}
              onConfirm={this.showUserSetting}
              content={`${
                !isAdmin ? '哈批你' : '你'
              }拒绝了订阅通知，点击后将跳转设置页面，请自己手动开启订阅消息权限，并将其下的“代码更新权限”打开`}
            />
          </View>
        ) : current === 2 ? (
          <UpdateConfig isAdmin={isAdmin} />
        ) : (
          <Login isAdmin={isAdmin} />
        )}
        <AtTabBar
          color="#999"
          selectedColor="#333"
          fixed
          tabList={tabMenu}
          onClick={this.handleTabClick}
          current={this.state.current}
        />
      </View>
    )
  }
}
