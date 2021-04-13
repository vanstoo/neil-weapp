import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import { Login, UpdateConfig, AppInfo, ConfigInfo } from '../../components'
import { UserInfo } from '../../typings'
import './index.scss'

interface IdnexProps {}

interface IndexState {
  current: number
  userInfo: UserInfo
}

export default class Index extends Component<IdnexProps, IndexState> {
  constructor(props: IdnexProps) {
    super(props)
    const { current } = this.$router.params
    let defaultCurrent = current ? Number(current) : 0
    let userInfo: UserInfo = Taro.getStorageSync('userInfo')
    this.state = {
      current: defaultCurrent,
      userInfo: userInfo,
    }
  }

  onShareAppMessage(res) {
    console.log(res)
    let title = `${this.state.userInfo.nickName}给你分享了你是哈批小程序`
    return {
      title: title,
      path: `/pages/index/index?current=0`,
      imageUrl: require('../../res/sharePic.jpg'),
    }
  }

  // tab 切换
  handleTabClick = (value: number) => {
    console.log(value, typeof value)
    this.setState({ current: value })
  }

  render() {
    const { current } = this.state
    const tabMenu = [
      { title: '帮助', iconType: 'help' },
      { title: '配置', iconType: 'filter' },
      { title: '更新', iconType: 'settings' },
      { title: '信息', iconType: 'user' },
    ]

    return (
      <View className="home">
        {current === 0 ? (
          <AppInfo />
        ) : current === 1 ? (
          <ConfigInfo />
        ) : current === 2 ? (
          <UpdateConfig />
        ) : current === 3 ? (
          <Login />
        ) : null}
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
