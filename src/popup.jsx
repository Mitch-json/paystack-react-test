import PropTypes from 'prop-types';
Popup.propTypes = {
    trigger: PropTypes.bool.isRequired,
    onConfirmPayment: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export function Popup({ trigger, onConfirmPayment, onClose }) {
    return (trigger) ? (
        <>
            <div className="popup">
                <div className="popup_inner">
                    <div className='popuptitle'>Confirm M-Pesa Payment</div>
                    <p className='popupdescription'>
                        If M-Pesa popup does not appear on your phone, 
                        go to your M-Pesa menu and pay KES 50 to Till Number: 4133230 - samuel mutinda kyungu
                    </p>
                    <p className='popupdescription2'>
                        When you have received the M-Pesa transaction message,
                        click Confirm Payment below
                    </p>
                    <button className="closebtn" onClick={onClose}>Close</button>

                    {/* THIS IS THE CONFIRM PAYMENT BUTTON */}
                    <div className='confirmbtndiv'>
                        {/* WHEN THE BUTTON IS CLICKED, THE onConfirmPayment FUNCTION IS CALLED */}
                        <button className='confirmbtn' onClick={onConfirmPayment}>Confirm Payment</button>
                    </div>
                </div>
            </div>
        </>
    ) : "";
}