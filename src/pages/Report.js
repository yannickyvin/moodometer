import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Bar, Doughnut } from 'react-chartjs-2'
import { getTodayMoods, getHistory } from '../moodClient'
import MOOD from '../mood'

const Today = ({ report }) => (
  <Doughnut
    options={{ maintainAspectRatio: false, legend: false, rotation: 1.57 }}
    data={{
      labels: report.map(o => o.label),
      datasets: [
        {
          data: report.map(o => o.count),
          backgroundColor: report.map(o => o.color),
        },
      ],
    }}
  />
)

const Trend = ({ history }) => {
  if (!history) return null

  const data = {
    labels: history.map(m => m.date),
    datasets: MOOD.options.map(o => ({
      label: o.label,
      type: 'line',
      data: history.map(m => m[o.id]),
      fill: false,
      borderColor: o.color,
      backgroundColor: o.color,
    })),
  }

  const options = {
    maintainAspectRatio: false,
    legend: false,
    scales: {
      yAxes: [
        {
          // stacked: true,
        },
      ],
    },
  }

  return <Bar data={data} options={options} height={200} />
}

class App extends Component {
  state = {
    history: null,
    todayMood: null,
    dayReport: [],
    completeReport: [],
  }

  componentDidMount() {
    this.refresh()
    setInterval(this.refresh, 60000)
  }

  refresh = async () => {
    const todayMood = await getTodayMoods()
    const history = await getHistory()
    const dayReport = this.createDayReport(todayMood);
    const completeReport = this.createCompleteReport(history);
    this.setState({ todayMood, history, dayReport, completeReport })
  }

  createDayReport = (moods) => {
    let dayReport = [...MOOD.options];
    dayReport = dayReport.map((option) => ({...option, count: 0}))
    if (moods !== null && moods.length !== undefined) {
      moods.forEach((mood) => {
        for (let i = 0; i < dayReport.length; i++) {
          if (dayReport[i].rate === mood.rate) {dayReport[i].count += 1}
        }
      })
    }
    console.log(dayReport)
    return dayReport;
  }

  createCompleteReport = (moods) => {
    let dayReport = [...MOOD.options];
    dayReport = dayReport.map((option) => ({...option, count: 0}))
    if (moods !== null && moods.length !== undefined) {
      moods.forEach((mood) => {
        for (let i = 0; i < dayReport.length; i++) {
          if (dayReport[i].rate === mood.rate) {dayReport[i].count += 1}
        }
      })
    }
    console.log(dayReport)
    return dayReport;
  }

  render() {
    return (
      <div className="app">
        <header>
          <a href="https://github.com/yannickyvin/moodometer">sushimeter</a>
        </header>
        <div className="app-content">
          <div>
            <Today report={this.state.dayReport} />
          </div>
          <p className="font-weight-light text-muted">Aujourd'hui</p>
          <div className="h-50">
            <Trend history={this.state.history} />
          </div>
        </div>
        <footer>
          <Link to="/vote">Home</Link>
        </footer>
      </div>
    )
  }
}

export default App
