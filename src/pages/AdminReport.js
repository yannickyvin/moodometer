import React, { Component } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { getTodayMoodsByTeams, getHistoryMoodsByTeams, getAllTeams } from '../services/moodClientService'
import { createTodayReport, createCompleteReport, createWeekReport, createCountVoteReport, createAverageAndCountVoteReport } from '../services/chartService'
import { LABELS, IS_ACTIVATED } from '../config/config'
import { ReportAddPlugin, ReportContainer, ReportAverageVote, ReportCountVote, ReportTrendByDay, ReportTrendByWeek, LastInformations } from '../components/Report/ChartReport'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ConnectedContext } from '../components/ConnectedContext'
import { AdminControl } from '../components/Admin/AdminControl'

class AdminReport extends Component {
  abortController = new AbortController()

  constructor (props) {
    super(props)
    this.handleChangeTeamsChecked = this.handleChangeTeamsChecked.bind(this)
    this.handleChangeMaxWeeks = this.handleChangeMaxWeeks.bind(this)
    this.handleGenerateReport = this.handleGenerateReport.bind(this)
  }

  state = {
    todayMoods: [],
    todayReport: [],
    historyLastWeeksMoods: [],
    completeReport: [],
    weekReport: [],
    averageAndCountVoteReport: [],
    teams: [],
    teamsChecked: [],
    maxWeeks: 3,
    maxWeeksOnValidate: 3,
    team: ''
  }

  static contextType = ConnectedContext

  componentDidMount () {
    this.initTeams()
    setInterval(this.refresh, 60000)
  }

  initTeams = async () => {
    const teams = await getAllTeams({ signal: this.abortController.signal })
    this.setState({ teams })
  }

  refresh = async () => {
    const todayMoods = await getTodayMoodsByTeams(this.state.teamsChecked, this.abortController.signal)
    const historyLastWeeksMoods = await getHistoryMoodsByTeams({ teams: this.state.teamsChecked, maxWeeks: this.state.maxWeeks }, this.abortController.signal)
    const historyAllMoods = await getHistoryMoodsByTeams({ teams: this.state.teamsChecked }, this.abortController.signal)

    const todayReport = createTodayReport(todayMoods)
    const completeReport = createCompleteReport(historyLastWeeksMoods)
    const weekReport = createWeekReport(historyAllMoods)
    const averageAndCountVoteReport = createAverageAndCountVoteReport(historyLastWeeksMoods)

    this.setState((prevState) => ({ todayMoods, historyLastWeeksMoods, todayReport, completeReport, weekReport, averageAndCountVoteReport, maxWeeksOnValidate: prevState.maxWeeks }))
  }

  handleChangeTeamsChecked (e) {
    const teamName = e.target.name
    const isChecked = e.target.checked
    const teams = this.state.teamsChecked
    if (isChecked) {
      teams.push(teamName)
      this.setState({ teamsChecked: [...teams] })
    } else {
      this.setState({ teamsChecked: teams.filter(team => team !== teamName) })
    }
  }

  handleChangeMaxWeeks (e) {
    this.setState({ maxWeeks: e.target.value })
  }

  handleGenerateReport (e) {
    if (this.state.teamsChecked.length > 0) {
      this.refresh()
    }
  }

  componentWillUnmount () {
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
                    <Form.Check inline key={team.nom} name={team.nom} label={team.nom} type='checkbox' id={team.nom} onChange={this.handleChangeTeamsChecked} />
                  ))}
                  <div className='d-flex flex-row justify-content-center align-items-center w-100 my-2'>
                    <Form.Label column sm='7'>Nombre de semaines : </Form.Label>
                    <Col sm='2'><Form.Control type='number' onChange={this.handleChangeMaxWeeks} defaultValue={this.state.maxWeeks} /></Col>
                  </div>
                  <div className='d-flex flex-row justify-content-center align-items-center w-100 my-2'>
                    <Button variant='primary' onClick={this.handleGenerateReport}>
                      Générer le rapport
                    </Button>
                  </div>
                </Form>
              </div>
              {
                (this.state.completeReport.length > 0) && (
                  <ReportAddPlugin>
                    <>
                      <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByAverageVoteReport(this.state.maxWeeksOnValidate)}>
                        <ReportAverageVote reportDatas={this.state.averageAndCountVoteReport} />
                      </ReportContainer>
                      <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByCountVoteReport(this.state.maxWeeksOnValidate)}>
                        <ReportCountVote reportDatas={this.state.averageAndCountVoteReport} />
                      </ReportContainer>
                      <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByDayReport(this.state.maxWeeksOnValidate)}>
                        <ReportTrendByDay reportDatas={this.state.completeReport} />
                      </ReportContainer>
                      <ReportContainer activate={IS_ACTIVATED.reportByWeek} label={LABELS.trendByWeekReport}>
                        <ReportTrendByWeek reportDatas={this.state.weekReport} />
                      </ReportContainer>
                      <ReportContainer activate={IS_ACTIVATED.reportLastInformations} label={LABELS.lastInformationReport(this.state.maxWeeksOnValidate)}>
                        <LastInformations moods={this.state.historyLastWeeksMoods} />
                      </ReportContainer>
                    </>
                  </ReportAddPlugin>
                )
              }
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

AdminReport.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

export default AdminReport
