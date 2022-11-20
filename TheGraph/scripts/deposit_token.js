const hre = require("hardhat");
let interestRateNumerator = 2;
let interestRateDenominator = 100;
let extendedRateNumerator = 4;
let extendedRateDenominator = 100;
let earlyRateNumerator = 6;
let earlyRateDenominator = 100;

let nftTokenId = 1;
let loanAmount = 50;
let loanDuaration = 1;

let amountLending = 90;
let amountBorrower = 10;
async function main() {
  // Our code will go here
  const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const LendingToken = await ethers.getContractFactory("LendingToken");
  const lendingToken = await LendingToken.attach(address);

  [owner, addr1] = await ethers.getSigners();

  //token A
  const Token = await ethers.getContractFactory("TokenERC20");
  token = await Token.deploy("TokenB", "TKB");
  await token.deployed();
  console.log("token deploy to ", token.address);

  //NFT
  const address_nft = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
  const Nft = await ethers.getContractFactory("TokenERC721");
  const nft = await Nft.attach(address_nft);
//   const NFT = await ethers.getContractFactory("TokenERC721");
//   nft = await NFT.connect(addr1).deploy("NFT", "NFT");
//   await nft.deployed();
//   console.log("nft deploy to ", nft.address);

  await lendingToken.addToken(
    token.address,
    interestRateNumerator,
    interestRateDenominator,
    extendedRateNumerator,
    extendedRateDenominator,
    earlyRateNumerator,
    earlyRateDenominator
  );

   //deposit & withdraw token
   token.approve(lendingToken.address, amountLending);
   await lendingToken.deposit(token.address, amountLending);
   await token.transfer(addr1.address, amountBorrower);

   //borrower request a loan
   await nft.connect(addr1).approve(lendingToken.address, nftTokenId);
   await lendingToken
     .connect(addr1)
     .requestLoan(
       nft.address,
       nftTokenId,
       token.address,
       loanAmount,
       loanDuaration
     );
    
    


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
