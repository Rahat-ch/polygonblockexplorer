import { useEffect, useState, useMemo } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const provider = useMemo(() => new ethers.providers.JsonRpcProvider("enter rpc here from alchemy"), []);

  const [lastTenBlocks, setLastTenBlocks] = useState([])
  const [latestBlockInfo, setLatestBlockInfo] = useState([]);

  useEffect(() => {
    const fetchLatestBlocks = async () => {
      const latestBlock = await provider.getBlockNumber()
      const newBlocks = [];
      for (let index = 0; index < 10; index++) {
        const currentBlock = latestBlock - index
        newBlocks.push(currentBlock)
      }
      setLastTenBlocks(newBlocks)
     }
     fetchLatestBlocks()
  }, [provider])

  useEffect(() => {
    const fetchLatestBlockData = async () => {
      const blockInfo = await Promise.all(
        lastTenBlocks.map(async (block) => {
          const currentBlockInfo = await provider.getBlock(block)
          return currentBlockInfo
        })
      )
      setLatestBlockInfo(blockInfo);
    }
    fetchLatestBlockData()
  },[lastTenBlocks, provider])
  const dateFormatter = (date) => {
    const timestamp = new Date(date * 1000).toString()
    return timestamp
  }
  console.log(latestBlockInfo)
  return (
    <div className="App">
      <header className="App-header">
        <h1>Last Ten Blocks on Polygon</h1>
        {
          latestBlockInfo.map(block => (
            <div className='block-card'>
            <p>Block Number: {block.number}</p>
            <p>Timestamp: {dateFormatter(block.timestamp)}</p>
            <p>Number of Transactions: {block.transactions.length}</p>
            </div>
          ))
        }
      </header>
    </div>
  );
}

export default App;
