import {useState, useEffect, useCallback} from 'react'
import {format} from 'date-fns'
import {getStatFirstPublicationEvolution, getStatPublications} from '@/lib/api-depot'

const intialDashboardData = {
  firstPublicationEvolutionResponse: [],
  publicationsResponse: [],
}

const dayToMs = 1000 * 60 * 60 * 24
const getISODate = date => format(date, 'yyyy-MM-dd')

export function useDashboardData(timeLapse) {
  const [dashboardData, setDashboardData] = useState(intialDashboardData)

  const addEmptyPublicationsToResponse = useCallback(publicationsResponse => {
    const publications = []
    for (let i = 0; i <= timeLapse; i++) {
      const curDate = getISODate(new Date(Date.now() + ((i - timeLapse) * dayToMs)))
      const curPublications = publicationsResponse.find(({date}) => date === curDate) || {date: curDate, publishedBAL: []}
      publications.push(curPublications)
    }

    return publications
  }, [timeLapse])

  useEffect(() => {
    async function fetchDashboardData() {
      const to = getISODate(new Date())
      const from = getISODate(new Date(Date.now() - (timeLapse * dayToMs)))
      try {
        const firstPublicationEvolutionResponse = await getStatFirstPublicationEvolution({from, to})
        const publicationsResponse = await getStatPublications({from, to})
        setDashboardData({
          firstPublicationEvolutionResponse,
          publicationsResponse: addEmptyPublicationsToResponse(publicationsResponse, timeLapse)
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchDashboardData()
  }, [timeLapse, addEmptyPublicationsToResponse])

  return {dashboardData}
}
