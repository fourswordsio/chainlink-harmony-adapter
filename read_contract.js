const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber } = require("@harmony-js/utils");
const hmy = new Harmony(process.env.URL, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const contractJson = require("./Test.json");

const options1 = { gasPrice: "0x3B9ACA00" }; // gas price in hex corresponds to 1 Gwei or 1000000000
let options2 = { gasPrice: 1000000000, gasLimit: 22000 }; // setting the default gas limit, but changing later based on estimate gas

(async function () {
  const contract = hmy.contracts.createContract(
    contractJson.abi,
    process.env.CONTRACT_ADDRESS
  );
  console.log("Reading contract:", process.env.CONTRACT_ADDRESS);

  const bytesValue = await contract.methods.getBytes32().call(options2);
  console.log("Bytes32 value:", bytesValue);

  const intValue = await contract.methods.getInt256().call(options2);
  console.log("Int256 value:", intValue);

  const uintValue = await contract.methods.getUint256().call(options2);
  console.log("Uint256 value:", uintValue);
})();
