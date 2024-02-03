export default httpClient => ({
  register: async({ name, email, password }) => {
    const response = await httpClient.post('/auth/register', {
      name,
      email,
      password,
    })
    let errors = null

    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      errors,
      data: response.data,
    }
  },

  login: async({ email, password }) => {
    const response = await httpClient.post('/auth/login', {
      email,
      password,
    })
    let errors = null

    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      errors,
      data: response.data,
    }
  },
})
