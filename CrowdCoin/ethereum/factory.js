import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xe986bFb1e8F4ba13ee3eaE512a957EA0e9b07D7D"
);

export default instance;
