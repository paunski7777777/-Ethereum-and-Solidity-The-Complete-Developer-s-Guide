const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  "cherry field parade roof alley horror expose soul height reunion between hidden",
  "https://goerli.infura.io/v3/de0255d3086a47178c8525b2110cbf8a"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account " + accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to" + result.options.address);
  provider.engine.stop();
};

deploy();
