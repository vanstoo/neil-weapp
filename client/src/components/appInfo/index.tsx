import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
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

  handleIosClick = value => this.setState({ iosOpen: value })

  handleMacClick = value => this.setState({ macOpen: value })

  handleAndroidClick = value => this.setState({ androidOpen: value })

  handleWinClick = value => this.setState({ winOpen: value })

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
          </View>
        </AtAccordion>
        <AtAccordion open={macOpen} onClick={this.handleMacClick} title="macOs">
          <View className="accordion-item">
            <View
              onClick={() =>
                Taro.setClipboardData({
                  data: 'https://github.com/Cenmrev/V2RayX/releases/download/v1.5.1/V2RayX.app.zip',
                })
              }
            >
              mac上下载v2rayX，<Text className="download-link">github下载地址(点击拷贝)</Text>
            </View>
          </View>
        </AtAccordion>
        <AtAccordion open={androidOpen} onClick={this.handleAndroidClick} title="android">
          <View className="accordion-item">
            <View
              onClick={() =>
                Taro.setClipboardData({
                  data: 'https://github.com/2dust/v2rayNG/releases/download/1.1.15/v2rayNG_1.1.15.apk',
                })
              }
            >
              android上下载v2rayNG，<Text className="download-link">github下载地址(点击拷贝)</Text>
            </View>
          </View>
        </AtAccordion>
        <AtAccordion open={winOpen} onClick={this.handleWinClick} title="win">
          <View className="accordion-item">
            <View
              onClick={() =>
                Taro.setClipboardData({ data: 'https://github.com/2dust/v2rayN/releases/download/3.5/v2rayN.zip' })
              }
            >
              win上下载v2rayN，<Text className="download-link">github下载地址(点击拷贝)</Text>
            </View>
          </View>
        </AtAccordion>

        <View style={{ marginTop: '10px' }}>
          各版本基本都能使用复制的🔗导入，不行的话搜索下对应v2ray的版本+配置方法
        </View>
      </View>
    )
  }
}

export default AppInfo
