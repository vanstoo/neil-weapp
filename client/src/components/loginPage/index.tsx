import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import './index.scss'
import dayjs from 'dayjs'

interface LoginProps {
  isAdmin: boolean
}

interface LoginState {
  userInfo: {
    openId: string
    nickName: string
    gender: number // 男1
    city: string
    province: string
    country: string
    avatarUrl: string
    unionId: string
  }
}

export default class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
    this.state = {
      userInfo: Taro.getStorageSync('userInfo'),
    }
  }

  getUserInfo = e => {
    const { userInfo } = e.detail
    console.log(e)
    if (userInfo) {
      this.setState({ userInfo: userInfo })
      Taro.setStorageSync('userInfo', userInfo)
    }
  }

  // 上传图片
  doUpload = () => {
    // 选择图片
    let _that = this
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: res => _that.uploadImg(res),
    })
  }

  // 上传图片
  uploadImg = res => {
    let _that = this
    Taro.showLoading({
      title: '上传中',
    })
    console.log(res, '选择图片')
    const filePath = res.tempFilePaths[0]
    // 上传图片
    const cloudPath = dayjs().valueOf() + '.jpg' // 时间戳作为路径
    Taro.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        Taro.showToast({
          icon: 'success',
          title: '上传成功',
        })
        _that.dbAddConfigImg(res)
      },
      fail: err => {
        console.error('[上传文件] 失败：', err)
        Taro.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete: () => setTimeout(() => Taro.hideLoading(), 1500),
    })
  }
  // 传完的图片存进数据库
  dbAddConfigImg = res => {
    const db = Taro.cloud.database()
    db.collection('upload_imgs').add({
      data: {
        imgId: res.fileID,
        createTime: db.serverDate(),
      },
      success: (res: any) => {
        // 在返回结果中会包含新创建的记录的 _id
        Taro.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        Taro.showToast({
          icon: 'none',
          title: '新增记录失败',
        })
        console.error('[数据库] [新增记录] 失败：', err)
      },
    })
  }

  render() {
    const { userInfo } = this.state
    const { isAdmin } = this.props
    const { nickName = '', avatarUrl } = userInfo
    return (
      <View className="wrapper">
        <View className="user-box">
          <AtAvatar circle text="喔" image={avatarUrl}></AtAvatar>
          <View className="user-name">
            {!isAdmin ? '你是哈批' : ''}
            {nickName}
          </View>
        </View>
        {!nickName && (
          <AtButton type="primary" openType="getUserInfo" onGetUserInfo={this.getUserInfo}>
            点击授权登录
          </AtButton>
        )}
        {isAdmin && (
          <AtButton type="secondary" onClick={this.doUpload} customStyle={{ marginTop: '20px' }}>
            上传图片
          </AtButton>
        )}
      </View>
    )
  }
}
