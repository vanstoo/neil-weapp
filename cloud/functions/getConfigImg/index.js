const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const {
    ENV,
    OPENID,
  } = cloud.getWXContext()
  const configImgs = await db.collection('config_imgs')
    .orderBy("createTime", "desc")
    .limit(1)
    .get()
  let imgId = configImgs.data ? configImgs.data[0].imgId : "" // 获取云文件id
  console.log(imgId, '获取云文件id')
  const tempUrl = await cloud.getTempFileURL({
    fileList: [imgId],
  })

  return {
    ...tempUrl.fileList[0],
    ENV,
    OPENID,
  }

}