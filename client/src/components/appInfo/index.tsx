import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAccordion } from 'taro-ui'
import './index.scss'
export interface AppInfoProps {}

export interface AppInfoState {
  iosOpen: boolean
  macOpen: boolean
  androidOpen: boolean
  winOpen: boolean
}

class AppInfo extends Component<AppInfoProps, AppInfoState> {
  constructor(props: AppInfoProps) {
    super(props)
    this.state = {
      iosOpen: true,
      macOpen: false,
      androidOpen: false,
      winOpen: false,
    }
  }

  handleIosClick = value =>
    this.setState({
      iosOpen: value,
      macOpen: false,
      androidOpen: false,
      winOpen: false,
    })

  handleMacClick = value =>
    this.setState({
      iosOpen: false,
      macOpen: value,
      androidOpen: false,
      winOpen: false,
    })

  handleAndroidClick = value =>
    this.setState({
      iosOpen: false,
      macOpen: false,
      androidOpen: value,
      winOpen: false,
    })

  handleWinClick = value =>
    this.setState({
      iosOpen: false,
      macOpen: false,
      androidOpen: false,
      winOpen: value,
    })

  seeImgDetail = () => {
    Taro.previewImage({
      current: 'https://image.qfstatic.com/qfSales/d45cbbe8-6c32-47d5-ac1f-1b294d492fbb/appstore.jpeg',
      urls: ['https://image.qfstatic.com/qfSales/d45cbbe8-6c32-47d5-ac1f-1b294d492fbb/appstore.jpeg'],
    })
  }

  render() {
    const { iosOpen, macOpen, androidOpen, winOpen } = this.state
    return (
      <View>
        <AtAccordion open={iosOpen} onClick={this.handleIosClick} title="ios">
          <View className="accordion-item">
            <View>ios使用shadowrocket软件(切换到美区才有)</View>
            <View onClick={() => Taro.setClipboardData({ data: 'terry19941015@gmail.com' })}>
              美区账号：<Text className="download-link">terry19941015@gmail.com (点击拷贝)</Text>
            </View>
            <View>密码：Neilwang1994</View>
            <View style={{ color: 'red' }}>
              只需要去appstore里更换icloud账号，不需要去系统设置里把自己的主icloud账号给改了
            </View>
            <Image src={require('../../res/appstore.jpeg')} mode="aspectFit" onClick={this.seeImgDetail} />
          </View>
        </AtAccordion>
        <AtAccordion open={macOpen} onClick={this.handleMacClick} title="macOs">
          <View className="accordion-item">
            <View
              onClick={() =>
                Taro.setClipboardData({
                  data: '链接: https://pan.baidu.com/s/1V_PLpyZokhrIefdwq9lNFQ 提取码: i945',
                })
              }
            >
              mac上百度云下载maxOS用，解压后安装导入配置里的🔗<Text className="download-link">网盘地址(点击拷贝)</Text>
            </View>
          </View>
        </AtAccordion>
        <AtAccordion open={androidOpen} onClick={this.handleAndroidClick} title="android">
          <View className="accordion-item">
            <View
              onClick={() =>
                Taro.setClipboardData({
                  data: '链接: https://pan.baidu.com/s/1V_PLpyZokhrIefdwq9lNFQ 提取码: i945',
                })
              }
            >
              android上百度云下载android用，解压后安装导入配置里的🔗，
              <Text className="download-link">网盘地址(点击拷贝)</Text>
            </View>
          </View>
        </AtAccordion>
        <AtAccordion open={winOpen} onClick={this.handleWinClick} title="win">
          <View className="accordion-item">
            <View
              onClick={() =>
                Taro.setClipboardData({ data: '链接: https://pan.baidu.com/s/1V_PLpyZokhrIefdwq9lNFQ 提取码: i945' })
              }
            >
              win上百度云下载win用，解压后安装导入配置里的🔗，
              <Text className="download-link">网盘地址(点击拷贝)</Text>
            </View>
          </View>
        </AtAccordion>

        <View style={{ marginTop: '10px', paddingBottom: '40px' }}>
          各版本基本都能使用复制的🔗导入，不行的话搜索下对应v2ray的版本+配置方法
        </View>
      </View>
    )
  }
}

export default AppInfo
