const hre = require('hardhat')

const main = async () => {
	await hre.run('compile')

	const EMotiveToken = await hre.ethers.getContractFactory('EMotiveToken')
	console.log('Deploying Token...')
	const emotive = await EMotiveToken.deploy()
	await emotive.deployed()
	console.log('Token deployed: ', emotive.address)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
