import emailjs from '@emailjs/browser';

const emailjsCredentials = require('../credentials/emailjs_credentials.json');

export function generateEmailRoute(partnerLocations) {
  return partnerLocations.map(({ name }) => name).join('  ->  ');
}

export function generateEmailPaidServices(servicesToBeBought) {
  let str = '';
  if (servicesToBeBought.length > 0) {
    str = str.concat('\r\nYour Paid Services:\r\n');
    for (let index = 0; index < servicesToBeBought.length; index += 1) {
      const item = servicesToBeBought[index];
      str = str.concat(item.partnerLocation.name, '  ->  ');
      for (let j = 0; j < item.itemsToBeBought.length; j += 1) {
        str = str.concat(
          `${item.itemsToBeBought[j].name} (${item.itemsToBeBought[j].price} €) x ${item.itemsToBeBought[j].count} = ${item.itemsToBeBought[j].finalPrice} €, `
        );
      }
    }
  } else {
    str = 'You do not have any prepaid service.';
  }
  return str;
}

export function generateEmailAmount(amount) {
  return `- Total paid amount : ${amount} €`;
}

export function generateEmailGoogleMapsLink(partnerLocationList) {
  let googleMapsLink = 'https://www.google.com/maps/dir/';
  for (let index = 0; index < partnerLocationList.length; index += 1) {
    const loc = partnerLocationList[index];
    googleMapsLink = googleMapsLink.concat(loc.partnerLocation.name.replaceAll(' ', '+'), '/');
  }
  return googleMapsLink;
}

export function generatePaypalEmail(paypalEmail) {
  return `Paypal account for withdraw request : ${paypalEmail}`;
}

export function generateIntroMessage(type) {
  if (type === 'create') {
    return 'Your withdraw request is processing. It would take 2-3 working days.';
  }
  if (type === 'close') {
    return 'Your withdraw request is approved.';
  }
  return null;
}

export function generateRequestId(id) {
  return `Request Id : ${id} €`;
}

export function generatePaypalWithdrawAmount(amount) {
  return `The amount of withdraw : ${amount} €`;
}

export async function handleEmail(emailContent, templeteName) {
  emailjs.init(emailjsCredentials.publicKey);
  // e.preventDefault(); // Prevents default refresh by the browser
  let templeteId = '';
  if (templeteName === 'withdrawRequest') {
    templeteId = emailjsCredentials.templetesIds.withdrawRequest;
  } else if (templeteName === 'checkout') {
    templeteId = emailjsCredentials.templetesIds.checkout;
  }
  emailjs
    .send(
      emailjsCredentials.userId,
      templeteId,
      emailContent
      // emailjs.publicKey
    )
    .then(
      (result) => {
        console.log('Message Sent, We will get back to you shortly', result.text);
      },
      (error) => {
        console.log('An error occurred, Please try again', error.text);
      }
    );
}
