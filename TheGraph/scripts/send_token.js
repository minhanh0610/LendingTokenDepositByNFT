async function main() {
    [owner, addr1, addr2] = await ethers.getSigners();

    const nft_addr = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
    const Nft = await ethers.getContractFactory("TokenERC721");
    const nft = await Nft.attach(nft_addr);

    const tokenId = 4;

    //await nft.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId);
    console.log(await nft.ownerOf(tokenId))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
