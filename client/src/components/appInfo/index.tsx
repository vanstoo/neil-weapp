import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAccordion } from 'taro-ui'
import './index.scss'
export interface AppInfoProps {}

export interface AppInfoState {
  iosOpen: boolean
  macOpen: boolean
  winOpen: boolean
  imgUrls: string[]
}

class AppInfo extends Component<AppInfoProps, AppInfoState> {
  constructor(props: AppInfoProps) {
    super(props)
    this.state = {
      iosOpen: true,
      macOpen: false,
      winOpen: false,
      imgUrls: [
        'cloud://prod-64sbo.7072-prod-64sbo-1256073353/1581903262089.jpg',
        'cloud://prod-64sbo.7072-prod-64sbo-1256073353/461658736801_.pic.jpg',
        'cloud://prod-64sbo.7072-prod-64sbo-1256073353/471658736801_.pic.jpg',
      ],
    }
  }

  handleIosClick = value =>
    this.setState({
      iosOpen: value,
      macOpen: false,
      winOpen: false,
    })

  handleMacClick = value =>
    this.setState({
      iosOpen: false,
      macOpen: value,
      winOpen: false,
    })

  handleWinClick = value =>
    this.setState({
      iosOpen: false,
      macOpen: false,
      winOpen: value,
    })

  seeImgDetail = (index: number) => {
    const { imgUrls } = this.state
    Taro.previewImage({
      current: imgUrls[index],
      urls: imgUrls,
    })
  }

  render() {
    const { iosOpen, macOpen, winOpen, imgUrls } = this.state
    return (
      <View>
        <AtAccordion open={iosOpen} onClick={this.handleIosClick} title="ios">
          <View className="accordion-item">
            <View>ios使用shadowrocket软件(切换到美区才有)</View>
            <View onClick={() => Taro.setClipboardData({ data: 'terry19941015@gmail.com' })}>
              美区账号：<Text className="download-link">terry19941015@gmail.com (点击拷贝)</Text>
            </View>
            <View>密码：Biebangding2021</View>
            <View style={{ color: 'red' }}>只需要去appstore里更换icloud账号</View>
            <View style={{ color: 'red' }}>不要去系统设置里把手机icloud账号给改了</View>
            <View style={{ color: 'red' }}>验证码选短信，找我要</View>
            <View style={{ color: 'red' }}>下载安装后开启shadowrocket的自动更新订阅功能</View>

            {imgUrls.map((x, i) => (
              <Image src={x} key={i.toString()} mode="aspectFit" onClick={() => this.seeImgDetail(i)} />
            ))}
          </View>
        </AtAccordion>
        <AtAccordion open={macOpen} onClick={this.handleMacClick} title="macOs">
          <View className="accordion-item">
            <View
              onClick={() =>
                Taro.setClipboardData({
                  data: 'https://pan.baidu.com/s/1DKzoZqxCV_6v5bYCE-8xbA?pwd=fvqw',
                })
              }
            >
              <View>
                如果是M1芯片的mac，可去appstore登陆ios方法内贴的美区账号，在下载记录里找到shadowrocket，然后去配置页复制shadowrocket用订阅链接导入。
              </View>
              <View>
                非m1的mac上百度云下载maxOS用，解压后安装导入配置里的win或PC用订阅链接，
                <Text className="download-link">网盘地址(点击拷贝)</Text>
              </View>
            </View>
          </View>
        </AtAccordion>
        <AtAccordion open={winOpen} onClick={this.handleWinClick} title="win">
          <View className="accordion-item">
            <View>
              win上百度云下载win用，解压后安装导入配置里的win或PC用订阅链接，
              <Text
                className="download-link"
                onClick={() =>
                  Taro.setClipboardData({ data: 'https://pan.baidu.com/s/1DKzoZqxCV_6v5bYCE-8xbA?pwd=fvqw' })
                }
              >
                网盘地址(点击拷贝)
              </Text>
              <View>
                win的配置使用看这个：
                <Text
                  className="download-link"
                  onClick={() =>
                    Taro.setClipboardData({
                      data: 'https://v2xtls.org/v2rayn-4-12%E9%85%8D%E7%BD%AE%E6%95%99%E7%A8%8B/',
                    })
                  }
                >
                  win配置地址(点击拷贝)
                </Text>
              </View>
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
