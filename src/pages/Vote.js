import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { postMood } from '../moodClient'
import MOOD from '../mood'
import Toast from 'react-bootstrap/Toast'
import { dateOfDay } from '../service.js'

const uniqid = require('uniqid')
let id

if (window.localStorage.getItem('id') === null ) {
  id = uniqid(id);
  window.localStorage.setItem('id', id)
} else {
  id = window.localStorage.getItem('id')
}

const Options = ({ onSelect }) => (
  <div>
    {MOOD.options.map(o => (
      <button
        key={o.rate}
        className={`btn btn-xl m-2`}
        onClick={() => onSelect(o.rate)}
      >
        <img className={`emoji`} src={o.img}/>
      </button>
    ))}
  </div>
)

class Vote extends Component {

  state = {
    showToast: false
  }

  handleSelect = async moodId => {
    this.setState({showToast: true})
    const userMood = {
      session: id,
      day: dateOfDay,
      rate: moodId
    }
    console.log('userMood', userMood)
    await postMood(userMood)
  }

  render() {
    return (
      <div className="app">
        <header>
          <a href="https://github.com/yannickyvin/moodometer">sushimeter</a>
        </header>
        <div className="app-content">
          <p>{MOOD.question}</p>
          <Options onSelect={this.handleSelect} />
          <div className="toast-content">
            <Toast onClose={() => this.setState({showToast: false})} show={this.state.showToast} delay={1500} autohide>
              <Toast.Header>
                <strong className="mr-auto">{MOOD.toastHead}</strong>
              </Toast.Header>
              <Toast.Body>{MOOD.toastBody}</Toast.Body>
            </Toast>
          </div>
        </div>

        
        
        <footer>
          <Link to="/report">Rapport</Link>
        </footer>
      </div>
    )
  }
}

export default Vote
