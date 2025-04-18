async function main() {
	//account #1
	const wallet = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", ethers.provider);
	const Nft = await ethers.getContractFactory("DAOMember",wallet);
	const nft = await Nft.deploy();
	await nft.waitForDeployment();
	const Market = await ethers.getContractFactory("FakeNFTMarketplace",wallet);
	const market = await Market.deploy();
	await market.waitForDeployment();
	const Dao = await ethers.getContractFactory("DAOtobuyNFT",wallet);
	const dao = await Dao.deploy(await market.getAddress(),await nft.getAddress(),{value:ethers.parseEther("0.01")});
	await dao.waitForDeployment();
	console.log(`DAOMember deployed to address: ${await nft.getAddress()}`);
	console.log(`FakeNFTMarketplace deployed to address: ${await market.getAddress()}`);
	console.log(`DAOtobuyNFT deployed to address: ${await dao.getAddress()}`);

}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });