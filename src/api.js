import avatar from './images/avatar.jpg'

const getUserInfoFromQrCodeValue = async () => {
  return {
    avatar: avatar,
    username: 'Tom',
    description: 'I\'m selling pizza',
    email: 'tom@tomAndJerry.com',
  }
}

const getBasicUserInfo = async token => {
  return {
    avatar: avatar,
    username: 'Jerry',
    description: 'I\'m eating pizza',
    email: 'jerry@tomAndJerry.com',
  }
}

export {
  getUserInfoFromQrCodeValue,
  getBasicUserInfo
}
