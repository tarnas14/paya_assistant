import avatar from './images/avatar.jpg'

const getUserInfoFromQrCodeValue = async () => {
  return {
    avatar: avatar,
    username: 'Tom',
    description: 'I\'m selling pizza',
    email: 'tom@tomAndJerry.com',
  }
}

export {
  getUserInfoFromQrCodeValue
}
