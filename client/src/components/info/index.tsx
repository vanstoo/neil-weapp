import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class Info extends Component<any, any> {
  constructor() {
    super(...arguments)
    this.state = {
      fileList: {},
    }
  }

  config: Config = {}

  componentWillMount() {
    this.getLastConfigImg()
  }

  componentDidMount() {}

  getLastConfigImg = () => {
    Taro.showLoading({
      title: '获取配置中',
    })
    Taro.cloud
      .callFunction({
        name: 'getConfigImg',
        data: {},
      })
      .then(configImgs => {
        console.log(configImgs.result.tempFileURL, 'imgIdimgIdimgId')
        this.setState({ fileList: configImgs.result })
        Taro.hideLoading()
      })
      .finally(() => Taro.hideLoading())
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { fileList } = this.state
    console.log(fileList)
    return (
      <View className="home">
        <Image
          mode="widthFix"
          src={fileList.tempFileURL}
          onClick={() =>
            Taro.previewImage({
              current: fileList.tempFileURL, // 当前显示图片的http链接
              urls: [fileList.tempFileURL], // 需要预览的图片http链接列表
            })
          }
        ></Image>
      </View>
    )
  }
}
