export const DataFormatHelper = {
    format:(date : Date) => {

        // let year = date.getFullYear()
        // let mouth = date.getUTCMonth()
        // let day = date.getUTCDay()
        // let hour = date.getUTCHours()
        // let m = date.getUTCMinutes()
        // let s = date.getUTCSeconds()
        // return `${year}-${mouth}-${day} ${hour}:${m}:${s}`
        return date.toDateString()
    },

    parse : (dateStr) => {

    }
}