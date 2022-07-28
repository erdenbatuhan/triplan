import emailjs from '@emailjs/browser';

const emailjsCredentials = require('../credentials/emailjs_credentials.json');

export function generateEmailRoute(partnerLocations) {
  return partnerLocations.map(({ name }) => name).join('  ->  ');
}

export function generateGoogleMapsLink(partnerLocations) {
  const extension = partnerLocations.map(({ name }) => name.replaceAll(' ', '+')).join('/');
  return `https://www.google.com/maps/dir/${extension}`;
}

export function generateEmailPaidServices(servicesToBeBought) {
  if (servicesToBeBought.length === 0) {
    return 'You do not have any prepaid services!';
  }

  const serviceInfo = servicesToBeBought
    .map(({ partnerLocation, itemsToBeBought }) => {
      const itemString = itemsToBeBought
        .map(
          ({ name, price, count, finalPrice }) =>
            `${name} (${price} €) x ${count} = ${finalPrice} €`
        )
        .join(', ');
      return `${partnerLocation.name}  ->  ${itemString}`;
    })
    .join('\r\n');

  return serviceInfo;
}

export function generateEmailAmount(amount) {
  return `- Total paid amount : ${amount} €`;
}

export function generateEmailGoogleMapsLink(partnerLocations) {
  return `https://www.google.com/maps/dir/${partnerLocations
    .map(({ name }) => name.replaceAll(' ', '+'))
    .join('/')}`;
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
  return `Request Id : ${id}`;
}

export function generatePaypalWithdrawAmount(amount) {
  return `The amount of withdraw : ${amount} €`;
}

export async function handleEmail(emailContent, templeteName) {
  emailjs.init(emailjsCredentials.publicKey);
  // e.preventDefault(); // Prevents default refresh by the browser
  let templeteId = '';
  if (templeteName === 'general') {
    templeteId = emailjsCredentials.templetesIds.general;
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
