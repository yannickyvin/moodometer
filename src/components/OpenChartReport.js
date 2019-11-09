import React from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'


export const ReportToday = ({ dayReport }) => (
  <Doughnut
    options={{ maintainAspectRatio: false, legend: false, rotation: 1.57 }}
    data={{
      labels: dayReport.map(o => o.label),
      datasets: [
        {
          data: dayReport.map(o => o.count),
          backgroundColor: dayReport.map(o => o.color),
        },
      ],
    }}
  />
)

export const ReportTrendByDay = ({ completeReport }) => {
  if ((!completeReport) || (completeReport.length === 0))  return null

  const data = {
    labels: completeReport[0].datas.map(m => m.day),
    datasets: completeReport.map(o => ({
      label: o.label,
      type: 'line',
      data: o.datas.map(c => (c.count)),
      fill: false,
      borderColor: o.color,
      backgroundColor: o.color,
    })),
  }

  const options = {
    maintainAspectRatio: false,
    legend: false
  }

  return <Bar data={data} options={options} height={200} />
}

export const ReportTrendByWeek = ({ weekReport }) => {
  if ((!weekReport) || (weekReport.length === 0))  return null

  const data = {
    labels: weekReport.map(m => ('S' + m[0])),
    datasets: [{
      label: 'Moyenne de la semaine',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: weekReport.map(m => m[1].average)
    }],  
  }

  const options = {
    maintainAspectRatio: false,
    legend: false
  }

  return <Bar data={data} options={options} height={200} />
}