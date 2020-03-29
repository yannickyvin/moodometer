import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { getTodayMoodsByTeams, getHistoryMoodsByTeams, getAllTeams } from '../services/moodClientService'
import { createTodayReport, createCompleteReport, createWeekReport } from '../services/chartService'
import { LABELS, IS_ACTIVATED } from '../config/config'
import { ReportContainer, ReportToday, ReportTrendByDay, ReportTrendByWeek, LastInformations } from '../components/Report/ChartReport'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ConnectedContext } from '../components/ConnectedContext'
import { AdminControl } from '../components/Admin/AdminControl'

class AdminReport extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleGenerateReport = this.handleGenerateReport.bind(this)
  }

  propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
  }

  state = {
    todayMoods: [],
    todayReport: [],
    historyLastWeeksMoods: [],
    completeReport: [],
    weekReport: [],
    teams: [],
    teamsChecked: [],
    team: ''
  }

  static contextType = ConnectedContext

  componentDidMount () {
    this.refresh()
    this.initTeams()
    setInterval(this.refresh, 60000)
  }

  initTeams = async () => {
    const teams = await getAllTeams()
    this.setState({ teams })
  }

  refresh = async () => {
    const todayMoods = await getTodayMoodsByTeams(this.state.teamsChecked)
    const historyLastWeeksMoods = await getHistoryMoodsByTeams({ teams: this.state.teamsChecked, maxWeeks: 50 })
    const historyAllMoods = await getHistoryMoodsByTeams({ teams: this.state.teamsChecked })

    const todayReport = createTodayReport(todayMoods)
    const completeReport = createCompleteReport(historyLastWeeksMoods)
    const weekReport = createWeekReport(historyAllMoods)

    this.setState({ todayMoods, historyLastWeeksMoods, todayReport, completeReport, weekReport })
  }

  handleChange (e) {
    const teamName = e.target.name
    console.log('label', teamName)
    const isChecked = e.target.checked
    const teams = this.state.teamsChecked
    console.log(teams)
    if (isChecked) {
      teams.push(teamName)
      this.setState({ teamsChecked: [...teams] })
    } else {
      this.setState({ teamsChecked: teams.filter(team => team !== teamName) })
    }
  }

  handleGenerateReport (e) {
    this.refresh()
  }

  render () {
    return (
      <Layout>
        {this.context.isConnected ? (
          <div className='app d-flex flex-column space-between align-items-center h-200'>
            <Header team={this.state.team} />
            <div className='d-flex flex-column justify-content-center align-items-center w-100'>
              <div>
                <Form>
                  {this.state.teams.map((team) => (
                    <Form.Check inline key={team.nom} name={team.nom} label={team.nom} type='checkbox' id={team.nom} onChange={this.handleChange} />
                  ))}
                  <div className='d-flex flex-row justify-content-center align-items-center w-100 my-2'>
                    <Button variant='primary' onClick={this.handleGenerateReport}>
                      Générer le rapport
                    </Button>
                  </div>
                </Form>
              </div>
              <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByDayReport}>
                <ReportTrendByDay reportDatas={this.state.completeReport} />
              </ReportContainer>

              <ReportContainer activate={IS_ACTIVATED.reportByWeek} label={LABELS.trendByWeekReport}>
                <ReportTrendByWeek reportDatas={this.state.weekReport} />
              </ReportContainer>

              <ReportContainer activate={IS_ACTIVATED.reportLastInformations} label={LABELS.lastInformationReport}>
                <LastInformations moods={this.state.historyLastWeeksMoods} />
              </ReportContainer>
            </div>

            <Footer link='/' libelle='Home' search={this.props.location.search} />
          </div>
        ) : (
          <div className='app h-100 d-flex flex-column align-items-center justify-content-around'>
            <header>
              <div className='header' onClick={() => this.props.history.goBack()}>Retour</div>
            </header>
            <ConnectedContext.Consumer>
              {({ handleCheckControl }) => (
                <AdminControl onInputChange={handleCheckControl} />
              )}
            </ConnectedContext.Consumer>
            <Footer link='/' libelle='Home' search='/' />
          </div>
        )}
      </Layout>

    )
  }
}

export default AdminReport
