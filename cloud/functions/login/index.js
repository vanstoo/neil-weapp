// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”
const cloud = require("wx-server-sdk")

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 调用获取和云函数当前所在环境相同的数据库的引用
const db = cloud.database()

/**
 * 这个示例将经自动鉴权过的小程序用户 openId 返回给小程序端
 *
 * event 参数包含小程序端调用传入的 data
 *
 */
exports.main = async (event, context) => {
  // console.log 的内容可以在云开发云函数调用日志查看
  console.log(event, "event event")
  console.log(context, "context context")
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const {
    OPENID,
    APPID,
    UNIONID,
    ENV
  } = cloud.getWXContext()
  // 获取login_users下是否已经存在openId
  let loginUsers = await db
    .collection("login_users")
    .where({
      userOpenId: OPENID
    })
    .get()
  if (loginUsers && loginUsers.data && loginUsers.data.length === 0) {
    await db.collection("login_users").add({
      data: {
        createTime: db.serverDate(),
        userOpenId: OPENID
      }
    })
  }
  return {
    openId: OPENID,
    appid: APPID,
    unionid: UNIONID,
    env: ENV
  }
}