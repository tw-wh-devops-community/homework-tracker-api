import * as moment from 'moment'

export const dateFormat = date => (date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '')
export const isInTime = (t1, t2) => moment(t1).diff(moment(t2))
export const duration = (t1, t2) => moment(t1).diff(moment(t2), 'minutes')
export const fromNow = t => moment(t).diff(moment(new Date()), 'minutes')
export const translateToCNDate = totalMinutes => {
  const dayMinutes = 24 * 60
  const hourMinutes = 60

  const days = Math.floor(totalMinutes / dayMinutes)
  const hours = Math.floor(totalMinutes % dayMinutes / hourMinutes)
  const minutes = Math.floor(totalMinutes % dayMinutes % hourMinutes)



  return days === 0 ? hours === 0 ? `${minutes}分钟` : `${hours}小时${minutes}分钟` : `${days}天${hours}小时${minutes}分钟`
}