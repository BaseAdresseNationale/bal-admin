import {format} from 'date-fns'
import {fr} from 'date-fns/locale'

export function formatDate(string, pattern = 'PPPpp') {
  return format(new Date(string), pattern, {locale: fr})
}
