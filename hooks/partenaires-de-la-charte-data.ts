import {useState, useEffect} from 'react'
import {getPartenairesDeLaCharte} from '../lib/partenaires-de-la-charte'
import type {PartenaireDeLaChartType} from '../types/partenaire-de-la-charte'

export function usePartenairesDeLaCharteData() {
  const [isLoading, setIsLoading] = useState(false)
  const [partenairesDeLaCharteData, setPartenairesDeLaCharteData] = useState<PartenaireDeLaChartType[]>([])
  const [candidaturesEnAttenteData, setCandidaturesEnAttenteData] = useState<PartenaireDeLaChartType[]>([])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const partenairesDeLaCharte = await getPartenairesDeLaCharte()
        setPartenairesDeLaCharteData(partenairesDeLaCharte.filter(partenaireDeLaCharte => partenaireDeLaCharte.signatureDate))
        setCandidaturesEnAttenteData(partenairesDeLaCharte.filter(partenaireDeLaCharte => !partenaireDeLaCharte.signatureDate))
      } catch (err: unknown) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [])

  return {isLoading, partenairesDeLaCharteData, candidaturesEnAttenteData}
}
