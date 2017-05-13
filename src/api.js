import qs from 'qs'
import auth from './auth'

const apiEndpoint = process.env.REACT_APP_API

const getUserInfoFromQrCodeValue = async (qrCodeValue) => {
  // get /users/{guid}
  return fetch(`${apiEndpoint}/users/${qrCodeValue}?token=${auth.token()}`).then(response => response.json())
}

const getBasicUserInfo = async () => {
  // get /profile
  return fetch(`${apiEndpoint}/profile?token=${auth.token()}`).then(response => response.json()).catch(console.log)
}

const getProfileStats = async () => {
  return fetch(`${apiEndpoint}/profile/stats?token=${auth.token()}`).then(response => response.json())
}

const getHistory = async () => {
  return fetch(`${apiEndpoint}/profile/tips?token=${auth.token()}`).then(response => response.json())
}

const getProfileAccounts = async () => {
  return fetch(`${apiEndpoint}/profile/accounts?token=${auth.token()}`).then(response => response.json())
}

const giveTip = async ({recipientGuid, amount, message}) => {
  // post /tips
  const tipPayload = {
    recipient_guid: recipientGuid,
    amount: amount * 100,
    message,
  }

  const response = await fetch(
    `${apiEndpoint}/tips?token=${auth.token()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: qs.stringify(tipPayload)
    }
  )

  return response.json()
}

const setIncomingAccount = async ({accountId, bankId, iban}) => {
  const payload = {
    account_id: accountId,
    bank_id: bankId,
    iban,
  }

  const response = await fetch(
    `${apiEndpoint}/profile/incomingAccount?token=${auth.token()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: qs.stringify(payload)
    }
  )

  if (response.status < 200 || response.status >= 300) {
    return {error: response.statusText} 
  }

  return response.json()
}

const setOutgoingAccount = async ({accountId, bankId, iban}) => {
  const payload = {
    account_id: accountId,
    bank_id: bankId,
    iban,
  }

  const response = await fetch(
    `${apiEndpoint}/profile/outgoingAccount?token=${auth.token()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: qs.stringify(payload)
    }
  )

  if (response.status < 200 || response.status >= 300) {
    return {error: response.statusText} 
  }

  return response.json()
}

export {
  getUserInfoFromQrCodeValue,
  getBasicUserInfo,
  getProfileStats,
  getHistory,
  giveTip,
  getProfileAccounts,
  setIncomingAccount,
  setOutgoingAccount,
}
