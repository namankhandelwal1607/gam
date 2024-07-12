import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Bet = ({ state }) => {
  const [assetAddress, setAssetAddress] = useState('');
  const [estimate, setEstimate] = useState('');
  const [betPrice, setBetPrice] = useState('');
  const [bets, setBets] = useState([]);
  const [contractBalance, setContractBalance] = useState('');

  const { provider, signer, contractBet } = state;

  useEffect(() => {
    const init = async () => {
      if (contractBet) {
        await fetchBets();
        await fetchContractBalance();
      }
    };

    init();
  }, [contractBet]);

  const fetchBets = async () => {
    const betsLength = await contractBet.betsLength();
    const fetchedBets = [];

    for (let i = 0; i < betsLength; i++) {
      const bet = await contractBet.getBet(i);
      fetchedBets.push({
        userAddress: bet[0],
        assetAddress: bet[1],
        amountPaid: ethers.utils.formatEther(bet[2]), // Convert to ETH string
        estimate: bet[3].toString(), // Ensure estimate is a string
      });
    }

    setBets(fetchedBets);
  };

  const fetchContractBalance = async () => {
    const balance = await contractBet.getBalance();
    setContractBalance(ethers.utils.formatEther(balance)); // Convert to ETH string
  };

  const handlePlaceBet = async () => {
    const contractWithSigner = contractBet.connect(signer);
    const tx = await contractWithSigner.setBet(assetAddress, estimate, {
      value: ethers.utils.parseEther(betPrice),
    });
    await tx.wait();
    await fetchBets();
    await fetchContractBalance();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assetAddress') setAssetAddress(value);
    if (name === 'estimate') setEstimate(value);
    if (name === 'betPrice') setBetPrice(value);
  };

  return (
    <div>
      <h1>Bet Component</h1>
      <div>
        <h2>Place a Bet</h2>
        <input
          type="text"
          name="assetAddress"
          placeholder="Asset Address"
          value={assetAddress}
          onChange={handleChange}
        />
        <input
          type="number"
          name="estimate"
          placeholder="Estimate"
          value={estimate}
          onChange={handleChange}
        />
        <input
          type="number"
          name="betPrice"
          placeholder="Bet Price in ETH"
          value={betPrice}
          onChange={handleChange}
        />
        <button onClick={handlePlaceBet}>Place Bet</button>
      </div>
      <div>
        <h2>Contract Balance</h2>
        <p>{contractBalance} ETH</p>
      </div>
      <div>
        <h2>Bets</h2>
        <ul>
          {bets.map((bet, index) => (
            <li key={index}>
              <p>User Address: {bet.userAddress}</p>
              <p>Asset Address: {bet.assetAddress}</p>
              <p>Amount Paid: {bet.amountPaid} ETH</p>
              <p>Estimate: {bet.estimate}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Bet;
