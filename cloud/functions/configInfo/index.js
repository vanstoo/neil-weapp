// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'get': {
      return getConfig(event)
    }
    case 'update': {
      return updateConfig(event)
    }

    default: {
      return
    }
  }
}

async function getConfig(event) {
  const configInfo = await db.collection('config_info').get()
  return configInfo.data[0]
}



async function updateConfig(event) {
  let configInfo = event.config.replace(/\s+/g, '')
  console.log(event, "updateConfig")
  await db.collection('config_info').update({
    data: {
      updateTime: db.serverDate(),
      config: configInfo
    },
  })
  return configInfo
}