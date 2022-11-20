import { TokenERC721 } from "../../generated/LendingToken/TokenERC721";
import { TokenERC20 } from "../../generated/LendingToken/TokenERC20";
import { Address } from "@graphprotocol/graph-ts";
import { NFT } from "../../generated/schema";

const CONTRACT_ADDRESS = Address.fromString(
    "0x8464135c8F25Da09e49BC8782676a84730C318bC"
  );

/* Returns an SuperRare V2 ERC721 contract instance. */
export function getERC721Instance(address: string): TokenERC721 {
  return TokenERC721.bind(Address.fromString(
    address
  ));
}

export function getERC20Instance(address: string): TokenERC20 {
  return TokenERC20.bind(Address.fromString(
    address
  ));
}

// export function getContract(): NFT {
//     let contract = NFT.load(CONTRACT_ADDRESS.toHexString());
//     if (contract === null) {
//       contract = contracts.create(
//         sr2Constants.CONTRACT_ADDRESS,
//         sr2Constants.CONTRACT_URI,
//         sr2Constants.CONTRACT_NAME,
//         sr2Constants.CONTRACT_SYMBOL,
//         sr2Constants.CONTRACT_METADATA
//       );
//     }
  
//     return contract as Contract;
//   }

