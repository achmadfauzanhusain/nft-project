const hre = require("hardhat")
const { ethers } = require("hardhat")

async function main() {
    const [deployer] = await ethers.getSigners()

    const FauzanChenko = await ethers.getContractFactory("FauzanChenko")
    const fauzanChenko = await FauzanChenko.deploy()
    await fauzanChenko.waitForDeployment()

    const fauzanChenkoAddress = await fauzanChenko.getAddress()
    console.log("FauzanChenko deployed to:", fauzanChenkoAddress)
    console.log("Deployer address:", deployer.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});