import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { postMood } from '../moodClient'
import MOOD from '../mood'
import { dateOfDay } from '../service.js'
import uniqid from 'uniqid'
import queryString from 'query-string'

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

  state = {
    team: MOOD.defaultTeam
  }

  componentDidMount = () => {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({team : parsed.team === undefined ? MOOD.defaultTeam : parsed.team})
  }

  handleSelect = async moodId => {
    const userMood = {
      session: id,
      day: dateOfDay(),
      rate: moodId,
      team: this.state.team
    }
    await postMood(userMood)
    this.props.history.push(`/report${this.props.location.search}`)
  }

  render() {
    return (
      <div className="app">
        <header>
          <a href="https://github.com/yannickyvin/moodometer">moodometer</a>
        </header>
        <p className="font-weight-light text-muted italic">Equipe : {this.state.team}</p>
        <div className="app-content">
          <p>{MOOD.question}</p>
          <Options onSelect={this.handleSelect} />
        </div>
        
        <footer>
          <Link to={"/report" + this.props.location.search}>Rapport</Link>
        </footer>
      </div>
    )
  }
}

export default Vote
