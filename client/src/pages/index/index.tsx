import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import './index.scss'
import Login from '../../components/login'
import Info from '../../components/info'

export default class Index extends Component<any, any> {
  constructor() {
    super(...arguments)
    this.state = {
      current: 0,
    }
  }

  config: Config = {
    navigationBarTitleText: '司徒你干啥',
    enablePullDownRefresh: true,
    usingComponents: {
      Login: '../../../components/login/index',
      Info: '../../../components/info/index',
    },
  }

  onPullDownRefresh = () => {
    const { current } = this.state
    if (current === 0) {
      this.setState({ current: 2 }, () => {
        this.setState({ current: current })
      })
    }
    Taro.stopPullDownRefresh()
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleClick = value => {
    console.log(value, typeof value)
    this.setState({ current: value })
  }
  render() {
    const { current } = this.state
    return (
      <View className="home">
        {current === 0 ? <Info /> : current === 1 ? <Login /> : null}
        <AtTabBar
          color="#999"
          selectedColor="#333"
          fixed
          tabList={[{ title: '首页', iconType: 'streaming' }, { title: '我的', iconType: 'user' }]}
          onClick={this.handleClick}
          current={this.state.current}
        />
      </View>
    )
  }
}
