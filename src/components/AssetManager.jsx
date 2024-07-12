import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AssetManager = ({ state }) => {
  const [assetDetails, setAssetDetails] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    openingTime: 0,
    closingTime: 0,
    resultTime: 0,
    betPrice: 0,
  });

  const { provider, signer, contractAssetManager } = state;



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createAsset = async () => {
    const { name, symbol, openingTime, closingTime, resultTime, betPrice } = formData;
    const tx = await contractAssetManager.connect(signer).createAsset(name, symbol, openingTime, closingTime, resultTime, ethers.utils.parseEther(betPrice.toString()));

    fetchAssets();
  };

  const fetchAssets = async () => {
    const assetAddresses = await contractAssetManager.getAllAssets();
    const assets = await Promise.all(assetAddresses.map(async (address) => {
      const details = await contractAssetManager.getAssetDetails(address);
      return { address, ...details };
    }));
    setAssetDetails(assets);
  };

  return (
    <div>
      <h1>Asset Manager</h1>
      <div>
        <h2>Create Asset</h2>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input type="text" name="symbol" placeholder="Symbol" value={formData.symbol} onChange={handleChange} />
        <input type="number" name="openingTime" placeholder="Opening Time" value={formData.openingTime} onChange={handleChange} />
        <input type="number" name="closingTime" placeholder="Closing Time" value={formData.closingTime} onChange={handleChange} />
        <input type="number" name="resultTime" placeholder="Result Time" value={formData.resultTime} onChange={handleChange} />
        <input type="number" name="betPrice" placeholder="Bet Price" value={formData.betPrice} onChange={handleChange} />
        <button onClick={createAsset}>Create Asset</button>
      </div>
      <div>
        <h2>Assets</h2>
        <button onClick={fetchAssets}>Fetch Assets</button>
        <ul>
          {assetDetails.map((asset, index) => (
            <li key={index}>
              <h3>Asset Address: {asset.address}</h3>
              <p>Name: {asset[0]}</p>
              <p>Symbol: {asset[1]}</p>
              <p>Opening Time: {new Date(asset[2] * 1000).toString()}</p>
              <p>Closing Time: {new Date(asset[3] * 1000).toString()}</p>
              <p>Result Time: {new Date(asset[4] * 1000).toString()}</p>
              <p>Bet Price: {ethers.utils.formatEther(asset[5])} ETH</p>
              <p>Bet Setter: {asset[6]}</p>
              <p>Total Money: {ethers.utils.formatEther(asset[7])} ETH</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssetManager;
