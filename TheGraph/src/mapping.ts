import {
  AddTokenRate,
  UpdateTokenRate,
  LoanRequest,
  LoanAcceptedOrRejected,
  LoanRepaied,
  LoanExtension,
  LoanRepaiedEarly,
  LoanLiquidate
} from "../generated/LendingToken/LendingToken";
import { Token, Loan, Borrower, NFT } from "../generated/schema";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { getERC721Instance, getERC20Instance} from "./utils/contract";

/*
 * Mint event handler
 *
 * Appends a new NFT to the subgraph.
 * The contract entity is created at the first token's minting.
 */
// export function mint(
//   tokenId: BigInt
// ): NFT {
//   /* Define the minting details from the Minted event. */
//   let erc721 = getERC721Instance();
//   let tokenURI = erc721.tokenURI(tokenId)

//   /* Load the contract instance (create if undefined). */

//   const CONTRACT_ADDRESS = Address.fromString(
//     "0x8464135c8F25Da09e49BC8782676a84730C318bC"
//   );
//   let baseURI = "http://localhost:5002/ipfs/QmcWqMHe1gSsQwRkvUzkPEfyDB1prhE3fJHAjar6cYu4TP"
//     let nft = new NFT(CONTRACT_ADDRESS.toHex() + "." + tokenId.toHex() );
//     nft.address = CONTRACT_ADDRESS;
//     nft.tokenId = tokenId

//     //nft.nft.tokenURI(tokenId);
//     nft.save()

//     return nft ;

//   }
  
// export function addToken(test: string) : void {
//     const CONTRACT_ADDRESS = Address.fromString(
//     "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"
//   );
//   let token = new Token(CONTRACT_ADDRESS);
//   token.test = test;
//   token.symbol= "TKC"
//   token.decimal =  18;
//   token.interestRateNumerator = new BigInt(5);
//   token.interestRateDenominator = new BigInt(100);
//   token.extendedRateNumerator = new BigInt(5);
//   token.extendedRateDenominator = new BigInt(100);
//   token.earlyRateNumerator = new BigInt(5);
//   token.earlyRateDenominator = new BigInt(100);
//   token.save();
// }


export function handleAddTokenRate(event: AddTokenRate): void {
  let token = new Token(event.params.token);
  let erc20 = getERC20Instance(event.params.token.toHexString());
  //token.symbol = event.params.symbol;
  token.symbol = erc20.symbol();
  token.test = erc20.name() +":   " +  erc20.symbol();
  token.decimal =  event.params.decimals;
  token.interestRateNumerator = event.params.interestRateNumerator;
  token.interestRateDenominator = event.params.interestRateDenominator;
  token.extendedRateNumerator = event.params.extendedRateNumerator;
  token.extendedRateDenominator = event.params.extendedRateDenominator;
  token.earlyRateNumerator = event.params.earlyRateNumerator;
  token.earlyRateDenominator = event.params.earlyRateDenominator;
  token.save();
}

export function handleUpdateTokenRate(event: UpdateTokenRate): void {
  let token = Token.load(event.params.tokenAddr);
  if (!token) return;
  token.interestRateNumerator = event.params.interestRateNumerator;
  token.interestRateDenominator = event.params.interestRateDenominator;
  token.extendedRateNumerator = event.params.extendedRateNumerator;
  token.extendedRateDenominator = event.params.extendedRateDenominator;
  token.earlyRateNumerator = event.params.earlyRateNumerator;
  token.earlyRateDenominator = event.params.earlyRateDenominator;
  token.save();
}

export function handleLoanRequest(event: LoanRequest): void{
  let loan = new Loan(event.params.loanId.toHex());
  if(Borrower.load(event.params.borrower) == null){
    let borrower = new Borrower(event.params.borrower);
    borrower.save();
  }
  loan.borrower = event.params.borrower;
  //nft
  loan.nft = event.params.nft.toHex() + "." + event.params.nftTokenId.toHex();
  if(NFT.load(loan.nft) == null){
    let nft = new NFT(loan.nft)
    nft.address = event.params.nft;
    nft.tokenId = event.params.nftTokenId;
    // append to subgraphs
    let erc721 = getERC721Instance(event.params.nft.toHexString());
    nft.tokenUri = erc721.tokenURI(event.params.nftTokenId);
    nft.save()

  }
  //token
  loan.token = event.params.tokenAddr;
  loan.loanAmount = event.params.loanAmount;
  loan.payoffAmount = event.params.payoffAmount;
  loan.loanDuration = event.params.loanDuration;
  loan.state = event.params.state;
  loan.createdAt = event.params.createdAt;
  loan.save();
}

export function handleLoanAcceptedOrRejected(event: LoanAcceptedOrRejected): void{
  let loan = Loan.load(event.params.loanId.toHex());
  if(!loan) return
  loan.state = event.params.state;
  loan.startDate = event.params.startDate;
  loan.dueDate = event.params.dueDate;
  loan.save();
}

export function handleLoanRepaied(event: LoanRepaied): void{
  let loan = Loan.load(event.params.loanId.toHex());
  if(!loan) return
  loan.state = event.params.state;
  loan.repaiedAt = event.params.repaiedAt;
  loan.save();
}

// export function handlePaymentMissing(event: PaymentMissing): void{
//   let loan = Loan.load(event.params.loanId.toHex());
//   if(!loan) return
//   loan.state = event.params.state;
//   loan.save();
// }

export function handleLoanLiquidate(event: LoanLiquidate): void{
  let loan = Loan.load(event.params.loanId.toHex());
  if(!loan) return
  loan.state = event.params.state;
  loan.liquidateAt = event.params.currentTime;
  loan.save();
}


export function handleLoanExtension(event: LoanExtension): void{
  let loan = Loan.load(event.params.loanId.toHex());
  if(!loan) return
  loan.extendedAt = event.params.extendedAt;
  loan.extendedDuration = event.params.extendedDuration;
  loan.extendedFee = event.params.extendFee;
  loan.dueDate = event.params.dueDate;
  loan.save();
}

export function handleLoanRepaiedEarly(event: LoanRepaiedEarly): void{
  let loan = Loan.load(event.params.loanId.toHex());
  if(!loan) return
  loan.state = event.params.state;
  loan.repaiedEarlyAt = event.params.repaiedEarlyAt;
  loan.repaiedEarlyFee = event.params.repaiedEarlyFee;
  loan.save();
}



