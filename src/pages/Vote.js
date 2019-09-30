import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { postMood } from '../moodClient'
import MOOD from '../mood'
import { dateOfDay } from '../service.js'
import uniqid from 'uniqid'

let id

if (window.localStorage.getItem('id') === null ) {
  id = uniqid();
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

  handleSelect = async moodId => {
    const userMood = {
      session: id,
      day: dateOfDay,
      rate: moodId
    }
    console.log('userMood', userMood)
    await postMood(userMood)
    this.props.history.push('/report')
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
        </div>
        
        <footer>
          <Link to="/report">Rapport</Link>
        </footer>
      </div>
    )
  }
}

export default Vote
