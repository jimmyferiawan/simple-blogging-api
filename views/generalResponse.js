const {responseLogger} = require('../helpers/logger')

const generalResponse = (status, error, message) => {
    const respBody = {
        error: error,
        message: message
    }

    responseLogger({body: respBody, status: status, headers: {}})
    return { status: status, body: respBody}
    // return res.status(status).send(respBody)
}

module.exports=generalResponse