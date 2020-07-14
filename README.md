# chainlink-harmony-adapter
A simple adapter for chainlink nodes to write to harmony blockchain. 

This external adapter allows you to configure an endpoint and private key to sign and send transactions to harmony blockchain.

A typical workflow of a chainlink job for this adapter could look like:
- retrieve data from blockchain contract
- parse the desired field from the contract's response
- write value to contract

## Install

```bash
npm install
```

## Deploy & Test

- Run harmony local blockchain using docker: https://github.com/harmony-one/harmony
- Set local environment variable `URL` to the RPC endpoint for that client. For example: `http://localhost:9800`
- Set the local environment variable `PRIVATE_KEY` to the private key of a funded wallet. For example, `fd416cb87dcf8ed187e85545d7734a192fc8e976f5b540e9e21e896ec2bc25c3` (for local blockchain account `one1pdv9lrdwl0rg5vglh4xtyrv3wjk3wsqket7zxy`)
- Run:

```bash
node deploy_contract.js
```

The output should include a deployed contract address

- Set the local environment variable `CONTRACT_ADDRESS` to that address
- Run:

```bash
npm test
```

Verify the contract was written

- Run:

```bash
node read_contract.js
```

## Credits
This repository is adopted from [smartcontractkit/ethwrite-adapter](https://github.com/smartcontractkit/ethwrite-adapter).
