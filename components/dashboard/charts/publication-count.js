import {Chart} from 'react-chartjs-2'
import PropTypes from 'prop-types'
import {Chart as ChartJS, registerables} from 'chart.js'
import {useMemo} from 'react'

ChartJS.register(...registerables)

const PublicationCountChart = ({publicationsResponse}) => {
  const data = useMemo(() => ({
    labels: publicationsResponse.map(({date}) => {
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    }),
    datasets: [
      {
        label: 'BAL publiées',
        data: publicationsResponse.map(({publishedBAL}) => Object.values(publishedBAL).reduce((acc, numPublications) => acc + numPublications, 0)),
        borderColor: '#36A2EB',
        backgroundColor: '#9BD0F5',
      }
    ]
  }), [publicationsResponse])

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
            text: 'Nombre de publications par jours',
            font: {
              size: 18,
            },
          },
        },
      }}
    />
  )
}

PublicationCountChart.propTypes = {
  publicationsResponse: PropTypes.array.isRequired,
}

export default PublicationCountChart
