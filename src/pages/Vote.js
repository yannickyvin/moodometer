import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import { dateOfDay } from '../service'
import uniqid from 'uniqid'
import queryString from 'query-string'
import Picker from 'emoji-picker-react'
import { MOOD, LABELS, IS_ACTIVATED } from '../config/config'
import { postMood, getTeamName } from '../moodClient'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'

let id

if (window.localStorage.getItem('id') === null) {
  id = uniqid()
  window.localStorage.setItem('id', id)
} else {
  id = window.localStorage.getItem('id')
}

const Options = ({ onSelect }) => (
  <div className='d-flex flex-wrap justify-content-center align-items-center'>
    {MOOD.options.map(o => (
      <button
        key={o.rate}
        className='btn btn-xl'
        onClick={() => onSelect(o.rate)}
      >
        <img className='emoji' src={o.img} alt={o.img} />
      </button>
    ))}
  </div>
)

Options.propTypes = {
  onSelect: PropTypes.func
}

const InputFormMood = ({ onInputChange, onEmojiClick, inputInformation }) => {
  const [backgroundInput, setBackgroundInput] = useState('#fff')
  const [border, setBorder] = useState('1')
  const [isEmojiPicker, setIsEmojiPicker] = useState(false)

  const handleChangeInput = (event) => {
    if (event.target.value.length > 2) {
      setBackgroundInput('#eee')
      setBorder('0')
    } else {
      setBackgroundInput('#fff')
      setBorder('1')
    }
    onInputChange(event)
  }

  const handleEmojiClick = (event, emojiObject) => {
    onEmojiClick(event, emojiObject.emoji)
  }

  const handleEmojiPicker = () => {
    setIsEmojiPicker(!isEmojiPicker)
  }

  return (
    <>
      <div className='form-group my-4'>
        <div className='d-flex flex-wrap form justify-content-center align-items-center'>
          <span id='wordhelp' className='inputlabelinformation px-1 my-2 form-text text-muted italic'>
            <u>{LABELS.informationUnderline}</u>{LABELS.informationNext}
          </span>
          <img src='right-arrow.svg' className='arrow mx-1' alt='arrow' />
          <input className='inputinformation mx-2 px-3' aria-describedby='wordhelp' maxLength='60' onChange={handleChangeInput} style={{ backgroundColor: backgroundInput, border: border }} value={inputInformation} />
          <img onClick={handleEmojiPicker} className='emoji-switcher' src='emoji.png' />
        </div>
        <div className={(isEmojiPicker ? 'emoji-pick-visible' : 'emoji-pick-hidden')}>
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      </div>
    </>
  )
}

InputFormMood.propTypes = {
  onInputChange: PropTypes.func,
  onEmojiClick: PropTypes.func,
  inputInformation: PropTypes.string
}

class Vote extends Component {
  propTypes = {
    history: PropTypes.object,
    location: PropTypes.object
  }

  state = {
    team: '',
    information: ''
  }

  componentDidMount = () => {
    this.refresh()
  }

  refresh = async () => {
    const parsed = queryString.parse(this.props.location.search)
    if (parsed.team === undefined) {
      this.setState({ team: MOOD.defaultTeam })
    } else {
      const teamName = await getTeamName(parsed.team)
      this.setState({ team: teamName === undefined ? MOOD.defaultTeam : teamName })
    }
  }

  handleSelect = async moodId => {
    const userMood = {
      session: id,
      day: dateOfDay('YYYY-MM-DD'),
      rate: moodId,
      team: this.state.team,
      information: this.state.information
    }
    await postMood(userMood)
    this.props.history.push(`/report${this.props.location.search}`)
  }

  handleInputChange = (event) => {
    this.setState({ information: event.target.value })
  }

  handleEmojiClick = (event, emoji) => {
    console.log('handleEmojiClick', emoji)
    this.setState({ information: this.state.information + emoji })
  }

  render () {
    return (
      <Layout>
        <div className='app h-100 d-flex flex-column align-items-center justify-content-between'>
          <Header team={this.state.team} />
          <div className='d-flex flex-column flex-wrap justify-content-center h-100'>
            <p className='text-center'>{LABELS.question}</p>
            <Options onSelect={this.handleSelect} />
            {IS_ACTIVATED.information && <InputFormMood onInputChange={this.handleInputChange} onEmojiClick={this.handleEmojiClick} inputInformation={this.state.information} />}
          </div>

          <Footer link='/report' libelle='Rapport' search={this.props.location.search} />
        </div>
      </Layout>

    )
  }
}

export default Vote
