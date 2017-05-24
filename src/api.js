import auth from './auth'

const apiEndpoint = process.env.REACT_APP_API
let mockPayments = [{
  id: 0, name: 'Czynsz za miesiąc kwiecień.', amount: 850.23
}, {
  id: 1, name: 'Faktura za telefon za miesiąc kwiecień', amount: 50
}]

const authorizedFetch = async (endpoint, options) => {
  const response = await fetch(
    endpoint,
    {
      headers: {
        'X-Authorization': auth.token()
      },
      ...options
    }
  )
  if (response.status < 200 || response.status >= 300) {
    return {error: response.statusText} 
  }

  return response.json()
}

const getBasicUserInfo = async (username) => {
  username && window.localStorage.setItem('username', username)

  if (!apiEndpoint) {
    const fromStorage = window.localStorage.getItem('username');
    return {
      name: username || (fromStorage === 'undefined' ? undefined : fromStorage) || 'bankITup',
      email: 'john@smith.com',
    }
  }
  
  return await authorizedFetch(`${apiEndpoint}/api/profile`)
}

const getPendingPayments = async () => {
  if (!apiEndpoint) {
    return mockPayments
  }
  
  return await authorizedFetch(`${apiEndpoint}/api/payments`)
}

const pay = async (id) => {
  if (!apiEndpoint) {
    mockPayments = mockPayments.filter(p => p.id !== id) 
    console.log(mockPayments)
    return
  }
  throw new Error('not implemented')
}

const login = async (username, password) => {
  if (!apiEndpoint) {
    return {token: 'asdf'}
  }

  const b = new FormData()
  b.append('username', username)
  b.append('password', password)

  const response = await fetch(
    `${apiEndpoint}/auth`,
    {
      method: 'POST',
      body: b
    }
  )

  if (response.status < 200 || response.status >= 300) {
    return {error: response.statusText} 
  }

  return response.json()
}

export {
  getBasicUserInfo,
  getPendingPayments,
  login,
  pay,
}
