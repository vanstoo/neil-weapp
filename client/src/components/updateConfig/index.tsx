import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'

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

  handleChange = event => {
    // 手动在每行后面加逗号','分隔符
    this.setState({
      configValue: event.target.value,
    })
  }

  // 更新当前配置
  updateconfigValue = () => {
    const { configValue } = this.state
    console.log(configValue, '3232324e')
    Taro.showLoading({
      title: '更新配置信息中',
      mask: true,
    })
    Taro.cloud.callFunction({
      name: 'configInfo',
      data: {
        type: 'update',
        config: configValue,
      },
      success: res => {
        console.log(res, 'res')
        Taro.showLoading({
          title: '更新配置成功',
          mask: true,
        })
        Taro.hideLoading()
      },
      fail: () =>
        Taro.showLoading({
          title: '更新配置失败',
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
          onChange={this.handleChange}
          maxLength={1000}
          placeholder="配置信息 每行后面用逗号','分隔"
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
