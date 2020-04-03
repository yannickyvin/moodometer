import React, { Component } from 'react'
import TwitterLogin from 'react-twitter-auth'
import FacebookLogin from 'react-facebook-login'
import { GoogleLogin } from 'react-google-login'
import { GOOGLE_CLIENT_ID } from '../config/config'

class Home extends Component {
  constructor () {
    super()
    this.state = { isAuthenticated: false, user: null, token: '' }
  }

  handleLogout = () => {
    console.log('lougout')
    this.setState({ isAuthenticated: false, token: '', user: null })
  }

  handleTwitterResponse = (e) => {}

  handleFacebookResponse = (e) => {}

  handleGoogleResponse = (response) => {
    // eslint-disable-next-line no-undef
    const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' })
    const options = {
      method: 'POST',
      body: tokenBlob,
      mode: 'cors',
      cache: 'default'
    }
    // eslint-disable-next-line no-undef
    fetch(process.env.REACT_APP_API_URL + '/authent/google', options).then(r => {
      const token = r.headers.get('x-auth-token')
      console.log('r', r)

      r.json().then(user => {
        console.log('user', user)
        if (token) {
          console.log('token2', token)
          this.setState({ isAuthenticated: true, user, token })
        }
      })
    })
  };

  handleOnFailure = (error) => {
    window.alert(error)
  }

  render () {
    const content = this.state.isAuthenticated
      ? (
        <div>
          <p>Authenticated</p>
          <div>
            {this.state.user.email}
          </div>
          <div>
            <button onClick={this.handleLogout} className='button'>
              Log out
            </button>
          </div>
        </div>
      )
      : (
        <div>
          <TwitterLogin
            loginUrl='http://localhost:4000/api/v1/auth/twitter'
            onFailure={this.handleTwitterResponse} onSuccess={this.handleTwitterResponse}
            requestTokenUrl='http://localhost:4000/api/v1/auth/twitter/reverse'
          />
          <FacebookLogin
            appId='XXXXXXXXXX'
            autoLoad={false}
            fields='name,email,picture'
            callback={this.facebookResponse}
          />
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText='Se Connecter'
            onSuccess={this.handleGoogleResponse}
            onFailure={this.handleOnFailure}
            isSignedIn
          />
        </div>
      )

    return (
      <>
        <header className='home-header'>
          <a className='header-link' href=''>OpenMyMood</a>
          <a className='header-link' href=''>Se connecter</a>
          <a className='header-link' href=''>Créer un compte</a>
          <div>{content}</div>
        </header>
        <div className='home-content'>
          <div className='home-content-item-text  home-bloc-1'>
            <h2>OpenMyMood, c'est quoi ?</h2>
            <p>
              <img className='home-paragraph-icon' src='insert_emoticon-24px.svg' />  OpenMyMood est un outil gratuit qui te permet de mesurer et de restituer les humeurs de ton équipe.
            </p>
            <p>
              <img className='home-paragraph-icon' src='how_to_vote-24px.svg' /> Pour les membres de l'équipe, c'est simple : vote en un click. Pas d'inscription, pas de connexion.
            </p>
          </div>
          <div className='home-content-item-image  home-bloc-2' style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
            <img className='block img-fluid align-middle' width='450px' src='moodmobile2.png' alt='smiley image' />
          </div>
          <div className='home-content-item-image home-bloc-3' style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
            <img className='img-fluid' width='250px' src='group.svg' alt='smiley image' />
          </div>
          <div className='home-content-item-text home-bloc-4 text-justify'>
            <h2>A qui ça s'adresse ?</h2>
            <p className='description'>
              <img className='home-paragraph-icon' src='group-24px.svg' /> Manager, ressources humaines, développeur, membre d'équipe ou non professionnel. Ça s'adresse à tout le monde. Si tu souhaites suivre l'humeur d'une équipe, son évolution, les compléments sous formes de commentaires, OpenMyMood répondra à ton besoin.
            </p>
          </div>
          <div className='home-content-item-text home-bloc-5 text-justify'>
            <h2>Il y a un suivi des humeurs ?</h2>
            <p className='description'>
              <img className='home-paragraph-icon' src='timeline-24px.svg' /> Oui, des rapports sont générés. Ils sont visibles par toute l'équipe.
              Rapport quotidien. Evolution hebdomadaire de l'humeur. Synthèses des commentaires des dernières semaines.
            </p>
          </div>
          <div className='home-content-item-image home-bloc-6'>
            <img className='img-fluid' width='250px' src='presentation.svg' alt='smiley image' />
          </div>
          <div className='home-content-item-image home-bloc-7'>
            <img className='img-fluid' width='250px' src='create.svg' alt='smiley image' />
          </div>
          <div className='home-content-item-text text-justify home-bloc-8'>
            <h2>Comment je créé un baromètre pour mon équipe ?</h2>
            <p className='description'>
              <img className='home-paragraph-icon' src='face-24px.svg' /> Tu te connectes avec ton réseau social préféré, tu saisis ton nom d'équipe et tu envoies le lien généré à ses membres. C'est parti !
            </p>
          </div>
          <div className='home-content-item-text text-justify home-bloc-9'>
            <h2>Combien ça coute ?</h2>
            <p className='description'>
              <img className='home-paragraph-icon' src='money_off-24px.svg' />  C'est un outil gratuit et open source. Si tu veux utiliser la version online, tu peux ! Si tu veux récupérer les sources et les déployer chez toi, tu peux aussi. Les sources sont sur <a href='https://github.com/yannickyvin/moodometer'> github </a>
            </p>
          </div>
          <div className='home-content-item-image home-bloc-10'>
            <img className='img-fluid' width='250px' src='cancel.svg' alt='smiley image' />
          </div>
        </div>
      </>
    )
  }
}

export default Home
