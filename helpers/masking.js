function emailMasking(email) {
  let maskedEmail = "";
  if (emailValidator(email)) {
    let splittedMail = email.split("@");
    let mailName = splittedMail[0].split("");
    let domainName = splittedMail[1];

    for (let i = 0; i < mailName.length; i++) {
      // const element = array[i];
      if(i>0 && i<mailName.length-3){
        mailName[i] = "*";
      }
    }

    maskedEmail = `${mailName.join("")}@${domainName}`;
  } else {
    maskedEmail = email;
  }

  return maskedEmail;
}

function emailValidator(email) {
  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  let validMail = false;

  regex.test(email)
    ? email.split("@")[1].split(".").length < 2 ||
      email.split("@")[1].split(".").length > 3
      ? (validMail = false)
      : (validMail = true)
    : (validMail = false);

  return validMail;
}

module.exports = { emailMasking, emailValidator };
