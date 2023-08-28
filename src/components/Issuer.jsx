import React from 'react';
import '../Issuer.css';  // Make sure you have defined styles in this CSS file

const CredentialDetail = ({ label, value }) => (
    <div className="credentialDetail">
        <span className="label">{label}:</span>
        <span className="value">{value}</span>
    </div>
);

const credentialData = {
    subject: "Aleo Fan",
    issuer: "zPass",
    expiration: "01/01/2030"
};

const Issuer = ({ generateSignature, advanceStep, setIssuer, setSubject, setExpiration }) => {
    const handleIssue = async () => {
        setIssuer(credentialData.issuer);
        setSubject(credentialData.subject);
        setExpiration(credentialData.expiration);
        await generateSignature();
        advanceStep();
    };

    return (
        <div className="moduleWrapper">
            <div className="cardHeader">zPass Credential Issuer</div>
            
            <div className="credentialDetails">
                <CredentialDetail label="Subject" value={credentialData.subject} />
                <CredentialDetail label="Issuer" value={credentialData.issuer} />
                <CredentialDetail label="Expiration" value={credentialData.expiration} />
            </div>
            
            <div className="actionButtonWrapper">
                <button className="button" onClick={handleIssue}>
                    Issue zPass
                </button>
            </div>
        </div>
    );
};

export default Issuer;
