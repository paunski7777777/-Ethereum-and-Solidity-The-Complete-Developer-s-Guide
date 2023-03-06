import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x92a8E5dc79D0Ab836E3c2020e567eF5060934FF9"
);

export default instance;
