const Moment = require('moment')

function responseLogger(resp) {
    console.log('Response Time : ', Moment().format("DD-MM-yyyy hh:mm:ss.SSS"))
    console.log('Response Status : ', resp.status || "")
    console.log('Response Header : ', resp.headers || "")
    console.log('Response Body : ', resp.body || "")
}

function requestLogger(req) {
    console.log('Request Time : ', Moment().format("DD-MM-yyyy hh:mm:ss.SSS"))
    console.log('Request type : ', req.method || "")
    console.log('Request URI : ', req.originalUrl || "")
    console.log('Request Body : ', req.body || "")
    console.log('Request Query : ', req.query || "")
    console.log('Request Header : ', req.headers || "")
}

module.exports = {
  responseLogger,
  requestLogger,
}