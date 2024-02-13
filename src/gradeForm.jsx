// JUMP TO LINE 331
import { SubjectAndGrade } from "./subjectAndGrade";
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Popup } from "./popup";
import axios from "axios";
import PaystackPop from '@paystack/inline-js';

function dec2hex (dec) {
    return dec.toString(16).padStart(2, "0")
  }
  
  // generateId :: Integer -> String
  function generateId (len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
  }


GradeForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

const unitsData = [
    { unitNumber: 'Unit 1', gradeNumber: 'Grade for Unit 1' }
];

const subjects = [
    "CONTROL SYSTEMS", 
    "ELECTRONICS", 
    "POWER SYSTEMS", 
    "MICROWAVES AND ANTENNAS"
];

const subjectValues = [
    "cs", 
    "ae", 
    "ps", 
    "uw"
];

/* tiny pesa api requirements*/
// const API_KEY = 'QBPIA8z6whK';
const API_URL = 'https://api.paystack.co/charge';
// const ACC_NUMBER = '200';
const AMOUNT = '50';


export function GradeForm({ onSubmit }) {
    const [selectedSubjectsData, setSelectedSubjectsData] = useState([]);
    const [mpesaNumber, setMpesaNumber] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [reference, setReference] = useState("")
    
    const handleSubjectStateChange = (index, selectedSubject, selectedGrade) => {
        const updatedSelectedSubjectsData = [...selectedSubjectsData];
        updatedSelectedSubjectsData[index] = { subject: selectedSubject, grade: parseInt(selectedGrade) };
        setSelectedSubjectsData(updatedSelectedSubjectsData);
    };

    const handleMpesaChange = (e) => {
        setMpesaNumber(e.target.value);
    };

    const results = [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const paystack = new PaystackPop();
        let ref = generateId()
        setReference(ref)
        paystack.newTransaction({
            key: 'pk_live_1fe2f3a43d1bfa813a1bedad966b91ef93bbbec5',
            email: 'mitchjaga@gmail.com',
            amount: 200,
            currency: 'KES',
            ref: ref,
            onSuccess: (transaction) => { 
                console.log(transaction);
                setShowPopup(true)
            },
            onCancel: () => {
                // user closed popup
                console.log("cancelled");
            }
        });
    };
      
    // THIS FUNCTION IS CALLED WHEN THE BUTTON TO CONFIRM PAYMENT IS CALLED
    const handleConfirmPayment = async () => {
        try {
            const {data} = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: "Bearer sk_live_8ed931223ca2e35ca44051565a8b4a6c588ab694",
                    'Content-Type': 'application/json',
                }
            })
            if(data){
                // when the payment has been confirmed it then calculates the results
                if(data.status == true){
                    console.log(data.message)
                    submitResults()
                }else{

                }
            }else{
                // This means that the payment has not been made
                console.log("There is no data");
            }
            
        } catch (error) {
            console.log(error.response);
        }        
    };

    const submitResults = () => {
        setShowPopup(false); 
        // THEN IT REDIRECTS TO THE RESULTS PAGE. MAKE CHANGES HERE
        // THE onSubmit FUNCTION SHOULD ONLY BE CALLED IF THE PAYMENT HAS BEEN MADE
        onSubmit(results);
    }

    const handleClosePopup = () => {
        setShowPopup(false); 
    }

    async function sendStkRequest() {
        try {
            const {data} = await axios.post(API_URL, {
                amount: "200",
                email: "mutindasamuel01@gmail.com",
                currency: "KES",
                mobile_money: { 
                  phone: "+254713241864", 
                  provider: "mpesa"
                } 
              
            }, {
                headers: {
                    Authorization: "Bearer sk_live_8ed931223ca2e35ca44051565a8b4a6c588ab694",
                    'Content-Type': 'application/json',
                }
            })
            if(data){
                // when the payment has been confirmed it then calculates the results
                console.log(data.data.reference)
                setReference(data.data.reference)
            }else{
                // This means that the payment has not been made
                console.log("There is no data")
            }
            
        } catch (error) {
            console.log(error.response);
        }        
    }

    return (
        <>
            <form 
                action=""
                id="grades" 
                className="input-form" 
                method="post"
                onSubmit={handleSubmit}
            >
                <div className="formtitle">
                    <p>Select your units and grades</p>
                </div>
                <div className="formdescription">
                    <p>
                        You will be charged a service fee of KES 50. Please enter your M-Pesa number 
                        after entering your grades.
                    </p>
                </div>

                {unitsData.map((unit, index) => (
                    <SubjectAndGrade 
                        key={index}
                        {...unit}
                        subjects={subjects}
                        onSubjectStateChange={(selectedSubject, selectedGrade) => handleSubjectStateChange(index, selectedSubject, selectedGrade)}
                        selectedSubjects={selectedSubjectsData.map(data => data.subject)}
                        subjectValues={subjectValues}
                    />
                ))}

                <div className="mpesaNumber">
                    <label htmlFor="fname" >Enter your M-Pesa Number:</label>
                    <br />
                    <input 
                        type="text" 
                        id="mpesa" 
                        value={mpesaNumber}
                        onChange={handleMpesaChange}
                        required 
                    />
                </div>
                <div className="submitbuttonbox">
                    <input type="submit" value="Calculate" id="submitbutton" />
                </div>
            </form>
            <Popup trigger={showPopup} onConfirmPayment={handleConfirmPayment} onClose={handleClosePopup}/>
        </>
    );
}