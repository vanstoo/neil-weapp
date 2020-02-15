import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabBar, AtButton } from 'taro-ui'
import { Login, UpdateConfig } from '../../components'

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
}

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
    }
  }

  config: Config = {
    navigationBarTitleText: '你是哈批',
    enablePullDownRefresh: true,
    usingComponents: {
      Login: '../../../components/loginPage/index',
      UpdateConfig: '../../../components/updateConfig/index',
    },
  }

  onPullDownRefresh = () => {
    const { current } = this.state
    if (current === 0) {
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

  componentWillMount() {}

  componentDidMount() {
    this.getConfigInfo()
    Taro.setNavigationBarTitle({
      title: this.state.isAdmin ? '你很正常' : '你是哈批',
    })
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
        this.setState({
          configInfo: result,
        })
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

  render() {
    const { current, configInfo, isAdmin } = this.state
    const { updateTime, config } = configInfo
    const tabMenu = isAdmin
      ? [
          { title: '配置', iconType: 'filter' },
          { title: '更新', iconType: 'settings' },
          { title: '信息', iconType: 'user' },
        ]
      : [
          { title: '哈批配置', iconType: 'filter' },
          { title: '哈批更新', iconType: 'settings' },
          { title: '哈批信息', iconType: 'user' },
        ]
    return (
      <View className="home">
        {current === 0 ? (
          <View className="config-info">
            {updateTime && (
              <Text style={{ color: 'red', fontSize: '15px' }}>
                上次更新时间：{dayjs(configInfo.updateTime).format(formatType)}
              </Text>
            )}
            {config && (
              <View className="config-item" style={{ color: 'blue' }}>
                v2ray账号链接：{config}
              </View>
            )}
            <View className="config-item" style={{ marginTop: '10px' }}>
              复制了直接打开shadowrocket就行
            </View>
            {updateTime && (
              <AtButton type="secondary" onClick={() => this.copyLink(config)}>
                {isAdmin ? '复制🔗' : '复制哈批🔗'}
              </AtButton>
            )}
            <AtButton type="secondary" onClick={this.getConfigInfo}>
              {isAdmin ? '获取最新配置' : '获取最新哈批配置'}
            </AtButton>
          </View>
        ) : current === 1 ? (
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
