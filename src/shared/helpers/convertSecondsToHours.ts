import _ from 'lodash'

export function convertSecondsToHours(sec: number, options = { isShowSeconds: false }) {
  const hour = Math.floor(sec / 3600)
  const min = Math.floor(sec / 60) - hour * 60
  const s = sec - min * 60 - hour * 3600
  const parts = options.isShowSeconds ? [hour, min, s] : [hour, min]
  const title = ['h', 'min', 'sec']
  const data = []
  for (let i = 0; i < parts.length; i += 1) {
    if (parts[i] > 0) {
      data.push(`${parts[i]} ${title[i]}`)
    }
  }
  return _.join(data, ' ')
}
