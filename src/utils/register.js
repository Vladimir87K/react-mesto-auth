class Register {
  constructor(options) {
    this._urlBase = options.urlBase;
    this._headers = options.headers;
  }

  getRegistration(data) {
    console.log(data)
    return fetch(`https://auth.nomoreparties.co/signup`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "password": data.password,
        "email": data.email})
    })
    .then((response) => {
      console.log(response)
      try {
        if (response.status === 201){
          return response.json();
        }
      } 
      catch(e){
        return (e)
      }
    })
  }
  
  getAvtorization(data) {
    console.log(data)
    return fetch(`${this._urlBase}/signin`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "password": data.password,
        "email": data.email})
    })
    .then((response) => {
      try {
        if (response.status === 200){
          return response.json();
        }
      } catch(e){
        return (e)
      }
    })
  }

  getControl(JWT) {
    return fetch(`${this._urlBase}/users/me`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${JWT}`
    }    
    })
    .then((response) => {
      try {
        if (response.status === 200){
          return response.json();
        }
      } catch(e){
        return (e)
      }
    })
  }
}

const register = new Register({
  urlBase: 'https://auth.nomoreparties.co',
  headers: {
    "Content-Type": "application/json" 
  }
});

export default register;