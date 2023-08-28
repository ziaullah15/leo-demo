import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import '../Holder.css';

const AddressDisplay = ({ label, value }) => (
    <div className="addressWrapper">
        <div>
            <b>{label}:</b><br />
            <span className="address">{value}</span>
        </div>
    </div>
);

const Holder = ({
    account, 
    loading, 
    dob, 
    expiration, 
    execute,
    signature,
    advanceStep,   
    backStep,
    issuer,
    subject,
}) => {
    const fadeProps = useSpring({
        opacity: 1,
        from: { opacity: 0 },
    });

    const [hasExecuted, setHasExecuted] = useState(false);

    const handleExecute = async () => {
        try {
            await execute();
            setHasExecuted(true);
        } catch (error) {
            console.error("Error executing:", error);
            // You can set an error state here to notify the user if needed
        }
    };

    const isButtonDisabled = loading || !subject || !expiration;

    return (
        <div className="moduleWrapper">
            <div className="interactionPanel">
                <h2>zPass</h2>
                <animated.div style={fadeProps}>
                    <AddressDisplay label="Issuer" value={issuer} />
                    <AddressDisplay label="Subject" value={subject} />
                    <AddressDisplay label="Expiration" value={expiration} />
                    <AddressDisplay label="Signature" value={""} />
                    
                    <button 
                        className="button"
                        onClick={handleExecute} 
                        aria-label="Generate Proof"
                        disabled={isButtonDisabled}
                    >
                        {loading ? 'Generating...' : 'Generate Proof'}
                    </button> 
                </animated.div>
            </div>
            <div className="navButtons">
                <button className="button navButton" onClick={backStep}>Back</button>
                <button className="button navButton" onClick={advanceStep} disabled={!hasExecuted}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Holder;
