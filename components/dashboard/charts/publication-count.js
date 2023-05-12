/* eslint-disable unicorn/no-array-reduce */
import {Chart} from 'react-chartjs-2'
import PropTypes from 'prop-types'
import {Chart as ChartJS, registerables} from 'chart.js'
import {useMemo} from 'react'

ChartJS.register(...registerables)

const PublicationCountChart = ({publicationsResponse, firstPublicationEvolutionResponse, interval}) => {
  const data = useMemo(() => {
    let labels = publicationsResponse.map(({date}) => {
      const [year, month, day] = date.split('-')
      return (interval && interval > 20) ? `${month}/${year}` : `${day}/${month}/${year}`
    })

    if (interval) {
      labels = labels.filter((_data, index) => index % interval === 0)
    }

    const newBALPublication = firstPublicationEvolutionResponse.map(({date, totalCreations, viaMesAdresses, viaMoissonneur}, index) => {
      const [year, month, day] = date.split('-')
      if (index === 0) {
        return {date: `${day}/${month}/${year}`, value: 0}
      }

      return {date: `${day}/${month}/${year}`, value: {
        total: totalCreations - firstPublicationEvolutionResponse[index - 1].totalCreations,
        viaMesAdresses: viaMesAdresses - firstPublicationEvolutionResponse[index - 1].viaMesAdresses,
        viaMoissonneur: viaMoissonneur - firstPublicationEvolutionResponse[index - 1].viaMoissonneur,
      }}
    })

    const allBALPublication = publicationsResponse
      .map(({date, publishedBAL}) => {
        const [year, month, day] = date.split('-')

        return {
          date: `${day}/${month}/${year}`,
          value: Object.values(publishedBAL).reduce((acc, publications) => {
            const {total, viaMesAdresses, viaMoissonneur} = publications

            return {
              total: acc.total + total,
              viaMesAdresses: acc.viaMesAdresses + viaMesAdresses,
              viaMoissonneur: acc.viaMoissonneur + viaMoissonneur
            }
          }, {total: 0, viaMesAdresses: 0, viaMoissonneur: 0})
        }
      })

    const data = labels.reduce((acc, cur) => {
      acc.push({
        allBALViaMesAdresses: allBALPublication
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + value.viaMesAdresses, 0),
        allBALViaMoissonneur: allBALPublication
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + value.viaMoissonneur, 0),
        allBALViaOther: allBALPublication
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + (value.total - (value.viaMesAdresses + value.viaMoissonneur)), 0),
        newBALViaMesAdresses: newBALPublication
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + value.viaMesAdresses, 0),
        newBALViaMoissonneur: newBALPublication
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + value.viaMoissonneur, 0),
        newBALViaOther: newBALPublication
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + (value.total - (value.viaMesAdresses + value.viaMoissonneur)), 0),
      })

      return acc
    }, [])

    return {
      labels,
      datasets: [
        {
          label: 'Nouvelles BAL publiées via un autre client',
          data: data.map(({newBALViaOther}) => newBALViaOther),
          backgroundColor: '#fbe2e6',
        },
        {
          label: 'Nouvelles BAL publiées via Moissonneur',
          data: data.map(({newBALViaMoissonneur}) => newBALViaMoissonneur),
          backgroundColor: '#F7C4CC',
        },
        {
          label: 'Nouvelles BAL publiées via Mes Adresses',
          data: data.map(({newBALViaMesAdresses}) => newBALViaMesAdresses),
          backgroundColor: '#EF9BA8',
        },
        {
          label: 'BAL re-publiées via un autre client',
          data: data.map(({allBALViaOther, newBALViaOther}) => allBALViaOther - newBALViaOther),
          backgroundColor: '#9BD0F5',
        },
        {
          label: 'BAL re-publiées via Moissonneur',
          data: data.map(({allBALViaMoissonneur, newBALViaMoissonneur}) => allBALViaMoissonneur - newBALViaMoissonneur),
          backgroundColor: '#72B8E9',
        },
        {
          label: 'BAL re-publiées via Mes Adresses',
          data: data.map(({allBALViaMesAdresses, newBALViaMesAdresses}) => allBALViaMesAdresses - newBALViaMesAdresses),
          backgroundColor: '#4D9BD3',
        },
      ]
    }
  }, [publicationsResponse, firstPublicationEvolutionResponse, interval])

  return (
    <Chart
      type='bar'
      data={data}
      options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Nombre de publications',
            font: {
              size: 18,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }}
    />
  )
}

PublicationCountChart.propTypes = {
  publicationsResponse: PropTypes.array.isRequired,
  firstPublicationEvolutionResponse: PropTypes.array.isRequired,
  interval: PropTypes.number,
}

export default PublicationCountChart
