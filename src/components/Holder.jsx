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

const Holder = ({ account, loading, dob, expiration, execute, signature, advanceStep, backStep, issuer, subject, verified }) => {
    const fadeProps = useSpring({ opacity: 1, from: { opacity: 0 } });
    const [hasExecuted, setHasExecuted] = useState(false);
    const [error, setError] = useState(null);

    const handleExecute = async () => {
        try {
            await execute();
            setHasExecuted(true);
        } catch (err) {
            console.error("Error executing:", err);
            setError("An error occurred while generating the proof.");
        }
    };

    const isButtonDisabled = loading || !subject || !expiration;

    return (
        <div className="moduleWrapper">
            <div className="interactionPanel">
                <h2>zPass</h2>
                {error && <div className="error">{error}</div>}
                <animated.div style={fadeProps}>
                    <AddressDisplay label="Issuer" value={issuer} />
                    <AddressDisplay label="Subject" value={subject} />
                    <AddressDisplay label="Expiration" value={expiration} />
                    {/* <AddressDisplay label="Signature" value={signature} /> */}

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
