import { setGlobalState, getGlobalState, setAlert } from "./store";
import LendingToken from "./abis/LendingToken.json";
import TokenERC721 from "./abis/TokenERC721.json";
import TokenERC20 from "./abis/TokenERC20.json";
import { bool } from "yup";
const { ethereum } = window;
const { ethers } = require("ethers");

const CONTRACT_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      console.log("please install MetaMask");
      return;
    }
    if (!ethereum) return alert("Please install Metamask");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setGlobalState("connectedAccount", accounts);
  } catch (error) {
    setAlert(JSON.stringify(error), "red");
  }
};

const onAccountChange = async() => {

  ethereum.on('accountsChanged', (accounts) => {
    if(accounts.length > 0)
    setGlobalState("connectedAccount", accounts[0]);
    console.log("fs: ", accounts[0]);
    if(accounts[0] != "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){
      setGlobalState("isAdmin", false);
    }
    else {
      setGlobalState("isAdmin", true);
    }
  });

}


const loadWeb3 = async () => {
  try {
    if (!window.ethereum) {
      console.log("please install MetaMask");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    setGlobalState("signer", signer);
    let userAddress = await signer.getAddress();
    //console.log({userAddress});
    if(userAddress == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){
      setGlobalState("isAdmin", true);
    }

    ethereum.on('accountsChanged', (accounts) => {
      if(accounts.length > 0)
      setGlobalState("connectedAccount", accounts[0]);
      //console.log("fs: ", accounts[0]);
      if(userAddress != "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){
        setGlobalState("isAdmin", false);
      }
      else setGlobalState("isAdmin", true);
    });
  
    setGlobalState("connectedAccount", userAddress);

    const { chainId } = await provider.getNetwork();
    

    if (chainId === 31337) {
      const contract = new ethers.Contract(
        CONTRACT_ADDR,
        LendingToken,
        provider
      );
      setGlobalState("contract", contract);
      setGlobalState("provider", provider);
      const duration = await contract.connect(signer).TIME_DURATION();
      setGlobalState("duration", parseInt(duration, 10));
    } else {
      window.alert("Contract not deployed to detected network.");
    }
  } catch (error) {
    alert("Please connect your metamask wallet!");
  }
};

const requestLoan = async (nft, tokenId, loan, tokenAddr, duration) => {
  try {
    const contract = getGlobalState("contract");

    const signer = getGlobalState("signer");
    console.log(loan);
    const provider = getGlobalState("provider");
    const nft_contract = new ethers.Contract(nft, TokenERC721, provider);
    await nft_contract.connect(signer).approve(CONTRACT_ADDR, tokenId);
    await contract
      .connect(signer)
      .requestLoan(nft, tokenId, tokenAddr, loan, duration);

    return true;
  } catch (error) {
    alert(error.message);
  }
};

const updateToken = async (
  tokenAddr,
  interestNum,
  interestDe,
  extendedNum,
  extendedDe,
  earlyNum,
  earlyDe
) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    console.log(interestNum);
    await contract
      .connect(signer)
      .updateToken(
        tokenAddr,
        interestNum,
        interestDe,
        extendedNum,
        extendedDe,
        earlyNum,
        earlyDe
      );

    return true;
  } catch (error) {
    alert(error.message);
  }
};

const addToken = async (
  tokenAddr,
  interestNum,
  interestDe,
  extendedNum,
  extendedDe,
  earlyNum,
  earlyDe
) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    await contract
      .connect(signer)
      .addToken(
        tokenAddr,
        interestNum,
        interestDe,
        extendedNum,
        extendedDe,
        earlyNum,
        earlyDe
      );

    return true;
  } catch (error) {
    alert(error.message);
  }
};

const deposit = async (token, amount) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    const provider = getGlobalState("provider");

    const token_contract = new ethers.Contract(token, TokenERC20, provider);
    await token_contract.connect(signer).approve(CONTRACT_ADDR, amount);

    await contract.connect(signer).deposit(token, amount);
    alert("success");
    return true;
  } catch (error) {
    alert(error.message);
  }
};

