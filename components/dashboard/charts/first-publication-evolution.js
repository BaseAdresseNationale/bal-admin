import {Chart} from 'react-chartjs-2'
import PropTypes from 'prop-types'
import {Chart as ChartJS, registerables} from 'chart.js'
import {useMemo} from 'react'

ChartJS.register(...registerables)

const FirstPublicationEvolutionChart = ({firstPublicationEvolutionResponse}) => {
  const data = useMemo(() => ({
    labels: firstPublicationEvolutionResponse.map(({date}) => {
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    }),
    datasets: [
      {
        label: 'BAL publiées',
        data: firstPublicationEvolutionResponse.map(({totalCreations}) => totalCreations),
        borderColor: '#36A2EB',
        backgroundColor: '#9BD0F5',
      }
    ]
  }), [firstPublicationEvolutionResponse])

  return (
    <Chart
      type='line'
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Évolution du nombre de BAL publiées pour la première fois',
            font: {
              size: 18,
            },
          },
        },
      }}
    />
  )
}

FirstPublicationEvolutionChart.propTypes = {
  firstPublicationEvolutionResponse: PropTypes.array.isRequired,
}

export default FirstPublicationEvolutionChart
