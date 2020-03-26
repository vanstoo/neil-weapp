// 云函数入口文件
const cloud = require("wx-server-sdk")
cloud.init()
const db = cloud.database()

exports.main = async ({
  updateTime
}, context) => {
  let loginUsers = await db.collection("login_users").get()
  let openIdList = loginUsers.data.map(x => x.userOpenId)
  console.log("openIdList", openIdList)
  const tasks = []
  openIdList.forEach(id => {
    let param = {
      touser: id, // 通过 getWXContext 获取 OPENID
      page: "pages/index/index",
      lang: "zh_CN",
      data: {
        date1: {
          value: updateTime
        },
        thing6: {
          value: "🧱更新了"
        }
      },
      templateId: "qEkGB7m_A1nNDCDp2ceSWWmSYL4v0KvPhReSzFAthC8",
      miniprogramState: "trial"
    }
    const promise = cloud.openapi.subscribeMessage.send(param)
    tasks.push(promise)
  })
  try {
    const result = await Promise.all(tasks)
    console.log(result, "subscribeMessage")
    return {
      result
    }
  } catch (err) {
    console.log(err)
    return err
  }
}