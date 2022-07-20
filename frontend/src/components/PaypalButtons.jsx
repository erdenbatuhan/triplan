import { useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
// import emailjs from '@emailjs/browser';
// import { UserAuthHelper } from '../authentication/user-auth-helper';
// import { getUser } from '../queries/user-queries';

// const emailjsCredentials = require('../credentials/emailjs_credentials.json');

// function generateEmailMessage(partnerLocationList, servicesToBeBought, amount) {
//   let message =
//     'Your optimized route plan is consist of following places. You can also click the link below to see the route on google maps.\r\n';
//   let googleMapsLink = 'https://www.google.com/maps/dir/';
//   for (let index = 0; index < partnerLocationList.length; index += 1) {
//     const loc = partnerLocationList[index];
//     message = message.concat('\r\n- ', loc.partnerLocation.name);
//     googleMapsLink = googleMapsLink.concat(loc.partnerLocation.name.replaceAll(' ', '+'), '/');
//   }
//   if (servicesToBeBought.length > 0) {
//     message = message.concat('\r\nYour Paid Services:\r\n');
//     for (let index = 0; index < servicesToBeBought.length; index += 1) {
//       const item = servicesToBeBought[index];
//       message = message.concat('\r\n- ', item.partnerLocation.name);
//       for (let j = 0; j < item.itemsToBeBought.length; j += 1) {
//         message = message.concat(
//           '\r\n\r\t- ',
//           `${item.itemsToBeBought[j].name} (${item.itemsToBeBought[j].price} €) x ${item.itemsToBeBought[j].count} = ${item.itemsToBeBought[j].finalPrice} €`
//         );
//       }
//       googleMapsLink = googleMapsLink.concat(item.partnerLocation.name.replaceAll(' ', '+'), '/');
//     }
//     message = message.concat('\r\n- Total paid amount : ', amount, '€');
//   }

//   message = message.concat('\r\n\r\nGoogle Maps Link:\r\n');
//   message = message.concat(googleMapsLink);
//   return message;
// }

// Custom component to wrap the PayPalButtons and handle currency changes
export default function PaypalCheckoutButtons({
  currency,
  amount,
  onPaymentComplete,
  showSpinner
}) {
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  // This values are the props in the UI
  const style = { layout: 'horizontal', label: 'paypal' };
  // const [emailContent] = useState({});
  // const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  // const [itemList, setItemList] = useState([]);
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   if (!authenticatedUser) {
  //     return;
  //   }
  //   getUser(authenticatedUser.user.id).then((data) => {
  //     setUser(data);
  //   });
  // }, [authenticatedUser]);

  // useEffect(() => {
  //   if (!user) {
  //     return;
  //   }
  //   emailContent.to_name = (user.firstName, ' ', user.lastName);
  //   emailContent.to_email = user.email;
  // }, [user]);

  // useEffect(() => {
  //   if (!partnerLocationList) {
  //     return;
  //   }
  //   setItemList(servicesToBeBought);
  //   emailContent.message = generateEmailMessage(partnerLocationList, itemList, amount);
  // }, [partnerLocationList, servicesToBeBought, amount]);

  // useEffect(() => {
  //   if (!servicesToBeBought) {
  //     return;
  //   }

  // }, [servicesToBeBought]);
  // console.log(emailContent);

  // const handleEmail = () => {
  //   emailjs.init(emailjsCredentials.publicKey);
  //   // e.preventDefault(); // Prevents default refresh by the browser
  //   emailjs
  //     .send(
  //       emailjsCredentials.userId,
  //       emailjsCredentials.templeteId,
  //       emailContent
  //       // emailjs.publicKey
  //     )
  //     .then(
  //       (result) => {
  //         console.log('Message Sent, We will get back to you shortly', result.text);
  //       },
  //       (error) => {
  //         console.log('An error occurred, Please try again', error.text);
  //       }
  //     );
  // };
  const completePayment = () => {
    onPaymentComplete(true); // Update parent
  };

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        currency
      }
    });
  }, [currency, showSpinner]);

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount
                  }
                }
              ]
            })
            .then((orderId) => {
              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(completePayment());
        }}
      />
    </>
  );
}
