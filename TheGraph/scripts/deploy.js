const hre = require("hardhat");

let loanDuaration = 1;


let baseURI = "http://localhost:5002/ipfs/QmcWqMHe1gSsQwRkvUzkPEfyDB1prhE3fJHAjar6cYu4TP"
async function main(){
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    console.log("Owner: ", owner.address);
    console.log("addr1: ", addr1.address);
    console.log("addr2: ", addr2.address);
    console.log("addr3: ", addr3.address);

    //lending token
    const LendingToken = await ethers.getContractFactory("LendingToken");
    lendingToken = await LendingToken.deploy();
    await lendingToken.deployed();
    
    console.log("LendingToken deploy to ", lendingToken.address);

    //token A
    const Token = await ethers.getContractFactory("TokenERC20");
    tokenA = await Token.deploy("TokenA", "TKA");
    await tokenA.deployed();
    await tokenA.transfer(addr1.address, ethers.utils.parseUnits("2000", 18));
    //console.log("balance of addr1: ", await tokenA.balanceOf(addr1.address));
    await tokenA.transfer(addr2.address, ethers.utils.parseUnits("2000", 18));
    await tokenA.transfer(addr3.address, ethers.utils.parseUnits("2000", 18));
    console.log("tokenA deploy to ", tokenA.address);
    //token B
    tokenB = await Token.deploy("TokenB", "TKB");
    await tokenB.deployed();
    await tokenB.transfer(addr1.address, ethers.utils.parseUnits("2000", 18));
    await tokenB.transfer(addr2.address, ethers.utils.parseUnits("2000", 18));
    await tokenB.transfer(addr3.address, ethers.utils.parseUnits("2000", 18));
    console.log("tokenB deploy to ", tokenB.address);
    //token C
    tokenC = await Token.deploy("TokenC", "TKC");
    await tokenC.deployed();
    await tokenC.transfer(addr1.address, ethers.utils.parseUnits("2000", 18));
    await tokenC.transfer(addr2.address, ethers.utils.parseUnits("2000", 18));
    await tokenC.transfer(addr3.address, ethers.utils.parseUnits("2000", 18));
    console.log("tokenC deploy to ", tokenC.address);

    //NFT
    const NFT = await ethers.getContractFactory("TokenERC721");
    nft = await NFT.connect(addr1).deploy("NFT", "NFT");
    await nft.deployed();
    console.log("nft deploy to ", nft.address);
    await nft.connect(addr1).setBaseURI(baseURI);
    //nft tokenId 1->3 : address1
     await nft.connect(addr1).claimItem("");
    tokenId = await nft.totalSupply();
    tokenUri = await nft.tokenURI(tokenId);
    console.log(`nft ${tokenId} has tokenURI: ${tokenUri}`);

    // //nft2
    await nft.connect(addr1).claimItem("");
    tokenId = await nft.totalSupply();
    tokenUri = await nft.tokenURI(tokenId);
    console.log(`nft ${tokenId} has tokenURI: ${tokenUri}`);

    // //nft3
    await nft.connect(addr1).claimItem("");
    tokenId = await nft.totalSupply();
    tokenUri = await nft.tokenURI(tokenId);
    console.log(`nft ${tokenId} has tokenURI: ${tokenUri}`);

    //nft tokenId 4->6 : address2
    await nft.connect(addr2).claimItem("");
    tokenId = await nft.totalSupply();
    tokenUri = await nft.tokenURI(tokenId);
    console.log(`nft ${tokenId} has tokenURI: ${tokenUri}`);

    // //nft5
    await nft.connect(addr2).claimItem("");
    tokenId = await nft.totalSupply();
    tokenUri = await nft.tokenURI(tokenId);
    console.log(`nft ${tokenId} has tokenURI: ${tokenUri}`);

    // //nft6
    await nft.connect(addr2).claimItem("");
    tokenId = await nft.totalSupply();
    tokenUri = await nft.tokenURI(tokenId);
    console.log(`nft ${tokenId} has tokenURI: ${tokenUri}`);

    //nft tokenId 7->9 : address3
    await nft.connect(addr3).claimItem("");
    tokenId = await nft.totalSupply();
    tokenUri = await nft.tokenURI(tokenId);
    console.log(`nft ${tokenId} has tokenURI: ${tokenUri}`);

    // //nft5
    await nft.connect(addr3).claimItem("");
    tokenId = await nft.totalSupply();
    tokenUri = await nft.tokenURI(tokenId);
    console.log(`nft ${tokenId} has tokenURI: ${tokenUri}`);

    // //nft6
    await nft.connect(addr3).claimItem("");
    tokenId = await nft.totalSupply();
    tokenUri = await nft.tokenURI(tokenId);
    console.log(`nft ${tokenId} has tokenURI: ${tokenUri}`);

    //set time
    await lendingToken.setTime(loanDuaration);
    console.log("Time duration: ", await lendingToken.TIME_DURATION());
    //add token
    console.log("calculate fee: ", await lendingToken.calculateFee(102000, 2, 100));

    // await lendingToken.addToken(
    //     tokenA.address,
    //     interestRateNumerator,
    //     interestRateDenominator,
    //     extendedRateNumerator,
    //     extendedRateDenominator,
    //     earlyRateNumerator,
    //     earlyRateDenominator
    //   );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});