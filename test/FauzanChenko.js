const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("FauzanChenko", () => {
    let owner, user
    let fauzanChenko

    beforeEach(async() => {
        [owner, user] = await ethers.getSigners()

        const FauzanChenko = await ethers.getContractFactory("FauzanChenko")
        fauzanChenko = await FauzanChenko.deploy()
        await fauzanChenko.waitForDeployment()
    })

    describe("Deployment", () => {
        it("Sets the name & symbol", async() => {
            let result = await fauzanChenko.name()
            expect(result).to.equal("FauzanChenko")
        })

        it("Sets the owner contract", async() => {
            let result = await fauzanChenko.owner()
            expect(result).to.equal(owner.address)
        })
    })

    describe("Mint NFT", () => {
        let balanceBefore
        const amount = ethers.parseUnits("0.01", "ether")

        beforeEach(async() => {
            balanceBefore = await ethers.provider.getBalance(owner.address)

            // edit mint windows
            const editMintWindows = await fauzanChenko.editMintWindows(true, true)
            await editMintWindows.wait()

            // public mint
            let transaction = await fauzanChenko.connect(user).publicMint({ value : amount })
            await transaction.wait()

            // update balance after mint
            transaction = await fauzanChenko.connect(owner).withDraw()
            await transaction.wait()
        })

        it("Public mint open is true", async() => {
            const result = await fauzanChenko.publicMintOpen()
            expect(result).equal(true)
        })

        it("Allow list mint open is true", async() => {
            const result = await fauzanChenko.allowListMintOpen()
            expect(result).equal(true)
        })

        it("Increases total supply", async() => {
            const result = await fauzanChenko.totalSupply()
            expect(result).equal(1)
        })

        it("updates the owner balance", async() => {
            const balanceAfter = await ethers.provider.getBalance(owner.address)
            expect(balanceAfter).greaterThan(balanceBefore)
        })

        it("updates the contract balance", async() => {
            const balance = await ethers.provider.getBalance(fauzanChenko.getAddress())
            expect(balance).equal(0)
        })
    })
})