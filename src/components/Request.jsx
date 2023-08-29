import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import '../Verifier.css';

function Request({ account, loading, subject, expiration, backStep, advanceStep }) { 
    const fadeProps = useSpring({
        opacity: 1,
        from: { opacity: 0 },
    });

    const isButtonDisabled = !account || loading || !subject || !expiration;

    return (
        <animated.div className="moduleWrapper" style={fadeProps}>
            <div className="interactionPanel">
                <h2 className="cardTitle">zPass Verification</h2>
                <div className="verifierContent">
                    <button 
                        className="button"
                        onClick={advanceStep}
                        aria-label="Verify with zPass" 
                        disabled={isButtonDisabled}
                    >
                        {loading ? 'Verifying...' : 'Verify with zPass'}
                    </button>
                    
                </div>
                
            </div>
            <br />
           
            <div className="navButtons">
                <button className="button" onClick={backStep}>Back</button>
                <button className="button" onClick={backStep} disabled>Done</button>
            </div>
        </animated.div>
    );
}

export default Request;
