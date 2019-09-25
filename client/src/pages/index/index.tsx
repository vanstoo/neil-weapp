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
    this.state = {
      current: 0,
      fileList: {},
      configInfo: {},
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
      title: '获取配置图片中',
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
          title: '获取配置失败',
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
      title: '获取配置信息中',
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
          title: '获取配置失败',
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
    const { current, fileList, configInfo } = this.state
    const { updateTime, config = [] } = configInfo
    return (
      <View className="home">
        {current === 0 ? (
          <View className="config-img">
            <Text>上次更新时间：{dayjs(fileList.updateTime).format(formatType)}</Text>
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
          </View>
        ) : current === 1 ? (
          <View className="config-info">
            {updateTime && <Text>上次更新时间：{dayjs(configInfo.updateTime).format(formatType)}</Text>}
            {config &&
              config.map(item => (
                <View key={item} className="config-item">
                  {item}
                </View>
              ))}
            <AtButton type="secondary" onClick={this.getConfigInfo}>
              获取最新配置
            </AtButton>
            {updateTime && (
              <AtButton type="secondary" onClick={() => this.copyLink(configInfo.config[12])}>
                复制🚀链接
              </AtButton>
            )}
          </View>
        ) : current === 2 ? (
          <Login />
        ) : null}
        <AtTabBar
          color="#999"
          selectedColor="#333"
          fixed
          tabList={[
            { title: '首页', iconType: 'streaming' },
            { title: '配置', iconType: 'filter' },
            { title: '我的', iconType: 'user' },
          ]}
          onClick={this.handleTabClick}
          current={this.state.current}
        />
      </View>
    )
  }
}
