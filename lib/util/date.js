import {format} from 'date-fns'
import {fr} from 'date-fns/locale'

export function formatDate(string) {
  return format(new Date(string), 'PPP', {locale: fr})
}
