/* eslint-disable unicorn/no-array-reduce */
import {Chart} from 'react-chartjs-2'
import PropTypes from 'prop-types'
import {Chart as ChartJS, registerables} from 'chart.js'
import {useMemo} from 'react'

ChartJS.register(...registerables)

const CreationCount = ({creationsResponse, interval}) => {
  const data = useMemo(() => {
    let labels = creationsResponse.map(({date}) => {
      const [year, month, day] = date.split('-')
      return (interval && interval > 20) ? `${month}/${year}` : `${day}/${month}/${year}`
    })

    if (interval) {
      labels = labels.filter((_data, index) => index % interval === 0)
    }

    const balCreations = creationsResponse
      .map(({date, createdBAL}) => {
        const [year, month, day] = date.split('-')

        return {
          date: `${day}/${month}/${year}`,
          value: Object.values(createdBAL).reduce((acc, creations) => {
            const {published, draft, demo, readyToPublish} = creations

            return {
              published: acc.published + published,
              draft: acc.draft + draft,
              demo: acc.demo + demo,
              readyToPublish: acc.readyToPublish + readyToPublish
            }
          }, {published: 0, draft: 0, demo: 0, readyToPublish: 0})
        }
      })

    const data = labels.reduce((acc, cur) => {
      acc.push({
        balsPublished: balCreations
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + value.published, 0),
        balsDraft: balCreations
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + value.draft, 0),
        balsReadyToPublish: balCreations
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + value.readyToPublish, 0),
        balsDemo: balCreations
          .filter(({date}) => date.includes(cur))
          .reduce((a, {value}) => a + value.demo, 0),
      })

      return acc
    }, [])

    return {
      labels,
      datasets: [
        {
          label: 'BAL créées en statut démo',
          data: data.map(({balsDemo}) => balsDemo),
          backgroundColor: '#9BD0F5',
        },
        {
          label: 'BAL créées en statut brouillon',
          data: data.map(({balsDraft}) => balsDraft),
          backgroundColor: '#72B8E9',
        },
        {
          label: 'BAL créées et prêtes à être publiées',
          data: data.map(({balsReadyToPublish}) => balsReadyToPublish),
          backgroundColor: '#4D9BD3',
        },
        {
          label: 'BAL créées et publiées',
          data: data.map(({balsPublished}) => balsPublished),
          backgroundColor: '#0B6CB0',
        },
      ]
    }
  }, [creationsResponse, interval])

  return (
    <Chart
      type='bar'
      data={data}
      options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Nombre de créations',
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

CreationCount.propTypes = {
  creationsResponse: PropTypes.array.isRequired,
  interval: PropTypes.number,
}

export default CreationCount
