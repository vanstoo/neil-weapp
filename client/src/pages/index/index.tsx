import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import './index.scss'
import Login from '../../components/loginPage'

export default class Index extends Component<any, any> {
  constructor() {
    super(...arguments)
    this.state = {
      current: 0,
      fileList: {},
    }
  }

  config: Config = {
    navigationBarTitleText: '司徒你干啥',
    enablePullDownRefresh: true,
    usingComponents: {
      Login: '../../../components/loginPage/index',
    },
  }

  onPullDownRefresh = () => {
    const { current } = this.state
    if (current === 0) {
      this.getLastConfigImg()
    }
    Taro.stopPullDownRefresh()
  }

  componentWillMount() {}

  componentDidMount() {
    this.getLastConfigImg()
  }

  getLastConfigImg = () => {
    Taro.showLoading({
      title: '获取配置中',
      mask: true,
    })
    Taro.cloud.callFunction({
      name: 'getConfigImg',
      data: {},
      success: configImgs => {
        console.log(configImgs.result.tempFileURL, 'imgIdimgIdimgId')
        this.setState({ fileList: configImgs.result })
        Taro.hideLoading()
      },
      complete: () => {
        Taro.hideLoading()
        Taro.stopPullDownRefresh()
      },
    })
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleClick = value => {
    console.log(value, typeof value)
    this.setState({ current: value })
  }

  render() {
    const { current, fileList } = this.state
    return (
      <View className="home">
        {current === 0 ? (
          <Image
            mode="widthFix"
            src={fileList.tempFileURL}
            onClick={() =>
              Taro.previewImage({
                current: fileList.tempFileURL, // 当前显示图片的http链接
                urls: [fileList.tempFileURL], // 需要预览的图片http链接列表
              })
            }
          />
        ) : current === 1 ? (
          <Login />
        ) : null}
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
