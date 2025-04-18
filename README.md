# Dao-to-invest-nft

Forewords:
Most tutorial on web3 fail to provide working example. This is become latest node js does not compatible with old hardhat, latest hardhat and etherv6 had change the coding structure, and it is not the best practice to use deprecated library. Hopefully this can fill the gap with some of the assumed knowledge missing from tutorial.

Architecture use:
1. etherv6js (shorter code and easier)
2. hardhat 2.23 (foundry is harder to use, remix is just too manual)
3. solidity 0.8.28
<pre>
Steps 1:
#install dependencies as denoted in package.json
npm i

Step 2 Option 1
#deploy local blockchain
npx hardhat node
#you can take note of some private key generate in the output
npx hardhat run scripts/deploylocal.js

Step 2 Option 2
#use sepolia blockchain
Files to create:
.env
Your sepolia account to deploy contract, not require 
PRIVATE_KEY=""
Apply on alchemy / quicknode /infuria / etc to send API to sepolia network , must have at least 0.02eth
SEPOLIA_URL="" 
Apply on etherscan.io
ETHERSCAN_KEY=""
npx hardhat run scripts/deploy.js --network sepolia

Step 2 Option 3
#use other blockchain
edit .env and hardhat.config.js
npx hardhat run scripts/deploy.js --network <define in hardhatconfig>

Step 3
#put the address in frontend from the output of step 2
Files to edit:
frontend/src/constant/index.js
export const NFTAddress =  "";
export const  MarketplaceAddress=  "";
export const DAOAddress =  "";

Step 4
#install dependencies on frontend again 
cd frontend
npm i

Step 5
#run client. Make sure Metamask is install.
npm run dev 
#will pop up in your browser, this is the UI to invoke contract function from your PC. 
#If you are using local hardhat blockchain, add the chain to your metamask, add the account using private key collected in step 2 option 1

Step 6
You can swap account on metamask to invoke contract using non owner address without refreshing the page.
Happy Experiment and edit

Step 7
#to create static webfile that you can upload to web hosting server 
npm run build
npm run export

Step 8
#how to build everything from ground up
1. Open new folder
2. Create nodejs project, npm init -y
3. Install hardhat, npm i hardhat
4. Create hardhat sample project structure, npx hardhat init
5. For libraries, npm i  <package u found npmjs.org>
6. Contracts can be found contracts/xyz.sol
7. Create script folder, create scripts/deploy.js, this is where u deploy your contract automatically, this is better than manually click on remix.org UI for every contract changes.
8. You can check the test/Lock.js to see how script test is done for smartcontract, npx hardhat test to run each script in that folder
#to deploy on blockchain other that this local testing environment
9. npm i .dotenv
10. Manually create your .env file
11. Edit hardhat.config.js accordingly.
#For website
1. Create a frontend folder, npx create-next-app@latest frontend, this create next.js sample project.
2. Your main working file is in frontend/src, you may want to store some constant like contract address there, Your ABI is from artifacts/contracts/yourcontract.sol/yourcontract.json
3. Import the abi in your constants pointing to the directory containing your abi, refer to my frontend/src/constant/index.js, this is not the only method, there will always be a better way.
4. Import npmjs library and start working in your website.

Potential Improvement:
1. Implement ERC20 purchase
2. Real time synchronization for updates on the contract via events emit
3. Restrict access or adding condition to mint nft for proposal creation and voting rights.
4. Check NFT market availability before purchase
5. Use proxy for storing data and implement upgradeable contract.
</pre>
