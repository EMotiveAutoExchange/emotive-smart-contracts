# emotive-smart-contracts

Smart Contracts for E-Motive Platform

## 1. EMOT Token

### Installation

Install all the dependencies with npm, run the following command

```bash
  npm install
```

### Testing

To test the contract, run the following command

```bash
  npm run test
```

To run coverage for the contract, run the following command

```bash
  npm run coverage
```

To clean all the temp files from the test, run the following command

```bash
  npm run clean
```

### Deployment

Create a secrets.json file in the root directory and add the following variables

```json
{
	"mnemonic": "your-mnemonic",
	"infuraKey": "your-infura-key"
}
```

To deploy to a network, run the following command by replacing the `NETWORK` with one of the following valid values:

-   localhost
-   ropsten
-   rinkeby
-   goerli

```bash
  npx hardhat run --network NETWORK scripts/deploy_token.js
```
