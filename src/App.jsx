import { useEffect, useState } from "react";
import Issuer from "./components/Issuer";
import Holder from "./components/Holder";
import Verifier from "./components/Verifier";
import Request from "./components/Request";
import { useAleoWASM } from "./aleo-wasm-hook";


function App() {
    const aleo = useAleoWASM();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [issuer, setIssuer] = useState('');
    const [dob, setDob] = useState('');
    const [expiration, setExpiration] = useState('');
    const [signature, setSignature] = useState('');
    const [verified, setVerified] = useState(false);

    const signingAccount = account;

    const signString = (str) => {
        if (!str || !signingAccount) return;
        return signingAccount.sign(str);
    };

    const generateAccount = () => {
        setAccount(new aleo.PrivateKey());
    };

    const generateSignature = () => {
        const str = `${subject}${issuer}${dob}${expiration}` + `2023field` + `21field`;
        const generatedSignature = signString(str);
        setSignature(generatedSignature.to_string());
    };
    
    const [worker, setWorker] = useState(null);

    useEffect(() => {
      if (worker === null) {
        const spawnedWorker = spawnWorker();
        setWorker(spawnedWorker);
        return () => {
          spawnedWorker.terminate();
        };
      }
    }, []);
  
    function spawnWorker() {
      return new Worker(new URL("workers/worker.js", import.meta.url), {
        type: "module",
      });
    }
  
    
    function postMessagePromise(worker, message) {
        return new Promise((resolve, reject) => {
        worker.onmessage = (event) => {
            resolve(event.data);
        };
        worker.onerror = (error) => {
            reject(error);
        };
        worker.postMessage(message);
        });
    }

    const [step, setStep] = useState(0);
    const [result, setResult] = useState(0);


    const advanceStep = () => {
        setStep(prevStep => prevStep + 1);
    };

    const backStep = () => {
      setStep(prevStep => prevStep - 1);
    };


    async function execute() {

        const hello_hello_program =
          "program hello_hello.aleo;\n" +
          "\n" +
          "function hello:\n" +
          "    input r0 as u32.public;\n" +
          "    input r1 as u32.private;\n" +
          "    add r0 r1 into r2;\n" +
          "    output r2 as u32.private;\n";
    
        setLoading(true);
        const response = await postMessagePromise(worker, {
          type: "ALEO_EXECUTE_PROGRAM_LOCAL",
          localProgram: hello_hello_program,
          aleoFunction: "hello",
          inputs: ["5u32", "5u32"],
          privateKey: account.to_string(),
        });
        setLoading(false);
        advanceStep();
        setResult(response);
        setVerified(true);

      }
    
    const initializeAndAdvance = () => {
        generateAccount();
        advanceStep();
    };



    
    // Continued from above

    let renderedComponent;

    switch (step) {
        case 0:
            renderedComponent = (
                <div className="center">
                    <button className="button" onClick={initializeAndAdvance}>
                        Initialize zPass
                    </button>
                </div>
            );
            break;
        case 1:
            renderedComponent = (
                <Issuer
                    account={account}
                    generateAccount={generateAccount}
                    setSubject={setSubject}
                    setIssuer={setIssuer}
                    setDob={setDob}
                    setExpiration={setExpiration}
                    generateSignature={generateSignature}
                    loading={loading}
                    advanceStep={advanceStep}    
                    setVerified={setVerified}            
                />
            );
            break;
        case 2:
        renderedComponent = (
            <Request
                account={account}
                loading={loading}
                subject={subject}
                dob={dob}
                expiration={expiration}
                advanceStep={advanceStep}
                backStep={backStep}
            />
        );
        break;
        case 3:
            renderedComponent = (
                <Holder
                    account={account}
                    loading={loading}
                    issuer={issuer}
                    subject={subject}
                    dob={dob}
                    expiration={expiration}
                    signature={signature}
                    verified={verified}
                    execute={execute}
                    advanceStep={advanceStep}
                    backStep={backStep}
                />
            );
            break;
            case 4:
            renderedComponent = (
                <Verifier
                account={account}
                loading={loading}
                subject={subject}
                result={result}
                verified={verified} 
                execute={execute}
                advanceStep={advanceStep}
                backStep={backStep}
            />
            );
            break;
        
        default:
            renderedComponent = <div>Completed</div>;
            break;
    }

    return (
        <div className="container">
            <h1 className="centered-title">zPass Flow</h1>
            {renderedComponent}
        </div>
    );
}

export default App;