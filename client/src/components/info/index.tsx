import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class Info extends Component<any, any> {
  constructor() {
    super(...arguments)
    this.state = {
      fileList: [],
    }
  }
  config: Config = {}

  componentWillMount() {}

  componentDidMount() {
    const db = Taro.cloud.database()
    db.collection('config_imgs')
      .count()
      .then(resCount => {
        console.log(resCount)
        const { total = 0 } = resCount
        if (total > 0) {
          db.collection('config_imgs')
            .skip(total - 1)
            .get()
            .then(configImgs => {
              console.log(configImgs)
              const { data } = configImgs
              Taro.cloud
                .getTempFileURL({
                  fileList: [data[0].imgId],
                })
                .then(tempUrl => {
                  // get temp file URL
                  console.log(tempUrl.fileList, 'fileList')
                  this.setState({ fileList: tempUrl.fileList })
                })
            })
        }
      })
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { fileList } = this.state
    return (
      <View className="home">
        <Image src={fileList[0].tempFileURL}></Image>
      </View>
    )
  }
}
