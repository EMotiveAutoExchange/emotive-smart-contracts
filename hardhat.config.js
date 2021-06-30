require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('solidity-coverage')
require('@nomiclabs/hardhat-etherscan')
const { mnemonic, infuraKey } = require('./secrets.json')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	networks: {
		ropsten: {
			url: `https://ropsten.infura.io/v3/${infuraKey}`,
			accounts: { mnemonic: mnemonic },
		},
		rinkeby: {
			url: `https://rinkeby.infura.io/v3/${infuraKey}`,
			accounts: { mnemonic: mnemonic },
		},
		goerli: {
			url: `https://goerli.infura.io/v3/${infuraKey}`,
			accounts: { mnemonic: mnemonic },
		},
	},
	solidity: '0.8.4',
}
