const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert } = require("chai");

describe("Proxy", function () {
  
  async function deployFixture() {
    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();

    const Logic1 = await ethers.getContractFactory("Logic1");
    const logic1 = await Logic1.deploy();

    const Logic2 = await ethers.getContractFactory("Logic2");
    const logic2 = await Logic2.deploy();

    //It creates a contract instance for the Logic1/Logic2 contract, but it points to the proxy's address on the blockchain.
    //By calling ethers.getContractAt, you're essentially telling Ethers.js:
    //"Pretend that the contract at the proxy's address behaves like Logic1/Logic2."
    //We need it in order to be able to call functions, that are not in Proxy contract ABI, like changeX function
    const proxyAsLogic1 = await ethers.getContractAt("Logic1", await proxy.getAddress());
    const proxyAsLogic2 = await ethers.getContractAt("Logic2", await proxy.getAddress());


    return { proxy, proxyAsLogic1, proxyAsLogic2, logic1, logic2 };
  }
  
    it("Should works with logic1", async function () {
      const { proxy, proxyAsLogic1, logic1, } = await loadFixture(deployFixture);

      await proxy.changeImplementation(logic1.getAddress());
      assert.equal(await logic1.x(), 0);

      await proxyAsLogic1.changeX(52);
      assert.equal(await logic1.x(), 52);
      
    });

    it("Should works with upgrades", async function () {
      const { proxy, proxyAsLogic1, proxyAsLogic2, logic1, logic2} = await loadFixture(deployFixture);

      await proxy.changeImplementation(logic1.getAddress());
      assert.equal(await logic1.x(), 0);

      await proxyAsLogic1.changeX(45);
      assert.equal(await logic1.x(), 45);

      await proxy.changeImplementation(logic2.getAddress());
      assert.equal(await logic2.x(), 0);

      await proxyAsLogic2.changeX(25);
      await proxyAsLogic2.tripleX();
      assert.equal(await logic2.x(), 75);

      
    }); 
    
});
