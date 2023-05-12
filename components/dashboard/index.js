import styled from 'styled-components'
import Button from '@codegouvfr/react-dsfr/Button'
import {useState} from 'react'
import PublicationPerDepartmentChart from './charts/publications-per-department'
import FirstPublicationEvolutionChart from './charts/first-publication-evolution'
import PublicationCountChart from './charts/publication-count'
import CreationCountChart from './charts/creation-count'
import {useDashboardData} from '@/hooks/dashboard-data'

export const defaultChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      font: {
        size: 18,
      },
    },
  },
  scales: {
    yAxes: [
      {
        display: true,
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
}

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > .dashboard-header {
    margin-top: 15px;
    button {
      margin: 0 5px;
    }
    button.active {
      background-color: var(--active);
    }
  }

  > .chart-wrapper {
    margin: 10px 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 500px;
  }
`
const timeLapses = [
  {
    label: 'Année',
    value: 365,
    interval: 30
  },
  {
    label: 'Mois',
    value: 30,
  },
  {
    label: 'Semaine',
    value: 7,
  }
]

const Dashboard = () => {
  const [timeLapseIndex, setTimeLapseIndex] = useState(1)
  const {dashboardData} = useDashboardData(timeLapses[timeLapseIndex].value)

  return (
    <DashboardContainer>
      <div className='dashboard-header'>
        {timeLapses.map(({label}, index) => (
          <Button
            key={label}
            type='button'
            className={index === timeLapseIndex ? 'active' : ''}
            onClick={() => setTimeLapseIndex(index)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className='chart-wrapper'>
        <FirstPublicationEvolutionChart firstPublicationEvolutionResponse={dashboardData.firstPublicationEvolutionResponse} interval={timeLapses[timeLapseIndex].interval} />
      </div>
      <div className='chart-wrapper'>
        <PublicationPerDepartmentChart publicationsResponse={dashboardData.publicationsResponse} />
      </div>
      <div className='chart-wrapper'>
        <PublicationCountChart publicationsResponse={dashboardData.publicationsResponse} firstPublicationEvolutionResponse={dashboardData.firstPublicationEvolutionResponse} interval={timeLapses[timeLapseIndex].interval} />
      </div>
      <div className='chart-wrapper'>
        <CreationCountChart creationsResponse={dashboardData.creationsResponse} interval={timeLapses[timeLapseIndex].interval} />
      </div>
    </DashboardContainer>
  )
}

export default Dashboard
