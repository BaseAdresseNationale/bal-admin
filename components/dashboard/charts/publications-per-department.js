import {Chart} from 'react-chartjs-2'
import PropTypes from 'prop-types'
import {Chart as ChartJS, registerables} from 'chart.js'

import {useMemo} from 'react'
import departements from '@etalab/decoupage-administratif/data/departements.json'

ChartJS.register(...registerables)

const PublicationPerDepartmentChart = ({publicationsResponse}) => {
  const data = useMemo(() => {
    const sortedDepartments = departements.map(({nom, code}) => {
      const count = publicationsResponse.reduce((acc, {publishedBAL}) => {
        const selectedCommunes = Object.keys(publishedBAL).filter(
          codeCommune => codeCommune.slice(0, code.length) === code
        )
        return (
          acc
          + selectedCommunes.reduce(
            (selectedCommunesCount, codeCommunes) =>
              selectedCommunesCount + publishedBAL[codeCommunes].total,
            0
          )
        )
      }, 0)
      return {
        count,
        nom
      }
    }).sort((depA, depB) => depA.count > depB.count ? -1 : 1)

    return {
      labels: sortedDepartments.map(({nom}) => nom),
      datasets: [
        {
          label: 'BAL publiées',
          data: sortedDepartments.map(({count}) => count),
          borderColor: '#36A2EB',
          backgroundColor: '#9BD0F5',
        },
      ],
    }
  }, [publicationsResponse])

  return (
    <Chart
      type='bar'
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Nombre de publications par département',
            font: {
              size: 18,
            },
          },
        },
      }}
    />
  )
}

PublicationPerDepartmentChart.propTypes = {
  publicationsResponse: PropTypes.array.isRequired,
}

export default PublicationPerDepartmentChart
