export const NFTAddress =
  "0xE6260452a2fcde453f13f6f7C6C82DE67a96C34a";
export const  MarketplaceAddress=
  "0x7BD4E6EB59529b1c0EA9eF95433Cc2A7376Ad223";
export const DAOAddress =
  "0x70ACA9Aa322eeF728816e6707C227474F74D8f1F";
import nftJson from "../../../artifacts/contracts/DAOMember.sol/DAOMember.json";
import marketplaceJson from "../../../artifacts/contracts/FakeNFTMarketplace.sol/FakeNFTMarketplace.json";
import daoJson from "../../../artifacts/contracts/DAOtobuyNFT.sol/DAOtobuyNFT.json";
export const NFTABI = nftJson.abi; // REPLACE THIS WITH THE NFT CONTRACT ABI
export const MarketplaceABI = marketplaceJson.abi; // REPLACE THIS WITH THE FAKE MARKETPLACE ABI
export const DAOABI = daoJson.abi; // REPLACE THIS WITH THE DAO ABI