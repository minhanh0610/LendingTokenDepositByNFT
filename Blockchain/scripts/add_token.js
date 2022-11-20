const hre = require("hardhat");
let interestRateNumerator = 2;
let interestRateDenominator = 100;
let extendedRateNumerator = 2;
let extendedRateDenominator = 100;
let earlyRateNumerator = 2;
let earlyRateDenominator = 100;

let nftTokenId = 1;
let loanAmount = 50;
let loanDuaration = 0;

let amountLending = 90;
let amountBorrower = 10;
async function main() {
  // Our code will go here
  const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const LendingToken = await ethers.getContractFactory("LendingToken");
  const lendingToken = await LendingToken.attach(address);

  [owner, addr1] = await ethers.getSigners();

  //token A
  const tokenA_addr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const TokenA = await ethers.getContractFactory("TokenERC20");
  const tokenA = await TokenA.attach(tokenA_addr);

  //nft
  const nft_addr = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
    const NFT = await ethers.getContractFactory("TokenERC721");
    const nft = await NFT.attach(nft_addr);

  await lendingToken.addToken(
    tokenA.address,
    interestRateNumerator,
    interestRateDenominator,
    extendedRateNumerator,
    extendedRateDenominator,
    earlyRateNumerator,
    earlyRateDenominator
  );

   //deposit & withdraw token
  //  token.approve(lendingToken.address, amountLending);
  //  await lendingToken.deposit(token.address, amountLending);
  //  await token.transfer(addr1.address, amountBorrower);

   //borrower request a loan
   await nft.connect(addr1).approve(lendingToken.address, nftTokenId);
   await lendingToken
     .connect(addr1)
     .requestLoan(
       nft.address,
       nftTokenId,
       tokenA.address,
       loanAmount,
       loanDuaration
     );
    
     await lendingToken
     .connect(addr1)
     .missedPayment(
       nft.address,
       nftTokenId)

      console.log(await lendingToken.loanAgreements(1));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
