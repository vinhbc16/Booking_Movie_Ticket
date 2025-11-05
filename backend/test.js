const {format} = require('date-fns')
const date = '2025-10-05T12:30:00+07:00'
const time = new Date(date)
const x = format(time, 'yyyy-MM-dd HH:mm:ss')
console.log(x)