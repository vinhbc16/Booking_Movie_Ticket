const dateFormat = (time, timezone = '+07:00') => {
    try {
        const [datePart, timePart] = time.trim().split(' ')
        const [day, month, year] = datePart.split('/')
        const [hour, minute, second = '00'] = timePart.split(':')

        const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}${timezone}`
        return isoString
    } catch (err) {
        throw new Error(`Invalid date format: ${time}`)
    }
}

module.exports = dateFormat