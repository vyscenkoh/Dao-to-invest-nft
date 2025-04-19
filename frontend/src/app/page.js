"use client"
import Image from "next/image";
import styles from "./page.module.css";
import Head from "next/head";
import { useEffect, useState,useRef } from "react";
import { ethers } from "ethers";
import {
  NFTAddress,
  NFTABI,
  MarketplaceAddress,
  MarketplaceABI,
  DAOAddress,
  DAOABI,
} from "@/constants";
export default function Home() {
    const provider = useRef(null);
    const signer = useRef(null);
    const [account, setAccount] = useState(null);
    const [contractDAO, setContractDAO] = useState(null);
    const [contractNFT, setContractNFT] = useState(null);
    const [contractMarket, setContractMarket] = useState(null);
    const [daoOwner, setDaoOwner] = useState(null);
    const [daoBalance, setDaoBalance] = useState(null);
    const [numOfProposalsInDAO , setNumOfProposalsInDAO ] = useState(null);
    const [nftBalanceOfUser , setNftBalanceOfUser ] = useState(null);
    const [loading, setLoading] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [fakeNftTokenId, setFakeNftTokenId] = useState("");
    const [selectedTab, setSelectedTab] = useState(""); 
    const [isMounted, setIsMounted] = useState(false);
    

    const connectWallet = async () => {
        if (!window.ethereum) {
          alert("Please install MetaMask!");
          return;
        }

        provider.current = new ethers.BrowserProvider(window.ethereum);
        const accounts= await provider.current.send('eth_requestAccounts',[]);
        setAccount(accounts[0]);
        signer.current = await provider.current.getSigner();
        const contractInstance1 = new ethers.Contract(DAOAddress, DAOABI, signer.current);
        const contractInstance2 = new ethers.Contract(NFTAddress, NFTABI, signer.current);
        const contractInstance3 = new ethers.Contract(MarketplaceAddress, MarketplaceABI, signer.current);
        setContractDAO(contractInstance1);
        setContractNFT(contractInstance2);
        setContractMarket(contractInstance3);
        const tx = await contractInstance1.owner();
        setDaoOwner(tx);
        const tx1 = await contractInstance1.runner.provider.getBalance(DAOAddress);
        setDaoBalance(tx1);
        const tx2 = await contractInstance1.numProposals();
        setNumOfProposalsInDAO(tx2);
        const tx3 = await contractInstance2.balanceOf(accounts[0]);
        setNftBalanceOfUser(tx3);
    };
    if(typeof window!=="undefined")
    window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
            alert("Please connect to MetaMask.");
        } else {
            setAccount(accounts[0]);
            provider.current = new ethers.BrowserProvider(window.ethereum);
            signer.current = await provider.current.getSigner();
            const contractInstance1 = new ethers.Contract(DAOAddress, DAOABI, signer.current);
            const contractInstance2 = new ethers.Contract(NFTAddress, NFTABI, signer.current);
            const contractInstance3 = new ethers.Contract(MarketplaceAddress, MarketplaceABI, signer.current);
            setContractDAO(contractInstance1);
            setContractNFT(contractInstance2);
            setContractMarket(contractInstance3);
            const tx = await contractInstance1.owner();
            setDaoOwner(tx);
            const tx1 = await contractInstance1.runner.provider.getBalance(DAOAddress);
            setDaoBalance(tx1);
            const tx2 = await contractInstance1.numProposals();
            setNumOfProposalsInDAO(tx2);
            const tx3 = await contractInstance2.balanceOf(accounts[0]);
            setNftBalanceOfUser(tx3);
        }
    }); 

      // Function to make a createProposal transaction in the DAO
    async function createProposal() {
        setLoading(true);
        try {
            const tx = await contractDAO.createProposal(fakeNftTokenId);
            await tx.wait();
            setNumOfProposalsInDAO(numOfProposalsInDAO+BigInt(1));
            setSelectedTab("View Proposals")
        } catch (error) {
            console.error(error);
            window.alert(error);
        }
        setLoading(false);
    }
    
    // Function to fetch a proposal by it's ID
    async function fetchProposalById(id) {
        try {
            const proposal = await contractDAO.proposals(id);
            const [nftTokenId, deadline, yayVotes, nayVotes, executed] = proposal;
            const parsedProposal = {
                proposalId: id,
                nftTokenId: nftTokenId.toString(),
                deadline: new Date(parseInt(deadline.toString()) * 1000),
                yayVotes: yayVotes.toString(),
                nayVotes: nayVotes.toString(),
                executed: Boolean(executed),
            };
            return parsedProposal;
        } catch (error) {
            console.error(error);
            window.alert(error);
        }
    }
    // Function to fetch all proposals in the DAO
    async function fetchAllProposals() {
        try {
            const proposals = [];
            for (let i = 0; i < numOfProposalsInDAO; i++) {
                const proposal = await fetchProposalById(i);
                proposals.push(proposal);
            }
            setProposals(proposals);
            return proposals;
        } catch (error) {
            console.error(error);
            window.alert(error);
        }
    }
    // fetch all proposals in the DAO after specific amount of time 
    async function fetchAllProposalsWithDelay() {
        setTimeout(async () => {
            await fetchAllProposals();
        }, 5000);
    }


    // Function to vote YAY or NAY on a proposal
    async function voteForProposal(proposalId, vote) {
        setLoading(true);
        try {
            const tx = await contractDAO.voteOnProposal(proposalId, vote === "YAY" ? 0 : 1);
            await tx.wait();
            fetchAllProposalsWithDelay();
        } catch (error) {
            console.error(error);
            window.alert(error);
        }
        setLoading(false);
    }
    // Function to execute a proposal after deadline has been exceeded
    async function executeProposal(proposalId) {
        setLoading(true);
        try {
            const tx = await contractDAO.executeProposal(proposalId);
            await tx.wait();
            fetchAllProposalsWithDelay();
        } catch (error) {
            console.error(error);
            window.alert(error);
        }
        setLoading(false);
    }
    
    // Function to withdraw ether from the DAO contract
    async function withdrawDAOEther() {
        setLoading(true);
        try {
            const tx = await contractDAO.withdrawEther();
            await tx.wait();
            setDaoBalance(0);
        } catch (error) {
            console.error(error);
            window.alert(error);
        }
        setLoading(false);
    }
    
    // Generate free member ticket
    async function mintNFT() {
        setLoading(true);
        try {
            const tx = await contractNFT.mint();
            await tx.wait();
            setNftBalanceOfUser(nftBalanceOfUser+BigInt(1));
        } catch (error) {
            console.error(error);
            window.alert(error);
        }
        setLoading(false);
    }
  // Renders the 'Create Proposal' tab content
    function renderCreateProposalTab() {
        if (loading) {
            return (
            <div className={styles.description}>
                Loading... Waiting for transaction...
            </div>
            );
        } else if (nftBalanceOfUser === 0) {
            return (
            <div className={styles.description}>
                You do not own any Voting rights. <br />
                <b>You cannot create or vote on proposals</b>
            </div>
            );
        } else {
            return (
            <div className={styles.container}>
                <label>Fake NFT Token ID to Purchase: </label>
                <input
                placeholder="0"
                type="number"
                onChange={(e) => setFakeNftTokenId(e.target.value)}
                />
                <button className={styles.button2} onClick={createProposal}>
                Create
                </button>
            </div>
            );
        }
    }
    
    // Renders the 'View Proposals' tab content
    function renderViewProposalsTab() {
        if (loading) {
            return (
            <div className={styles.description}>
                Loading... Waiting for transaction...
            </div>
            );
        } else if (proposals.length === 0) {
            return (
            <div className={styles.description}>No proposals have been created</div>
            );
        } else {
            return (
            <div>
                {proposals.map((p, index) => (
                <div key={index} className={styles.card}>
                    <p>Proposal ID: {p.proposalId}</p>
                    <p>NFT ID to Purchase: {p.nftTokenId}</p>
                    <p>Deadline: {p.deadline.toLocaleString()}</p>
                    <p>Yay Votes: {p.yayVotes}</p>
                    <p>Nay Votes: {p.nayVotes}</p>
                    <p>Executed?: {p.executed.toString()}</p>
                    {p.deadline.getTime() > Date.now() && !p.executed ? (
                    <div className={styles.flex}>
                        <button
                        className={styles.button2}
                        onClick={() => voteForProposal(p.proposalId, "YAY")}
                        >
                        Vote YAY
                        </button>
                        <button
                        className={styles.button2}
                        onClick={() => voteForProposal(p.proposalId, "NAY")}
                        >
                        Vote NAY
                        </button>
                    </div>
                    ) : p.deadline.getTime() < Date.now()   && !p.executed ? (
                    <div className={styles.flex}>
                        <button
                        className={styles.button2}
                        onClick={() => executeProposal(p.proposalId)}
                        >
                        Execute Proposal{" "}
                        {p.yayVotes > p.nayVotes ? "(Buy)" : "(Not buy)"}
                        </button>
                    </div>
                    ) : (
                    <div className={styles.description}>Proposal Executed</div>
                    )}
                </div>
                ))}
            </div>
            );
        }
    }
    // Piece of code that runs everytime the value of `selectedTab` changes
    // Used to re-fetch all proposals in the DAO when user switches
    // to the 'View Proposals' tab
    useEffect(() => {
        if (selectedTab === "View Proposals") {
            fetchAllProposals();
        }
    }, [selectedTab]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (account==null||account==undefined)
    return (
      <div className={styles.main}>
        <div className={styles.flex}>
        <button
              className={styles.button}
              onClick={connectWallet}>Connect MetaMask</button>
        </div>
        </div>
    );
    // Render the contents of the appropriate tab based on `selectedTab`
    function renderTabs() {
    if (selectedTab === "Create Proposal") {
        return renderCreateProposalTab();
    } else if (selectedTab === "View Proposals") {
        return renderViewProposalsTab();
    }
    return null;
    }
    return (
          <div className={styles.className}>
      <Head>
        <title> NFT INVESTOR DAO </title>
        <meta name="description" content="NFT owning Decentralized Organization" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to NFT Investor DAO!</h1>
          <div className={styles.description}>
            Your NFT Balance: {nftBalanceOfUser}
            <br/>
            {daoBalance && (
              <>
                Treasury Balance:{" "}
                {ethers.formatEther(daoBalance)} ETH
              </>
            )}
            <br/>
            Total Number of Proposals: {numOfProposalsInDAO}
          </div>
          <div className={styles.flex}>
          <button
              className={styles.button}
              onClick={mintNFT}>Obtain votes</button>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("Create Proposal")}>Create Proposal</button>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("View Proposals")}>View Proposals</button>
          </div>
          {renderTabs()}
          {/* Display additional withdraw button if connected wallet is owner */}
          {account &&daoOwner && account.toLowerCase() === daoOwner.toLowerCase() ? (
            <div className={styles.flex}>
              {loading ? (
                <button className={styles.button}>Loading...</button>
              ) : (
                <button className={styles.button} onClick={withdrawDAOEther}> 
                  Withdraw DAO ETH</button>
              )}
            </div>
          ) : ("")}
        </div>
      </div>
      
        <div className={styles.footer}>
        <p>
            1. Connect your wallet to the app</p><p>
            2. Obtain votes by clicking on the "Obtain votes" button</p><p>
            3. Create a proposal by clicking on the "Create Proposal" button</p><p>
            4. Enter the Fake NFT Token ID you want to purchase</p><p>
            5. Click on the "Create" button to submit your proposal</p><p>
            6. View all proposals by clicking on the "View Proposals" button</p><p>
            7. Vote on proposals by clicking on the "Vote YAY" or "Vote NAY" buttons</p><p>
            8. Execute proposals by clicking on the "Execute Proposal" button</p><p>
            9. Withdraw DAO ether by clicking on the "Withdraw DAO ETH" button (only available to the DAO owner)</p><p>
        </p>
        </div>
    </div>
  );
}
