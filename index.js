const { Harmony } = require("@harmony-js/core");
const { formatBytes32String, AbiCoder } = require("@harmony-js/contract");
const { ChainID, ChainType, strip0x } = require("@harmony-js/utils");

let url = "https://api.s0.b.hmny.io";
if (process.env.URL) {
  url = process.env.URL;
}
const hmy = new Harmony(url, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});
const defaultAbiCoder = new AbiCoder();

const privateKey = process.env.PRIVATE_KEY;
hmy.wallet.addByPrivateKey(privateKey);

const encode = (type, value) => {
  let retVal;
  switch (type) {
    case "bytes32":
      retVal = formatBytes32String(value);
      break;
    default:
      retVal = defaultAbiCoder.encodeParameters([type], [value]);
      break;
  }
  return retVal.slice(2);
};

const createRequest = (input, callback) => {
  const address = input.data.address || "";
  const functionSelector = input.data.functionSelector || "";
  const dataType = input.data.dataType || "uint256";
  const dataPrefix = input.data.dataPrefix || "";
  // Prioritize data coming from a previous adapter (result),
  // but allow dataToSend to be used if specified
  const dataToSend = input.data.result || input.data.dataToSend || "";
  // Ensure we use only 4 bytes for the functionId
  const value = input.data.dataType
    ? encode(dataType, dataToSend)
    : strip0x(dataToSend);
  const transactionData =
    functionSelector.substring(0, 10) + strip0x(dataPrefix) + value;

  const transaction = hmy.transactions.newTx({
    to: address,
    data: transactionData,
    gasLimit: 6721900,
    gasPrice: new hmy.utils.Unit("1").asGwei().toWei(),
  });
  hmy.wallet.signTransaction(transaction).then((signedTxn) => {
    let sendTransactionPromise = hmy.blockchain.sendTransaction(signedTxn);
    sendTransactionPromise
      .then((tx) => {
        // transaction.txConfirm(tx.result).then((result) => {
        callback(200, {
          jobRunID: input.id,
          data: tx,
          statusCode: 200,
        });
        // });
      })
      .catch((err) => {
        console.log("Error!", err);
        callback(400, {
          jobRunID: input.id,
          status: "errored",
          error: err,
          statusCode: 400,
        });
      });
  });
};

exports.gcpservice = (req, res) => {
  createRequest(JSON.parse(req.body), (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};

exports.handler = (event, context, callback) => {
  createRequest(JSON.parse(event), (statusCode, data) => {
    callback(null, data);
  });
};

module.exports.createRequest = createRequest;
