import React, { Component } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { getTodayMoodsByTeams, getHistoryMoodsByTeams, getAllTeams } from '../services/moodClientService'
import { createTodayReport, createCompleteReport, createWeekReport, createAverageAndCountVoteReport } from '../services/chartService'
import { LABELS, IS_ACTIVATED } from '../config/config'
import { ReportAddPlugin, ReportContainer, ReportAverageVote, ReportCountVote, ReportTrendByDay, ReportTrendByWeek, LastInformations } from '../components/Report/ChartReport'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ConnectedContext } from '../components/ConnectedContext'
import { AdminControl } from '../components/Admin/AdminControl'

class AdminReport extends Component {

  constructor (props) {
    super(props)
    this.handleChangeTeamsChecked = this.handleChangeTeamsChecked.bind(this)
    this.handleChangemaxDays = this.handleChangemaxDays.bind(this)
    this.handleGenerateReport = this.handleGenerateReport.bind(this)
  }

  state = {
    todayMoods: [],
    todayReport: [],
    historyLastDaysMoods: [],
    completeReport: [],
    weekReport: [],
    averageAndCountVoteReport: [],
    teams: [],
    teamsChecked: [],
    maxDays: 3,
    maxDaysOnValidate: 3,
    team: ''
  }

  static contextType = ConnectedContext

  componentDidMount () {
    this.initTeams()
    setInterval(this.refresh, 60000)
  }

  initTeams = async () => {
    const teams = await getAllTeams()
    this.setState({ teams })
  }

  refresh = async () => {
    const todayMoods = await getTodayMoodsByTeams(this.state.teamsChecked)
    const historyLastDaysMoods = await getHistoryMoodsByTeams({ teams: this.state.teamsChecked, maxDays: this.state.maxDays })
    const historyAllMoods = await getHistoryMoodsByTeams({ teams: this.state.teamsChecked })

    const todayReport = createTodayReport(todayMoods)
    const completeReport = createCompleteReport(historyLastDaysMoods)
    const weekReport = createWeekReport(historyAllMoods)
    const averageAndCountVoteReport = createAverageAndCountVoteReport(historyLastDaysMoods)

    this.setState((prevState) => ({ todayMoods, historyLastDaysMoods, todayReport, completeReport, weekReport, averageAndCountVoteReport, maxDaysOnValidate: prevState.maxDays }))
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

  handleChangemaxDays (e) {
    this.setState({ maxDays: e.target.value })
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
                    <Form.Label column sm='7'>Nombre de jours : </Form.Label>
                    <Col sm='2'><Form.Control type='number' onChange={this.handleChangemaxDays} defaultValue={this.state.maxDays} /></Col>
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
                      <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByAverageVoteReport}>
                        <ReportAverageVote reportDatas={this.state.averageAndCountVoteReport} showAllTooltips />
                      </ReportContainer>
                      <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByCountVoteReport}>
                        <ReportCountVote reportDatas={this.state.averageAndCountVoteReport} showAllTooltips />
                      </ReportContainer>
                      <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByDayReport}>
                        <ReportTrendByDay reportDatas={this.state.completeReport} />
                      </ReportContainer>
                      <ReportContainer activate={IS_ACTIVATED.reportByWeek} label={LABELS.trendByWeekReport}>
                        <ReportTrendByWeek reportDatas={this.state.weekReport} showAllTooltips />
                      </ReportContainer>
                      <ReportContainer activate={IS_ACTIVATED.reportLastInformations} label={LABELS.lastInformationReport(this.state.maxDaysOnValidate)}>
                        <LastInformations moods={this.state.historyLastDaysMoods} />
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
