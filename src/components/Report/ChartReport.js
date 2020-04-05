import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Chart, Bar, Doughnut } from 'react-chartjs-2'
import { MOOD } from '../../config/config.js'

export const ReportAddPlugin = ({ children }) => {
  useEffect(() => {
    // Add showAllToolTips options
    Chart.pluginService.register({
      beforeRender: function (chart) {
        if (chart.config.options.showAllTooltips) {
          // create an array of tooltips
          // we can't use the chart tooltip because there is only one tooltip per chart
          chart.pluginTooltips = []
          chart.config.data.datasets.forEach(function (dataset, i) {
            chart.getDatasetMeta(i).data.forEach(function (sector, j) {
              chart.pluginTooltips.push(new Chart.Tooltip({
                _chart: chart.chart,
                _chartInstance: chart,
                _data: chart.data,
                _options: chart.options.tooltips,
                _active: [sector]
              }, chart))
            })
          })

          // turn off normal tooltips
          chart.options.tooltips.enabled = false
        }
      },
      afterDraw: function (chart, easing) {
        if (chart.config.options.showAllTooltips) {
          // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
          if (!chart.allTooltipsOnce) {
            if (easing !== 1) { return }
            chart.allTooltipsOnce = true
          }

          // turn on tooltips
          chart.options.tooltips.enabled = true
          Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
            tooltip.initialize()
            tooltip.update()
            // we don't actually need this since we are not animating tooltips
            tooltip.pivot()
            tooltip.transition(easing).draw()
          })
          chart.options.tooltips.enabled = false
        }
      }
    })

    Chart.Tooltip.positioners.center = function (elements) {
      const { x, y, base, width } = elements[0]._model
      const height = base - y
      return { x: x + (width / 2), y: y + (height / 2) }
    }
  }, [])

  return (<>{children}</>)
}

ReportAddPlugin.propTypes = {
  children: PropTypes.element.isRequired
}

export const ReportContainer = ({ activate, label, children }) => (
  <>
    {activate &&
        (
          <div className='d-flex flex-column w-100'>
            <hr />
            <div className='h-20 w-100 mt-4 mb-4'>
              {children}
            </div>
            <div className='d-flex justify-content-center'>
              <p className='font-weight-light'>{label}</p>
            </div>
          </div>
        )}
  </>
)

ReportContainer.propTypes = {
  activate: PropTypes.bool,
  label: PropTypes.string,
  children: PropTypes.element.isRequired
}

export const ReportToday = ({ reportDatas }) => (
  <Doughnut
    options={{ maintainAspectRatio: false, legend: false, rotation: 1.57 }}
    data={{
      labels: reportDatas.map(o => o.label),
      datasets: [
        {
          data: reportDatas.map(o => o.count),
          backgroundColor: reportDatas.map(o => o.color)
        }
      ]
    }}
  />
)

ReportToday.propTypes = {
  reportDatas: PropTypes.array
}

const Information = ({ information, color }) => (<span className='badgemood m-1' style={{ backgroundColor: color }}>{information}</span>)

Information.propTypes = {
  information: PropTypes.string,
  color: PropTypes.string
}

const getColorFromRate = (rate) => MOOD.options.find((option) => option.rate === rate).color

export const DailyInformations = ({ moods }) => {
  return (
    <div className='d-flex flex-row flex-wrap my-3'>
      {moods.map((mood) => {
        return (mood.information !== undefined && mood.information !== null && mood.information.length > 0 &&
          <Information key={mood.session} information={mood.information} color={getColorFromRate(mood.rate)} />)
      })}
    </div>
  )
}

DailyInformations.propTypes = {
  moods: PropTypes.array
}

export const LastInformations = ({ moods }) => {
  return (
    <div className='d-flex flex-column flex-wrap my-3'>
      {MOOD.options.map((option) => {
        return (
          <div key={option.rate} className='d-flex flex-row flex-wrap my-1'>
            {moods.map((mood) => {
              return (mood.information !== undefined && mood.information !== null && mood.information.length > 0 && mood.rate === option.rate &&
                <Information key={mood.session + mood.day} information={mood.information} color={getColorFromRate(mood.rate)} />)
            })}
          </div>
        )
      })}
    </div>
  )
}

LastInformations.propTypes = {
  moods: PropTypes.array
}

const optionsBar = {
  maintainAspectRatio: false,
  legend: false,
  scales: {
    xAxes: [{
      display: true,
      gridLines: {
        color: 'rgb(255, 255, 255, 0.2)'
      },
      ticks: {
        fontColor: 'white'
      }
    }],
    yAxes: [{
      display: true,
      gridLines: {
        color: 'rgb(255, 255, 255, 0.2)'
      },
      ticks: {
        fontColor: 'white',
        beginAtZero: true
      }
    }]
  }
}

