module.exports = function authResponse(data) {
  return {
      username: data.username,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.mobile,
  }
}