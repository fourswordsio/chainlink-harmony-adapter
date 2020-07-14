const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber } = require("@harmony-js/utils");
const hmy = new Harmony(process.env.URL, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});
const privateKey = process.env.PRIVATE_KEY;
hmy.wallet.addByPrivateKey(privateKey);

const contractJson = require("./Test.json");

const options1 = { gasPrice: "0x3B9ACA00" }; // gas price in hex corresponds to 1 Gwei or 1000000000
let options2 = { gasPrice: 1000000000, gasLimit: 21000 }; // setting the default gas limit, but changing later based on estimate gas

(async function () {
  const contract = hmy.contracts.createContract(
    contractJson.abi,
    process.env.CONTRACT_ADDRESS
  );

  const gas = await contract.methods.setUint256(54).estimateGas(options1);
  options2 = { ...options2, gasLimit: hexToNumber(gas) };

  const uintValue = await contract.methods.setUint256(54).send(options2);
  console.log("Uint256 value:", uintValue);
})();
