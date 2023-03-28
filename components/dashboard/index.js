import styled from 'styled-components'
import Button from '@codegouvfr/react-dsfr/Button'
import {useState} from 'react'
import PublicationPerDepartmentChart from './charts/publications-per-department'
import FirstPublicationEvolutionChart from './charts/first-publication-evolution'
import PublicationCountChart from './charts/publication-count'
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
const timeLapseButtons = [
  {
    label: 'Mois',
    value: 30,
  },
  {
    label: 'Semaine',
    value: 7,
  },
  {
    label: 'Jour',
    value: 0,
  },
]

const Dashboard = () => {
  const [timeLapse, setTimeLapse] = useState(30)
  const {dashboardData} = useDashboardData(timeLapse)

  return (
    <DashboardContainer>
      <div className='dashboard-header'>
        {timeLapseButtons.map(({label, value}) => (
          <Button
            key={label}
            type='button'
            className={value === timeLapse ? 'active' : ''}
            onClick={() => setTimeLapse(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className='chart-wrapper'>
        <FirstPublicationEvolutionChart firstPublicationEvolutionResponse={dashboardData.firstPublicationEvolutionResponse} />
      </div>
      <div className='chart-wrapper'>
        <PublicationPerDepartmentChart publicationsResponse={dashboardData.publicationsResponse} />
      </div>
      <div className='chart-wrapper'>
        <PublicationCountChart publicationsResponse={dashboardData.publicationsResponse} />
      </div>
    </DashboardContainer>
  )
}

export default Dashboard
