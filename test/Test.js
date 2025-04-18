const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { assert } = require("chai");

describe("Test", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        const Lock = await ethers.getContractFactory("Lock");
        const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

        return { lock };
    }

    it("Should set the right test", async function () {
        const { lock } = await loadFixture(deployFixture);

        assert.equal(0,0);
    });
});
