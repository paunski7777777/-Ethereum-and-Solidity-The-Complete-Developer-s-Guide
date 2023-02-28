import "./App.css";
import web3 from "./web3";
import { useEffect, useState } from "react";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState();
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("0");
  const [enteredValue, setEnteredValue] = useState(0);
  const [message, setMessage] = useState();

  useEffect(() => {
    async function fetchData() {
      const fetchedManager = await lottery.methods.manager().call();
      const fetchedPlayers = await lottery.methods.getPlayers().call();
      const fetchedBalance = await web3.eth.getBalance(lottery.options.address);

      setManager(fetchedManager);
      setPlayers(fetchedPlayers);
      setBalance(fetchedBalance);
    }
    fetchData();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(enteredValue, "ether"),
    });

    setMessage("You have been entered!");
  };

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Picking a winner...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const winner = await lottery.methods.lastWinner().call();

    setMessage(`A winner has been picked - ${winner} !`);
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by <strong>{manager}</strong>
      </p>
      <p>
        There are currently <strong>{players.length}</strong> people entered,
        competing to win <strong>{web3.utils.fromWei(balance, "ether")}</strong>{" "}
        ether.
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter </label>
          <input
            type={"number"}
            value={enteredValue}
            onChange={(event) => setEnteredValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={onPickWinner}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