export const ReportTrendByDay = ({ reportDatas, showAllTooltips }) => {
  if ((!reportDatas) || (reportDatas.length === 0)) return null

  let optionsSumVotes

  if (showAllTooltips) {
    optionsSumVotes = {
      ...optionsBar,
      tooltips: {
        position: 'center',
        xAlign: 'left',
        filter: function (tooltipItem, data) {
          if (tooltipItem.value == 0) {
            return false
          } else {
            return true
          }
        },
        displayColors: false,
        callbacks: {
          title: () => null,
          label: (tooltipItem) => {
            return tooltipItem.value
          }
        }
      },
      showAllTooltips: true
    }
  } else {
    optionsSumVotes = optionsBar
  }

  optionsSumVotes.scales.yAxes[0].ticks.callback = function (value) { if (Number.isInteger(value)) { return value } }

  const data = {
    type: 'bar',
    labels: reportDatas[0].datas.map(m => m.day),
    datasets: reportDatas.map(o => ({
      stack: 'stack',
      label: o.label,
      data: o.datas.map(c => (c.count)),
      borderColor: o.color,
      backgroundColor: o.color
    }))
  }

  return <Bar data={data} options={optionsSumVotes} height={200} />
}

ReportTrendByDay.propTypes = {
  reportDatas: PropTypes.array,
  showAllTooltips: PropTypes.bool
}

const optionsBarShowAllTooltips = {
  ...optionsBar,
  tooltips: {
    yAlign: 'top',
    xAlign: 'center',
    displayColors: false,
    callbacks: {
      title: () => null,
      label: (tooltipItem) => {
        return tooltipItem.value
      }
    }
  },
  showAllTooltips: true
}

export const ReportAverageVote = ({ reportDatas, showAllTooltips }) => {
  if ((!reportDatas) || (reportDatas.length === 0)) return null

  let optionsAverageBar
  if (showAllTooltips) {
    optionsAverageBar = optionsBarShowAllTooltips
  } else {
    optionsAverageBar = optionsBar
  }

  const data = {
    labels: reportDatas.map(m => m.day),
    datasets: [{
      label: 'Moyenne',
      type: 'line',
      fill: false,
      steppedLine: false,
      backgroundColor: 'rgb(15, 123, 255)',
      borderColor: 'rgb(15, 123, 255)',
      data: reportDatas.map(element => element.average)
    }]
  }

  return <Bar data={data} options={optionsAverageBar} height={200} />
}

ReportAverageVote.propTypes = {
  reportDatas: PropTypes.array,
  showAllTooltips: PropTypes.bool
}

export const ReportCountVote = ({ reportDatas, showAllTooltips }) => {
  if ((!reportDatas) || (reportDatas.length === 0)) return null

  let optionsCountBar
  if (showAllTooltips) {
    optionsCountBar = {
      ...optionsBar,
      tooltips: {
        yAlign: 'top',
        xAlign: 'center',
        displayColors: false,
        callbacks: {
          title: () => null,
          label: (tooltipItem) => {
            return tooltipItem.value
          }
        }
      },
      showAllTooltips: true
    }
  } else {
    optionsCountBar = optionsBar
  }

  optionsCountBar.scales.yAxes[0].ticks.callback = function (value) { if (Number.isInteger(value)) { return value } }

  const data = {
    labels: reportDatas.map(m => m.day),
    datasets: [{
      label: 'Votes',
      type: 'line',
      fill: false,
      steppedLine: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: reportDatas.map(element => element.count)
    }]
  }

  return <Bar data={data} options={optionsCountBar} height={200} />
}

ReportCountVote.propTypes = {
  reportDatas: PropTypes.array,
  showAllTooltips: PropTypes.bool
}

export const ReportTrendByWeek = ({ reportDatas, showAllTooltips }) => {
  if ((!reportDatas) || (reportDatas.length === 0)) return null

  let optionsAverageByWeekBar
  if (showAllTooltips) {
    optionsAverageByWeekBar = optionsBarShowAllTooltips
  } else {
    optionsAverageByWeekBar = optionsBar
  }

  const data = {
    labels: reportDatas.map(element => ('S' + element.week)),
    datasets: [{
      label: 'Moyenne de la semaine',
      type: 'line',
      fill: false,
      steppedLine: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: reportDatas.map(element => element.average)
    }]
  }

  return <Bar data={data} options={optionsAverageByWeekBar} height={200} />
}

ReportTrendByWeek.propTypes = {
  reportDatas: PropTypes.array,
  showAllTooltips: PropTypes.bool
}
