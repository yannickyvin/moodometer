import React from 'react'
import PropTypes from 'prop-types'
import { Bar, Doughnut } from 'react-chartjs-2'
import { MOOD } from '../../config/config.js'

export const ReportContainer = ({ activate, label, children }) => {
  return (
    <>
      {activate &&
        (
          <>
            <div className='h-20 w-100 my-2'>
              {children}
            </div>
            <div className='d-flex justify-content-center'>
              <p className='font-weight-light'>{label}</p>
            </div>
          </>
        )}
    </>
  )
}

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

export const ReportTrendByDay = ({ reportDatas }) => {
  if ((!reportDatas) || (reportDatas.length === 0)) return null

  const data = {
    labels: reportDatas[0].datas.map(m => m.day),
    datasets: reportDatas.map(o => ({
      label: o.label,
      type: 'line',
      data: o.datas.map(c => (c.count)),
      fill: false,
      borderColor: o.color,
      backgroundColor: o.color
    }))
  }

  return <Bar data={data} options={optionsBar} height={200} />
}

ReportTrendByDay.propTypes = {
  reportDatas: PropTypes.array
}

export const ReportTrendByWeek = ({ reportDatas }) => {
  if ((!reportDatas) || (reportDatas.length === 0)) return null

  const data = {
    labels: reportDatas.map(element => ('S' + element.week)),
    datasets: [{
      label: 'Moyenne de la semaine',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: reportDatas.map(element => element.average)
    }]
  }

  return <Bar data={data} options={optionsBar} height={200} />
}

ReportTrendByWeek.propTypes = {
  reportDatas: PropTypes.array
}
