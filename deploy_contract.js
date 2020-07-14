const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber } = require("@harmony-js/utils");
const hmy = new Harmony(process.env.URL, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const privateKey = process.env.PRIVATE_KEY;

const abi = [
  {
    constant: true,
    inputs: [],
    name: "getBytes32",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "_value",
        type: "bytes32",
      },
    ],
    name: "setBytes32",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getInt256",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "int256",
        name: "_value",
        type: "int256",
      },
    ],
    name: "setInt256",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getUint256",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "setUint256",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const bytecode =
  "0x608060405234801561001057600080fd5b50610164806100206000396000f300" +
  "6080604052600436106100775763ffffffff7c01000000000000000000000000" +
  "000000000000000000000000000000006000350416631f903037811461007c57" +
  "806368895979146100a3578063a53b1c1e146100b8578063c2b12a73146100d2" +
  "578063d2282dc5146100ea578063f5b53e1714610102575b600080fd5b348015" +
  "61008857600080fd5b50610091610117565b6040805191825251908190036020" +
  "0190f35b3480156100af57600080fd5b5061009161011d565b3480156100c457" +
  "600080fd5b506100d0600435610123565b005b3480156100de57600080fd5b50" +
  "6100d0600435610128565b3480156100f657600080fd5b506100d06004356101" +
  "2d565b34801561010e57600080fd5b50610091610132565b60005481565b6001" +
  "5481565b600255565b600055565b600155565b600254815600a165627a7a7230" +
  "582062f6c7201e1a3698c586add5b8e7d1f047a1fcfd8ca2f518c06790fba3de" +
  "22d80029";

const options1 = { gasPrice: "0x3B9ACA00" }; // gas price in hex corresponds to 1 Gwei or 1000000000
let options2 = { gasPrice: 1000000000, gasLimit: 21000 }; // setting the default gas limit, but changing later based on estimate gas
const options3 = { data: bytecode }; // contractConstructor needs contract bytecode to deploy

(async function () {
  const factory = hmy.contracts.createContract(abi);
  factory.wallet.addByPrivateKey(privateKey);
  const gas = await factory.methods
    .contractConstructor(options3)
    .estimateGas(options1);
  options2 = { ...options2, gasLimit: hexToNumber(gas) };

  const contract = await factory.deploy(options3).send(options2);
  console.log("Contract deployed at: ", contract.address);
})();
