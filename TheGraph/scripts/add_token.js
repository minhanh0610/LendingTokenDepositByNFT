const hre = require("hardhat");
let interestRateNumerator = 200;
let interestRateDenominator = 10000;
let extendedRateNumerator = 300;
let extendedRateDenominator = 10000;
let earlyRateNumerator = 400;
let earlyRateDenominator = 10000;

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
  const tokenA_addr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const TokenA = await ethers.getContractFactory("TokenERC20");
  const tokenA = await TokenA.attach(tokenA_addr);

  await lendingToken.addToken(
    tokenA.address,
    interestRateNumerator,
    interestRateDenominator,
    extendedRateNumerator,
    extendedRateDenominator,
    earlyRateNumerator,
    earlyRateDenominator
  );

  //token B
  const tokenB_addr = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const TokenB = await ethers.getContractFactory("TokenERC20");
  const tokenB = await TokenB.attach(tokenB_addr);

  await lendingToken.addToken(
    tokenB.address,
    interestRateNumerator,
    interestRateDenominator,
    extendedRateNumerator,
    extendedRateDenominator,
    earlyRateNumerator,
    earlyRateDenominator
  );

   //deposit & withdraw token
   await tokenA.approve(lendingToken.address, ethers.utils.parseUnits("2000", 18));
   await lendingToken.deposit(tokenA.address, ethers.utils.parseUnits("2000", 18));
   await tokenB.approve(lendingToken.address, ethers.utils.parseUnits("2000", 18));
   await lendingToken.deposit(tokenB.address, ethers.utils.parseUnits("2000", 18));

   //borrower request a loan
  //  const address_nft = " 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
  //  const NFT = await ethers.getContractFactory("TokenERC721");
  //  const nft = await NFT.attach(address_nft);
  //  await nft.connect(addr1).approve(nft.address, nftTokenId);
  //  await lendingToken
  //    .connect(addr1)
  //    .requestLoan(
  //      nft.address,
  //      nftTokenId,
  //      token.address,
  //      loanAmount,
  //      loanDuaration
  //    );


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
