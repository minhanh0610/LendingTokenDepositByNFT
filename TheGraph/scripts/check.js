const loanDuaration = 1
async function main() {
    // Our code will go here
    const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const LendingToken = await ethers.getContractFactory("LendingToken");
    const lendingToken = await LendingToken.attach(address);
  
    [owner, addr1, addr2] = await ethers.getSigners();

    const nft_addr = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
    const NFT = await ethers.getContractFactory("TokenERC721");
    const nft = await NFT.attach(nft_addr);

    await lendingToken.setTime(loanDuaration);
    console.log("Time duration: ", await lendingToken.TIME_DURATION());
}  


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});