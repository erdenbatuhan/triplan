import { useEffect, useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import emailjs from '@emailjs/browser';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { getUser } from '../queries/user-queries';

const emailjsCredentials = require('../credentials/emailjs_credentials.json');

// const emailContent = {
//   to_name: 'Seba',
//   message: 'Have a nice vocation!',
//   to_email: 'anil.kults@gmail.com'
// };

// Custom component to wrap the PayPalButtons and handle currency changes
export default function PaypalCheckoutButtons({ currency, amount, showSpinner }) {
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  // This values are the props in the UI
  const style = { layout: 'vertical' };
  const [emailContent, setEmailContent] = useState({});
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }
    getUser(authenticatedUser.user.id).then((data) => {
      setUser(data);
    });
  }, [authenticatedUser]);

  useEffect(() => {
    if (!user) {
      return;
    }
    setEmailContent({
      to_name: ('%s %s', user.firstName, user.lastName),
      message: 'Have a nice vocation!',
      to_email: user.email
    });
  }, [user]);

  const handleEmail = () => {
    emailjs.init(emailjsCredentials.publicKey);
    // e.preventDefault(); // Prevents default refresh by the browser
    emailjs
      .send(
        emailjsCredentials.userId,
        emailjsCredentials.templeteId,
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
          return actions.order.capture().then(handleEmail());
        }}
      />
    </>
  );
}
