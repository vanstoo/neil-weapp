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
    usingComponents: {
      Login: '../../../components/login/index',
      Info: '../../../components/info/index',
    },
  }

  componentWillMount() {}

  componentDidMount() {
    const db = Taro.cloud.database()
    db.collection('config_imgs')
      .get()
      .then(res => {
        console.log(res.data)
      })
    // Taro.cloud.getTempFileURL({
    //   fileList: [],
    //   success: res => {
    //     // fileList 是一个有如下结构的对象数组
    //     // [{
    //     //    fileID: 'cloud://xxx.png', // 文件 ID
    //     //    tempFileURL: '', // 临时文件网络链接
    //     //    maxAge: 120 * 60 * 1000, // 有效期
    //     // }]
    //     console.log(res.fileList)
    //   },
    //   fail: console.error,
    // })
  }

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
        {current === 0 ? <Info /> : <Login />}
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
