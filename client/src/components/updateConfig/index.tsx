import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'
import dayjs from 'dayjs'
const formatType = 'YYYY-MM-DD HH:mm:ss'
export interface UpdateConfigProps {
  isAdmin: boolean

}

export interface UpdateConfigState {
  configValue: string
}

class UpdateConfig extends Component<UpdateConfigProps, UpdateConfigState> {
  constructor(props: UpdateConfigProps) {
    super(props)
    this.state = {
      configValue: '',
    }
  }

  // 更新当前配置
  updateconfigValue = () => {
    const { configValue } = this.state
    console.log(configValue, 'updateconfigValue')
    if (configValue) {
      Taro.showLoading({
        title: '更新配置信息中',
        mask: true,
      })
      Taro.cloud.callFunction({
        name: 'configInfo',
        data: {
          type: 'update',
          config: configValue.replace(/\s+/g, ''),
        },
        success: ({ result }) => {
          console.log(result, '更新配置成功')
          if (result) {
            Taro.showLoading({
              title: '更新配置成功',
              mask: true,
            })
            Taro.hideLoading()
            this.sendSubscribeInfo()
          } else {
            Taro.showLoading({
              title: '更新配置失败',
              mask: true,
            })
          }
        },
        fail: () =>
          Taro.showLoading({
            title: '更新配置失败',
            mask: true,
          }),
        complete: () => setTimeout(() => Taro.hideLoading(), 2000),
      })
    }
  }

  // 发送订阅消息
  sendSubscribeInfo = () => {
    console.log('sendSubscribeInfo')
    Taro.cloud.callFunction({
      name: 'sendSubscribeInfo',
      data: {
        updateTime: dayjs().format(formatType),
      },
      success: res => {
        console.log(res, 'res')
        Taro.showLoading({
          title: '推送成功',
          mask: true,
        })
        Taro.hideLoading()
      },
      fail: () =>
        Taro.showLoading({
          title: '推送失败',
          mask: true,
        }),
      complete: () => {
        Taro.hideLoading()
      },
    })
  }
  render() {
    const { configValue } = this.state
    return (
      <View>
        <AtTextarea
          count={true}
          value={configValue}
          onChange={val => this.setState({ configValue: val })}
          maxLength={1000}
          placeholder="v2ray url"
          height={500}
        />
        {this.props.isAdmin && (
          <AtButton type="secondary" onClick={this.updateconfigValue} customStyle={{ marginTop: '20px' }}>
            确定
          </AtButton>
        )}
      </View>
    )
  }
}

export default UpdateConfig
