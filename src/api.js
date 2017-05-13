import auth from './auth'

const getUserInfoFromQrCodeValue = async () => {
  return {
    iconColor: '#080',
    name: 'Tom',
    description: 'I\'m selling pizza',
    email: 'tom@tomAndJerry.com',
  }
}

const getBasicUserInfo = async () => {
  return {
    iconColor: '#030',
    name: 'Jerry',
    description: 'I\'m eating pizza',
    email: 'jerry@tomAndJerry.com',
  }
}

const getTipsHistory = async () => {
  return {
    given: [
{
date: {
date: "2017-06-13 00:00:00.000000",
timezone_type: 3,
timezone: "Europe/Berlin"
},
amount: 200,
message: "dwa",
recipientName: "Nadia",
recipientColor: "#2196f3"
},
    ],
    received: [{
date: {
date: "2017-05-12 00:00:00.000000",
timezone_type: 3,
timezone: "Europe/Berlin"
},
amount: 21,
message: "dsd"
},]
  }
}

export {
  getUserInfoFromQrCodeValue,
  getBasicUserInfo,
  getTipsHistory
}
