const getUserInfoFromQrCodeValue = async () => {
  return {
    iconColor: '#080',
    username: 'Tom',
    description: 'I\'m selling pizza',
    email: 'tom@tomAndJerry.com',
  }
}

const getBasicUserInfo = async token => {
  return {
    iconColor: '#030',
    username: 'Jerry',
    description: 'I\'m eating pizza',
    email: 'jerry@tomAndJerry.com',
  }
}

export {
  getUserInfoFromQrCodeValue,
  getBasicUserInfo
}
