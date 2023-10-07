const {responseLogger} = require('../helpers/logger')

const viewResponse = (status, body) => {
    responseLogger({body: body, status: status, headers: {}})

    return { status: status, body: body}
}

module.exports=viewResponse