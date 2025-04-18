async function main(){
//for sepolia network
	const [signer]=await ethers.getSigners();
	const balance=Number(await ethers.provider.getBalance(signer.address));
	console.log(`Account address: ${signer.address}`);
	console.log(`Account balance: ${balance/10**18}`);
	const Nft = await ethers.getContractFactory("DAOMember");
	const nft = await Nft.deploy();
	await nft.waitForDeployment();
	const Market = await ethers.getContractFactory("FakeNFTMarketplace");
	const market = await Market.deploy();
	await market.waitForDeployment();
	const Dao = await ethers.getContractFactory("DAOtobuyNFT");
	const dao = await Dao.deploy(await market.getAddress(),await nft.getAddress(),{value:ethers.parseEther("0.01")});
	await dao.waitForDeployment();
	console.log(`DAOMember deployed to address: ${await nft.getAddress()}`);
	console.log(`FakeNFTMarketplace deployed to address: ${await market.getAddress()}`);
	console.log(`DAOtobuyNFT deployed to address: ${await dao.getAddress()}`);
	//wait for backend propagation after deploy
	await new Promise(resolve => setTimeout(resolve, 60000));
	//auto verify
	try{
		await run("verify:verify", {
			address: await nft.getAddress(),
			constructorArguments: [],
		});
	}catch(error){
		console.log("DAOMember may already verified",error.message);
	}
	try{
		await run("verify:verify", {
			address: await market.getAddress(),
			constructorArguments: [],
		});
	}catch(error){
		console.log("FakeNFTMarketplace may already verified",error.message);
	}
	try{
		await run("verify:verify", {
			address: await dao.getAddress(),
			constructorArguments: [await market.getAddress(),await nft.getAddress()],
		});
	}catch(error){
		console.log("DAOtobuyNFT may already verified",error.message);
	}

}
main().catch((error) => {
	console.error(error);
	process.exitCode=1;
})