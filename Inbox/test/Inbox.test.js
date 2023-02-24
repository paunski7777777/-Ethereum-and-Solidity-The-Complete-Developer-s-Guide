const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../compile");

let accounts;
let inbox;

const testMessage = "Hi, lud paunec";
const testMessage2 = "opi";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: [testMessage] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploy a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a defaulf message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, testMessage);
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage(testMessage2).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, testMessage2);
  });
});
