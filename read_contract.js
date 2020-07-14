const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber } = require("@harmony-js/utils");
const hmy = new Harmony(process.env.URL, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

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

const options1 = { gasPrice: "0x3B9ACA00" }; // gas price in hex corresponds to 1 Gwei or 1000000000
let options2 = { gasPrice: 1000000000, gasLimit: 21000 }; // setting the default gas limit, but changing later based on estimate gas

(async function () {
  const contract = hmy.contracts.createContract(
    abi,
    process.env.CONTRACT_ADDRESS
  );
  console.log("Reading contract:", process.env.CONTRACT_ADDRESS);

  const gas = await contract.methods.getBytes32().estimateGas(options1);
  options2 = { ...options2, gasLimit: hexToNumber(gas) };

  const bytesValue = await contract.methods.getBytes32().call(options2);
  console.log("Bytes32 value:", bytesValue);

  const intValue = await contract.methods.getInt256().call(options2);
  console.log("Int256 value:", intValue);

  const uintValue = await contract.methods.getUint256().call(options2);
  console.log("Uint256 value:", uintValue);
})();
