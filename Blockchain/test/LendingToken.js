const { expect } = require("chai");
const hre = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

let interestRateNumerator = 2;
let interestRateDenominator = 100;
let extendedRateNumerator = 4;
let extendedRateDenominator = 100;
let earlyRateNumerator = 6;
let earlyRateDenominator = 100;

let nftTokenId = 1;
let loanAmount = 50;
let loanDuaration = 0;

let amountLending = 90;
let amountBorrower = 10;
describe("LendingToken", function () {
  async function deployTokenFixture() {
    [owner, addr1] = await ethers.getSigners();

    //token A
    const Token = await ethers.getContractFactory("TokenERC20");
    token = await Token.deploy("TokenA", "A");
    await token.deployed();
    //console.log(await token.name());

    //NFT
    const NFT = await ethers.getContractFactory("TokenERC721");
    nft = await NFT.connect(addr1).deploy("NFT", "NFT");
    await nft.deployed();

    //lending token
    const LendingToken = await ethers.getContractFactory("LendingToken");
    lendingToken = await LendingToken.deploy();
    await lendingToken.deployed();
    await lendingToken.setTime(loanDuaration);

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

    //address take a loan (accpect)
    //await lendingToken.takeALoan(nft.address, nftTokenId, 1);

    // Fixtures can return anything you consider useful for your tests
    return { token, nft, lendingToken, owner, addr1 };
  }

  // describe("Deployment", function () {
  //   it("Should set the right owner, nft", async function () {
  //     const { lendingToken, owner, token } = await loadFixture(deployTokenFixture);
  //     expect(await lendingToken.owner()).to.equal(owner.address);
  //     expect(await nft.ownerOf(nftTokenId)).to.equal(addr1.address);
  //     console.log(await token.decimals());
  //   });
  // it("deposit successflly", async function () {
  //   const { lendingToken, owner, token, addr1 } = await loadFixture(deployTokenFixture);
  //   token.approve(lendingToken.address, amountLending);
  //   await lendingToken.deposit(token.address, amountLending);
  //   expect(await token.balanceOf(lendingToken.address)).to.equal(amountLending);

  //   await token.transfer(addr1.address, amountBorrower);
  //   expect(await token.balanceOf(addr1.address)).to.equal(amountBorrower);
  // });
  //});

  //   describe("AddToken", function () {
  //     it("add token successfully", async function () {
  //       const { token, nft, lendingToken, owner, addr1 } = await loadFixture(
  //         deployTokenFixture
  //       );
  //       await expect(
  //         lendingToken.addToken(
  //           token.address,
  //           interestRateNumerator,
  //           interestRateDenominator,
  //           extendedRateNumerator,
  //           extendedRateDenominator,
  //           earlyRateNumerator,
  //           earlyRateDenominator
  //         )
  //       )
  //         .to.be.emit(lendingToken, "AddTokenRate")
  //         .withArgs(
  //           token.address,
  //           interestRateNumerator,
  //           interestRateDenominator,
  //           extendedRateNumerator,
  //           extendedRateDenominator,
  //           earlyRateNumerator,
  //           earlyRateDenominator
  //         );
  //       console.log(await lendingToken.listingsToken(token.address));
  //     });
  //   });

  //   describe("UpdateToken", function () {
  //     it("update token successfully", async function () {
  //       const { token, nft, lendingToken, owner, addr1 } = await loadFixture(
  //         deployTokenFixture
  //       );
  //       await expect(
  //         lendingToken.updateToken(
  //           token.address,
  //           3,
  //           interestRateDenominator,
  //           extendedRateNumerator,
  //           extendedRateDenominator,
  //           earlyRateNumerator,
  //           earlyRateDenominator
  //         )
  //       )
  //         .to.be.emit(lendingToken, "UpdateTokenRate")
  //         .withArgs(
  //           token.address,
  //           3,
  //           interestRateDenominator,
  //           extendedRateNumerator,
  //           extendedRateDenominator,
  //           earlyRateNumerator,
  //           earlyRateDenominator
  //         );
  //       console.log(await lendingToken.listingsToken(token.address));
  //     });
  //   });

  describe("request loan", function () {
    it("request loan successfully", async function () {
      const { token, nft, lendingToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      //await nft.connect(addr1).approve(lendingToken.address, nftTokenId);
      // const loanRequest = await lendingToken
      //   .connect(addr1)
      //   .requestLoan(
      //     nft.address,
      //     nftTokenId,
      //     token.address,
      //     loanAmount,
      //     loanDuaration
      //   );
      // missing
      //await lendingToken.connect(addr1).missedPayment(nft.address, nftTokenId);
      // let loanId = await lendingToken.getLoanId(nft.address, nftTokenId);
      // let loanAgreement = await lendingToken.getLoanAgreement(
      //   nft.address,
      //   nftTokenId
      // );
      // console.log(loanAgreement);

      // await expect(loanRequest)
      //   .to.be.emit(lendingToken, "LoanRequest")
      //   .withArgs(
      //     loanId,
      //     addr1.address,
      //     nft.address,
      //     nftTokenId,
      //     token.address,
      //     loanAmount,
      //     loanAgreement.payoffAmount.toNumber(),
      //     loanDuaration,
      //     loanAgreement.state,
      //     loanAgreement.createdAt.toNumber()
      //   );
    });
  });

  //  describe("Take a loan", function () {
  // it("Take loan successfully", async function () {
  //   const { token, nft, lendingToken, owner, addr1 } = await loadFixture(
  //     deployTokenFixture
  //   );
  //   await lendingToken.takeALoan(nft.address, nftTokenId, 2);
  //   expect(await token.balanceOf(addr1.address)).to.equal(amountBorrower + loanAmount);
  //   expect(await token.balanceOf(lendingToken.address)).to.equal(amountLending - loanAmount);
  //   expect(await nft.ownerOf(nftTokenId)).to.equal(lendingToken.address);
  // });

  //   it("reject a loan", async function () {
  //     const { token, nft, lendingToken, owner, addr1 } = await loadFixture(
  //       deployTokenFixture
  //     );
  //     await lendingToken.takeALoan(nft.address, nftTokenId, 1);
  //     expect(await token.balanceOf(addr1.address)).to.equal(amountBorrower);
  //     expect(await token.balanceOf(lendingToken.address)).to.equal(
  //       amountLending
  //     );
  //     expect(await nft.ownerOf(nftTokenId)).to.equal(addr1.address);
  //   });
  // });

  // describe("Repay a loan", function () {
  //   it("repay successfully", async function () {
  //     const { token, nft, lendingToken, owner, addr1 } = await loadFixture(
  //       deployTokenFixture
  //     );

  //     await token.connect(addr1).approve(lendingToken.address, 51);
  //     await lendingToken.connect(addr1).repayLoan(nft.address, nftTokenId);
  //     expect(await nft.ownerOf(nftTokenId)).to.equal(addr1.address);
  //     expect(await token.balanceOf(addr1.address)).to.equal(9);
  //     expect(await token.balanceOf(lendingToken.address)).to.equal(91);
  //   });
  // });

  // describe("Liquidate a loan", function () {
  //   it("liquidate successfully", async function () {
  //     const { token, nft, lendingToken, owner, addr1 } = await loadFixture(
  //       deployTokenFixture
  //     );
  //     await lendingToken.connect(addr1).missedPayment(nft.address, nftTokenId);
  //     await lendingToken.liquidate(nft.address, nftTokenId);
  //     expect(await nft.ownerOf(nftTokenId)).to.equal(owner.address);
  //   });
  // });

  // describe("Extend a loan", function () {
  //   it("extend successfully", async function () {
  //     const { token, nft, lendingToken, owner, addr1 } = await loadFixture(
  //       deployTokenFixture
  //     );
  //     await token.connect(addr1).approve(lendingToken.address, 2);
  //     await lendingToken.connect(addr1).extendLoan(nft.address, nftTokenId, 30);
  //     expect(await token.balanceOf(addr1.address)).to.equal(58);
  //     expect(await nft.ownerOf(nftTokenId)).to.equal(lendingToken.address);
  //     let loan = await lendingToken.getLoanAgreement(nft.address, nftTokenId);
  //     console.log(loan);
  //   });
  // });

  //   describe("Repay a loan", function () {
  //   it("repaied early successfully", async function () {
  //     const { token, nft, lendingToken, owner, addr1 } = await loadFixture(
  //       deployTokenFixture
  //     );
  //     await token.connect(addr1).approve(lendingToken.address, 3 + 51);
  //     await lendingToken.connect(addr1).repaiedEarly(nft.address, nftTokenId);
  //      expect(await token.balanceOf(addr1.address)).to.equal(6);
  //      expect(await nft.ownerOf(nftTokenId)).to.equal(addr1.address);
  //      let loan = await lendingToken.getLoanAgreement(nft.address, nftTokenId);
  //      console.log(loan);
  //   });
  // });
});
