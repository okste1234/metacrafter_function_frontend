import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../artifacts/contracts/FrontendAssessment.sol/FrontendAssessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [details, setDetails] = useState(undefined);
  const [val, setVal] = useState();
  const [desc, setDesc] = useState("");

  const contractAddress = "0x3daB6bD5062D5091E7F13857D63deDe08cBE788F";
  const ABI = abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }
  };

  const handleAccount = async () => {
    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        console.log("Account connected: ", accounts[0]);
        setAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
      getAssessmentContract();
    } catch (error) {
      console.error("Error connecting account:", error);
    }
  };

  const getAssessmentContract = () => {
    if (ethWallet) {
      const provider = new ethers.providers.Web3Provider(ethWallet);
      const signer = provider.getSigner();
      const AssessmentContract = new ethers.Contract(contractAddress, ABI, signer);
      setContract(AssessmentContract);
    }
  };

  const getNumData = async () => {
    try {
      if (contract) {
        const numData = await contract.getNumber();
        setData(numData.toNumber());
      }
    } catch (error) {
      console.error("Error fetching number data:", error);
    }
  };

  const getStringData = async () => {
    try {
      if (contract) {
        const stringData = await contract.getString();
        setDetails(stringData);
      }
    } catch (error) {
      console.error("Error fetching string data:", error);
    }
  };

  const setNumber = async (value) => {
    try {
      if (contract) {
        const tx = await contract.setNumber(value);
        await tx.wait();
        getNumData();
      }
    } catch (error) {
      console.error("Error setting number:", error);
    }
  };

  const setString = async (value) => {
    try {
      if (contract) {
        const tx = await contract.setString(value);
        await tx.wait();
        getStringData();
      }
    } catch (error) {
      console.error("Error setting string:", error);
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return (
        <div className="info">
          <p>Please install MetaMask in order to use this dApp.</p>
        </div>
      );
    }

    if (!account) {
      return (
        <div className="info">
          <button onClick={connectAccount}>Connect Wallet</button>
        </div>
      );
    }

    return (
      <div className="user">
        <p className="account">User's Account: {account}</p>
        <div className="balance">
          <p>Your Value: {data}</p>
          <p>Your String Details: {details}</p>
        </div>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="inputs">
            <input className="input" placeholder="Enter  number value" value={val} onChange={(e) => setVal(e.target.value)} />
            <button className="button" type="button" onClick={() => setNumber(val)}>Set Value Data</button>
          </div>
          <div className="inputs">
            <input className="input" placeholder="Enter text description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <button className="button" type="button" onClick={() => setString(desc)}>Add Data Details</button>
          </div>
        </form>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
    handleAccount();
  }, []);

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">User Defined Data!</h1>
      </header>
      {initUser()}
      <style>{`
        .container {
          text-align: center;
          padding: 10px;
          background-color: #f8f9fa;
          margin: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 80vh;
          width: 80%;
        }

        .header {
          margin-bottom: 10px;
        }

        .title {
          font-size: 2rem;
          color: #333;
        }

        .info {
          margin-bottom: 20px;
        }

        .info button {
          padding: 10px 20px;
          font-size: 1rem;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .user {
          margin-bottom: 40px;
        }

        .account {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .balance p {
          font-size: 1rem;
          margin-bottom: 5px;
        }

        .form {
          margin-top: 20px;
        }

        .inputs {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .input {
          padding: 8px;
          margin-right: 20px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .button {
          padding: 10px 20px;
          font-size: 1rem;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}
      </style>
    </main>
  );
}
