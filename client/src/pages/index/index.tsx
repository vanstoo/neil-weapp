import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtTabBar, AtButton } from 'taro-ui'
import Login from '../../components/loginPage'
import './index.scss'
import dayjs from 'dayjs'
const formatType = 'YYYY-MM-DD HH:mm:ss'
export default class Index extends Component<any, any> {
  constructor() {
    super(...arguments)
    const { current } = this.$router.params

    let defaultCurrent = current ? Number(current) : 0
    console.log(defaultCurrent)

    this.state = {
      current: defaultCurrent,
      fileList: {},
      configInfo: {},
      isAdmin: Taro.getStorageSync('openId') === 'oWL9M5TfBXk_-RiunU3S7OpyK5fQ',
    }
  }

  config: Config = {
    navigationBarTitleText: '你是哈批',
    enablePullDownRefresh: true,
    usingComponents: {
      Login: '../../../components/loginPage/index',
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

  getLastConfigImg = () => {
    Taro.showLoading({
      title: this.state.isAdmin ? '获取配置图片中' : '获取哈批配置图片中',
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

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  // tab 切换
  handleTabClick = value => {
    console.log(value, typeof value)
    this.setState({ current: value })
  }
  // 获取当前配置
  getConfigInfo = () => {
    let str = ``

    Taro.showLoading({
      title: this.state.isAdmin ? '获取配置信息中' : '获取哈批配置信息中',
      mask: true,
    })
    Taro.cloud.callFunction({
      name: 'configInfo',
      data: {
        type: 'get',
        // type: 'update',
        config: str,
      },
      success: info => {
        const { config, ...otehr } = info.result
        let fotmatConfig = config.split(',')
        this.setState({ configInfo: { ...otehr, config: fotmatConfig } })
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

  copyLink = data => {
    let link = data.split('链接:')[1]
    console.log(data, link)
    Taro.setClipboardData({ data: link })
  }
  render() {
    const { current, configInfo, isAdmin } = this.state
    const { updateTime, config = [] } = configInfo
    return (
      <View className="home">
        {//   current === 0 ? (
        //   <View className="config-img">
        //     <Text>上次更新时间：{dayjs(fileList.updateTime).format(formatType)}</Text>
        //     <Image
        //       mode="widthFix"
        //       src={fileList.tempFileURL}
        //       onClick={() =>
        //         Taro.previewImage({
        //           current: fileList.tempFileURL, // 当前显示图片的http链接
        //           urls: [fileList.tempFileURL], // 需要预览的图片http链接列表
        //         })
        //       }
        //     />
        //   </View>
        // ) :
        current === 0 ? (
          <View className="config-info">
            {updateTime && <Text>上次更新时间：{dayjs(configInfo.updateTime).format(formatType)}</Text>}
            {config &&
              config.map(item => (
                <View key={item} className="config-item">
                  {item}
                </View>
              ))}

            {updateTime && (
              <AtButton type="secondary" onClick={() => this.copyLink(configInfo.config[12])}>
                {isAdmin ? '复制🚀链接' : '复制哈批🚀链接'}
              </AtButton>
            )}
            <AtButton type="secondary" onClick={this.getConfigInfo}>
              {isAdmin ? '获取最新配置' : '获取最新哈批配置'}
            </AtButton>
          </View>
        ) : current === 1 ? (
          <Login />
        ) : null}
        <AtTabBar
          color="#999"
          selectedColor="#333"
          fixed
          tabList={[
            // { title: isAdmin ? '首页' : '哈批首页', iconType: 'streaming' },
            { title: isAdmin ? '配置' : '哈批配置', iconType: 'filter' },
            { title: isAdmin ? '信息' : '哈批信息', iconType: 'user' },
          ]}
          onClick={this.handleTabClick}
          current={this.state.current}
        />
      </View>
    )
  }
}
