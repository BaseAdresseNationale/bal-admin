import {useState, useEffect} from 'react'
import {format} from 'date-fns'
import {getStatFirstPublicationEvolution, getStatPublications} from '@/lib/api-depot'
import {getStatCreations} from '@/lib/api-mes-adresses'

const intialDashboardData = {
  firstPublicationEvolutionResponse: [],
  publicationsResponse: [],
  creationsResponse: []
}

const dayToMs = 1000 * 60 * 60 * 24
const getISODate = date => format(date, 'yyyy-MM-dd')

const addEmptyDatesToResponse = (response, timeLapse, initValue) => {
  const dates = []
  for (let i = 0; i <= timeLapse; i++) {
    const curDate = getISODate(new Date(Date.now() + ((i - timeLapse) * dayToMs)))
    const current = response.find(({date}) => date === curDate) || {date: curDate, ...initValue}
    dates.push(current)
  }

  return dates
}

export function useDashboardData(timeLapse) {
  const [dashboardData, setDashboardData] = useState(intialDashboardData)

  useEffect(() => {
    async function fetchDashboardData() {
      const to = getISODate(new Date())
      const from = getISODate(new Date(Date.now() - (timeLapse * dayToMs)))
      try {
        const firstPublicationEvolutionResponse = await getStatFirstPublicationEvolution({from, to})
        const publicationsResponse = await getStatPublications({from, to})
        const creationsResponse = await getStatCreations({from, to})
        setDashboardData({
          firstPublicationEvolutionResponse,
          publicationsResponse: addEmptyDatesToResponse(publicationsResponse, timeLapse, {publishedBAL: {}}),
          creationsResponse: addEmptyDatesToResponse(creationsResponse, timeLapse, {createdBAL: {}}),
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchDashboardData()
  }, [timeLapse])

  return {dashboardData}
}
