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
        const amount = ethers.parseUnits("0.01", "ether")

        beforeEach(async() => {
            // edit mint windows
            const editMintWindows = await fauzanChenko.editMintWindows(true, true)
            await editMintWindows.wait()

            // public mint
            const publicMint = await fauzanChenko.connect(user).publicMint({ value : amount })
            await publicMint.wait()
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
    })
})