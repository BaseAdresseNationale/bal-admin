import {Chart} from 'react-chartjs-2'
import PropTypes from 'prop-types'
import {Chart as ChartJS, registerables} from 'chart.js'
import {useMemo} from 'react'

ChartJS.register(...registerables)

const FirstPublicationEvolutionChart = ({firstPublicationEvolutionResponse, interval}) => {
  const data = useMemo(() => {
    let responseData = firstPublicationEvolutionResponse
    if (interval) {
      responseData = firstPublicationEvolutionResponse.reduce((acc, cur, index) => {
        const curMonth = cur.date.split('-')[1]
        const isLastOfMonth = index === firstPublicationEvolutionResponse.length - 1 || firstPublicationEvolutionResponse[index + 1].date.split('-')[1] !== curMonth
        
        return isLastOfMonth ? [...acc, cur] : acc
      }, [])
    }

    const labels = responseData.map(({date}) => {
      const [year, month, day] = date.split('-')
      return (interval && interval > 20) ? `${month}/${year}` : `${day}/${month}/${year}`
    })

    return {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Cumul BAL publiées',
          data: responseData.map(({totalCreations}) => totalCreations),
          borderColor: '#36A2EB',
          backgroundColor: '#9BD0F5',
          yAxisID: 'y1',
        },
        {
          type: 'bar',
          label: 'BAL publiées',
          data: responseData
            .map(({totalCreations}, index) => {
              if (index === 0) {
                return 0
              }

              return totalCreations - responseData[index - 1].totalCreations
            }),
          borderColor: '#f4a4b3',
          backgroundColor: '#fbe2e6',
          yAxisID: 'y2',
        }
      ]
    }
  }, [firstPublicationEvolutionResponse, interval])

  return (
    <Chart
      data={data}
      options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Évolution du nombre de BAL publiées pour la première fois',
            font: {
              size: 18,
            },
          },
        },
        scales: {
          y1: {
            type: 'linear',
            position: 'left'
          },
          y2: {
            type: 'linear',
            position: 'right',
          },
          x: {}
        }
      }}
    />
  )
}

FirstPublicationEvolutionChart.propTypes = {
  firstPublicationEvolutionResponse: PropTypes.array.isRequired,
  interval: PropTypes.number,
}

export default FirstPublicationEvolutionChart