const withdraw = async (token, amount) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");

    await contract.connect(signer).withdraw(token, amount);
    alert("success");
    return true;
  } catch (error) {
    alert(error.message);
  }
};

const takeALoan = async (nft, tokenId, state) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    await contract.connect(signer).takeALoan(nft, tokenId, state);
    alert("success");
    return true;
  } catch (error) {
    alert(error.message);
  }
};

const getNft = async (address, tokenId) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    const provider = getGlobalState("provider");
    const nft_contract = new ethers.Contract(address, TokenERC721, provider);
    const metaData = await nft_contract.connect(signer).tokenURI(tokenId);
    const jsonData = await fetch(metaData);
    const data = await jsonData.json();
    const imgUrl = data["image"];
    const title = data["name"];
    const description = data["description"];

    return { title, description, imgUrl };
  } catch (error) {
    alert(error.message);
  }
};


const getToken = async (address, decimal) => {
  try {
    //const signer = getGlobalState("signer");
    const provider = getGlobalState("provider");
    const token_contract = new ethers.Contract(address, TokenERC20, provider);
    const balance = await token_contract.balanceOf(CONTRACT_ADDR);
    return ethers.utils.formatUnits(balance, decimal)
  } catch (error) {
    alert(error.message);
  }
};

const repayLoan = async (token, nft, tokenId, payoffAmount) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    const provider = getGlobalState("provider");
    const token_contract = new ethers.Contract(token, TokenERC20, provider);
    await token_contract.connect(signer).approve(CONTRACT_ADDR, payoffAmount);
    await contract.connect(signer).repayLoan(nft, tokenId);
    alert("success");
    return true;
  } catch (error) {
    alert(error.message);
  }
};

const repaiedEarly = async (token, nft, tokenId, payoffAmount) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    const provider = getGlobalState("provider");
    const token_contract = new ethers.Contract(token, TokenERC20, provider);
    await token_contract.connect(signer).approve(CONTRACT_ADDR, payoffAmount);
    await contract.connect(signer).repaiedEarly(nft, tokenId);
    alert("success");
    return true;
  } catch (error) {
    alert(error.message);
  }
}

const extendLoan = async (nft, tokenId, extendedDuration, loan, token, num, de, decimal) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    const provider = getGlobalState("provider");
    const fee = ethers.utils.formatUnits(await contract.connect(signer).calculateFee(loan, num, de), decimal);
   
    const token_contract = new ethers.Contract(token, TokenERC20, provider);
    await token_contract.connect(signer).approve(CONTRACT_ADDR, ethers.utils.parseUnits(fee, decimal));
    await contract.connect(signer).extendLoan(nft, tokenId, extendedDuration);
    alert("success");
    return true;
  } catch (error) {
    alert(error.message);
  }
};

const checkLoan = async (nft, tokenId) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    await contract.connect(signer).missedPayment(nft, tokenId);
  } catch (error) {
    alert(error.message);
  }
}

const liquidate = async (nft, tokenId) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    await contract.connect(signer).liquidate(nft, tokenId);
    alert("success");
  } catch (error) {
    alert(error.message);
  }
}

const calculateFee = async (loan, num, de) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    const fee = await contract.connect(signer).calculateFee(loan, num, de);
    return fee;
  } catch (error) {
    alert(error.message);
  }
}

const calculateTotal = async (loan, num, de) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    const fee = await contract.connect(signer).calculateTotal(loan, num, de);
    return fee;
  } catch (error) {
    alert(error.message);
  }
}

const changeDuration = async (duration) => {
  try {
    const contract = getGlobalState("contract");
    const signer = getGlobalState("signer");
    await contract.connect(signer).setTime(duration);
    alert("success")
    return true;
  } catch (error) {
    alert(error.message);
  }
}

export {
  connectWallet,
  onAccountChange,
  loadWeb3,
  requestLoan,
  addToken,
  updateToken,
  deposit,
  withdraw,
  takeALoan,
  repayLoan,
  repaiedEarly,
  extendLoan,
  checkLoan,
  liquidate,
  calculateFee,
  calculateTotal,
  getNft,
  getToken,
  changeDuration
};
