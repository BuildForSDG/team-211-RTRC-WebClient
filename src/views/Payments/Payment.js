import React, { useState, useEffect } from 'react';
import PaystackButton from 'react-paystack';
import axios from 'axios';
import { paymentsUrl, successToast } from 'config';
import { errorToast } from './utils';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import './style.css';
import constants from 'store/constants';

const Payment = props => {
  const dispatch = useDispatch();
  const { token, email, amount, reference } = useSelector(
    state => state.paymentsReducer
  );
  const [paystackAmount, setPaystackAmount] = useState(0);
  const [key, setKey] = useState(
    'pk_test_5c686eaa51e328f9036f1e9f4fc561859611b50f'
  ); //PAYSTACK PUBLIC KEY
  const [currency, setCurrency] = useState('GHS');

  useEffect(() => {
    setPaystackAmount(amount * 100);
    setCurrency('GHS');
    setKey('pk_test_5c686eaa51e328f9036f1e9f4fc561859611b50f');
  }, []);

  const callback = response => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    const url = paymentsUrl + 'confirm/';
    const payload = { reference: response.reference };

    axios
      .post(url, payload, { headers })
      .then(res => {
        /* NOTE: clear reference from state. 
        and remove amount from state. 
        to prevent duplicate confirmation. 
        to prevent duplicated wallet values.
        */
        successToast(toast, 'Payment Confirmed!');
        dispatch({ type: constants.REMOVE_PAYMENT_AMOUNT });
        dispatch({ type: constants.REMOVE_REFERENCE });
        dispatch({ type: constants.OPEN_PAYMENT_DIALOG, payload: false });
      })
      .catch(err => {
        if (err.response) {
          errorToast(toast, 'Error Processing Payment, Retry.', err);
        } else {
          errorToast(toast, 'Cannot connect to server, retry', err);
        }
      });
  };

  const close = () => {
    console.log('Payment closed');
  };

  return (
    <p>
      <PaystackButton
        text="Proceed"
        class="payButton"
        callback={callback}
        close={close}
        disabled={false} /*disable payment button*/
        embed={false} /*payment embed in your app instead of a pop up*/
        reference={reference}
        email={email}
        amount={paystackAmount}
        currency={currency}
        paystackkey={key}
        tag="button" /*it can be button or a or input tag */
      />
    </p>
  );
};

export default Payment;
