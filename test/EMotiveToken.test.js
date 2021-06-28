const chai = require('chai')
const { expect } = require('chai')
const { solidity } = require('ethereum-waffle')
chai.use(solidity)

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
let EMotive
let emotive
let owner
let addr1

// Start test block
describe('EMotiveToken', () => {
	beforeEach(async () => {
		EMotive = await ethers.getContractFactory('EMotiveToken')
		emotive = await EMotive.deploy()
		;[owner, addr1, _] = await ethers.getSigners()
	})

	describe('Roles', () => {
		// Test cases
		it('will set the deployer as the Admin role', async () => {
			expect(await emotive.isAdmin(owner.address)).equals(true)
		})

		it('will set the deployer as the Minter role', async () => {
			expect(await emotive.isMinter(owner.address)).equals(true)
		})

		it('will allow admin to add Minter role', async () => {
			await emotive.addMinterRole(addr1.address)
			expect(await emotive.isMinter(addr1.address)).equals(true)
		})

		it('will revert if someone else tries to add Minter role', async () => {
			await expect(
				emotive.connect(addr1).addMinterRole(addr1.address)
			).to.be.revertedWith('Restricted to admins.')
		})

		it('will allow admin to add Admin role', async () => {
			await emotive.addAdminRole(addr1.address)
			expect(await emotive.isAdmin(addr1.address)).equals(true)
		})

		it('will revert if someone else tries to add Admin role', async () => {
			await expect(
				emotive.connect(addr1).addAdminRole(addr1.address)
			).to.be.revertedWith('Restricted to admins.')
		})

		it('will allow admin to remove Minter role', async () => {
			await emotive.removeMinterRole(addr1.address)
			expect(await emotive.isMinter(addr1.address)).equals(false)
		})

		it('will revert if someone else tries to remove Minter role', async () => {
			await expect(
				emotive.connect(addr1).removeMinterRole(addr1.address)
			).to.be.revertedWith('Restricted to admins.')
		})

		it('will allow admin to remove Admin role', async () => {
			await emotive.removeAdminRole(addr1.address)
			expect(await emotive.isAdmin(addr1.address)).equals(false)
		})

		it('will revert if someone else tries to remove Admin role', async () => {
			await expect(
				emotive.connect(addr1).removeAdminRole(addr1.address)
			).to.be.revertedWith('Restricted to admins.')
		})
	})

	describe('Token Info', () => {
		it('returns correct token info', async () => {
			expect((await emotive.name()).toString()).to.equal('EMotiveToken')
			expect((await emotive.symbol()).toString()).to.equal('EMOT')
			expect((await emotive.decimals()).toString()).to.equal('18')
			expect((await emotive.totalSupply()).toString()).to.equal(
				(5 * 10 ** 8 * 10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		})
	})

	describe('Basic Functionalities', () => {
		it('returns correct token balances', async () => {
			expect(
				(await emotive.balanceOf(owner.address)).toString()
			).to.equal(
				(5 * 10 ** 8 * 10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
			expect(
				(await emotive.balanceOf(addr1.address)).toString()
			).to.equal('0')
		})

		it('can transfer tokens (transfer)', async () => {
			await emotive.transfer(
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
			expect(
				(await emotive.balanceOf(owner.address)).toString()
			).to.be.equal(
				((5 * 10 ** 8 - 1) * 10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
			expect(
				(await emotive.balanceOf(addr1.address)).toString()
			).to.be.equal(
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		})

		it('cannot transfer tokens if recipient is zero address (transfer)', async () => {
			await expect(
				emotive.transfer(
					ZERO_ADDRESS,
					(10 ** 18).toLocaleString('fullwide', {
						useGrouping: false,
					})
				)
			).to.be.revertedWith('ERC20: transfer to the zero address')
		})

		it('cannot transfer tokens when balance is not sufficient (transfer)', async () => {
			await expect(
				emotive.connect(addr1).transfer(
					owner.address,
					(10 ** 18).toLocaleString('fullwide', {
						useGrouping: false,
					})
				)
			).to.be.revertedWith('ERC20: transfer amount exceeds balance')
		})

		it('can approve tokens', async () => {
			await emotive.approve(
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
			expect(
				(
					await emotive.allowance(owner.address, addr1.address)
				).toString()
			).to.be.equal(
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		})

		it('can increase allowance of tokens', async () => {
			await emotive.approve(
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
			await emotive.increaseAllowance(
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)

			expect(
				(
					await emotive.allowance(owner.address, addr1.address)
				).toString()
			).to.be.equal(
				(2 * 10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		})

		it('cannot increase allowance if receipent is zero address', async () => {
			await expect(
				emotive.approve(
					ZERO_ADDRESS,
					(10 ** 18).toLocaleString('fullwide', {
						useGrouping: false,
					})
				)
			).to.be.revertedWith('ERC20: approve to the zero address')
		})

		it('can decrease allowance of tokens', async () => {
			await emotive.approve(
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
			await emotive.decreaseAllowance(
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)

			expect(
				(
					await emotive.allowance(owner.address, addr1.address)
				).toString()
			).to.be.equal('0')
		})

		it('can transfer tokens (transferFrom)', async () => {
			await emotive.approve(
				owner.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)

			await emotive.transferFrom(
				owner.address,
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)

			expect(
				(await emotive.balanceOf(owner.address)).toString()
			).to.be.equal(
				((5 * 10 ** 8 - 1) * 10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
			expect(
				(await emotive.balanceOf(addr1.address)).toString()
			).to.be.equal(
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		})

		it('can transfer tokens on behalf of sender (transferFrom)', async () => {
			await emotive.approve(
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)

			await emotive.connect(addr1).transferFrom(
				owner.address,
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)

			expect(
				(await emotive.balanceOf(owner.address)).toString()
			).to.be.equal(
				((5 * 10 ** 8 - 1) * 10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
			expect(
				(await emotive.balanceOf(addr1.address)).toString()
			).to.be.equal(
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
			expect(
				(
					await emotive.allowance(owner.address, addr1.address)
				).toString()
			).to.be.equal('0')
		})

		it('cannot transfer tokens if recipient is zero address (transferFrom)', async () => {
			await expect(
				emotive.transferFrom(
					owner.address,
					ZERO_ADDRESS,
					(10 ** 18).toLocaleString('fullwide', {
						useGrouping: false,
					})
				)
			).to.be.revertedWith('ERC20: transfer to the zero address')
		})

		it('cannot transfer tokens when balance is not sufficient (transferFrom)', async () => {
			await expect(
				emotive.transferFrom(
					addr1.address,
					owner.address,
					(10 ** 10 * 10 ** 18).toLocaleString('fullwide', {
						useGrouping: false,
					})
				)
			).to.be.revertedWith('ERC20: transfer amount exceeds balance')
		})
	})

	describe('Additional Functionalities', () => {
		it('can allow users with Minter role to mint new tokens', async () => {
			await emotive.mint(addr1.address, (1).toString())

			expect(await emotive.balanceOf(addr1.address)).to.be.equal(
				(10 ** 18).toString()
			)
		})

		it('will not allow users without Minter role to mint new tokens', async () => {
			await expect(
				emotive
					.connect(addr1)
					.mint(addr1.address, (10 ** 18).toString())
			).to.be.revertedWith('Restricted to minters.')
		})

		it('will not allow users with Minter role to mint new tokens more than the final supply', async () => {
			await expect(
				emotive.mint(addr1.address, (10 ** 10).toString())
			).to.be.revertedWith('Cannot mint more than Final Supply.')
		})
	})
})
