import React, { useEffect, useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useAppSelector } from '../../app/hooks';

interface PaypalButtonProps {
  totalAmount: number;
}

const PaypalButton: React.FC<PaypalButtonProps> = ({ totalAmount }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const logged = true;
  const userToken = useAppSelector((state) => state.login.token);
  const [showTerms, setShowTerms] = useState(false);
  const terms = `
1. תוכנית נקודות נאמנות<br />
   1.1. תוכנית נקודות הנאמנות ("פרימיום פוינט") מנוהלת על ידי סוּפרוֹי.<br />
   1.2. השתתפות בתוכנית מותנית בתנאים וההגבלות אלו.<br />
2. צבירת נקודות<br />
   2.1.על כל שקל אחד שבו נעשתה קנייה הלקוח יקבל נקודה,על כל 200 נקודות שהלקוח צבר, יקבל כ-20 ש"ח הנחה <br />
   2.2.  ניתן לצבור נקודות על כל הרכישות שבוצעו באתר של סוּפרוֹי.<br />
   2.3. לא ניתן לקבל נקודות עבור רכישות שבוצעו באמצעות נקודות שהומרו.<br />
3. מימוש נקודות<br />
   3.1. ניתן לממש נקודות עבור רכישות באתר של סוּפרוֹי.<br />
   3.2. לא ניתן לממש נקודות תמורת מזומן.<br />
4. מאזן הנקודות<br />
   4.1. ניתן לבדוק את מאזן הנקודות בדף עגלת הקניות של המשתמש.<br />
   4.2.  סוּפרוֹי שומרת לעצמה את הזכות לתקן את מאזן הנקודות אם היא מאמינה שטעות ניהולית או חשבונאית התרחשה.<br />
5. תוקף הנקודות<br />
   5.1. הנקודות יהפכו לפגי תוקף 12 חודשים לאחר שנצברו.<br />
   5.2. נקודות לא יוחזרו אם הן יהפכו פגי תוקף.<br />
6. שינויים בתוכנית<br />
   6.1. סוּפרוֹי שומרת לעצמה את הזכות לשנות את התנאים וההגבלות או לבטל את התוכנית בכל עת.<br />
`;



  useEffect(() => {
    axios.get('https://roee-supermarket-rol8.onrender.com/user_profile/')
      .then(response => {
        setLoyaltyPoints(response.data.loyalty_points);
      })
      .catch(error => console.error('Error fetching user profile data:', error));
  }, []);


  if (!logged || isPending || totalAmount <= 0) {
    return null;
  }


  const handleRedeemPointsChange = () => {
    setRedeemPoints(!redeemPoints);
  };

  if (!logged || isPending || totalAmount <= 0) {
    return null;
  }

  const finalAmount = redeemPoints ? Math.max(totalAmount - loyaltyPoints, 0) : totalAmount;


  return (
    <div>
      <button style={{
        backgroundColor: '#007BFF',
        width: "17%",
        padding: '1px 5px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '28px',
        cursor: 'pointer',
        position: 'fixed',
        bottom: '0px',
        left: '0px',
        zIndex: 1000,
        height: "45px"
      }} onClick={() => setShowModal(true)}>לתשלום {totalAmount.toFixed(2)}₪</button>

      <div style={{ position: 'fixed', bottom: '494px', left: '127px', backgroundColor: '#fff', padding: '0px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '10px' }}>הנקודות שלי: {loyaltyPoints}</div>
        <label>
          <input type="checkbox" checked={redeemPoints} onChange={handleRedeemPointsChange} />
          ממש נקודות בקנייה זו
        </label>
        <br />
        <button
          style={{
            bottom: "520px",
            left:"230px",
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
          onClick={() => setShowTerms(true)}
        >
          תקנון
        </button>

      </div>

      {showTerms && (
        <div style={{ position: 'fixed', top: '20px', left: '80px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', zIndex: 1000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>פרימיום פוינט-תנאים והגבלות</h2>
            <button onClick={() => setShowTerms(false)} style={{ border: 'none', cursor: 'pointer', backgroundColor: "red", fontSize: '12px', color: 'white', bottom: "498px", left: "855px" }}>×</button>
          </div>
          <p dangerouslySetInnerHTML={{ __html: terms }}></p>
        </div>
      )}



      {
        showModal && (
          <div id="id01" className="modal">
            <div className="modal-content animate">
              <div className="imgcontainer">
                <span onClick={() => setShowModal(false)} className="close" title="Close Modal">&times;</span>
              </div>
              <div className="container">
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order?.create({
                      purchase_units: [{
                        amount: {
                          currency_code: 'ILS',
                          value: finalAmount.toString()
                        }
                      }]
                    }) ?? Promise.reject('Order creation failed');
                  }}
                  onApprove={(data, actions) => {



                    return axios.post('https://roee-supermarket-rol8.onrender.com/capture_order/', {
                      orderID: data.orderID,
                    }, {
                      headers: {
                        'Authorization': `Bearer ${userToken}`
                      }
                    })
                      .then(response => {

                      })
                      .catch(error => {

                      });
                  }}
                  style={{
                    shape: 'rect',
                    color: 'gold',
                    layout: 'vertical',
                    label: 'checkout',
                    height: 40
                  }}
                />
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default PaypalButton;

