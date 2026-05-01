import { expect } from "chai";
import { ethers } from "hardhat";

describe("PrivateGrantVault", function () {
  async function deployFixture() {
    const [sponsor, builder, auditor, stranger] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("PrivateGrantTestToken");
    const token = await Token.deploy();
    const Vault = await ethers.getContractFactory("PrivateGrantVault");
    const vault = await Vault.deploy();

    return { sponsor, builder, auditor, stranger, token, vault };
  }

  async function createCampaignFixture() {
    const fixture = await deployFixture();
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 86_400);
    const tx = await fixture.vault.createCampaign(
      "Retroactive Builder Grants",
      "Private reward stream for shipped ecosystem work",
      await fixture.token.getAddress(),
      ethers.ZeroAddress,
      "grant",
      25_000_000_000n,
      deadline,
      fixture.auditor.address
    );
    const receipt = await tx.wait();
    const event = receipt?.logs
      .map((log) => {
        try {
          return fixture.vault.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((log) => log?.name === "CampaignCreated");

    return { ...fixture, campaignId: event?.args.id as bigint };
  }

  it("creates a campaign with public metadata", async function () {
    const { vault, token, sponsor, auditor } = await deployFixture();
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 86_400);

    await expect(
      vault.createCampaign(
        "Hackathon Rewards",
        "Confidential finalist payouts",
        await token.getAddress(),
        ethers.ZeroAddress,
        "hackathon reward",
        10_000_000n,
        deadline,
        auditor.address
      )
    )
      .to.emit(vault, "CampaignCreated")
      .withArgs(
        1n,
        sponsor.address,
        await token.getAddress(),
        ethers.ZeroAddress,
        "Hackathon Rewards",
        "hackathon reward",
        10_000_000n,
        deadline,
        auditor.address
      );

    const campaign = await vault.getCampaign(1);
    expect(campaign.sponsor).to.equal(sponsor.address);
    expect(campaign.isActive).to.equal(true);
  });

  it("only lets the sponsor close a campaign", async function () {
    const { vault, campaignId, stranger, sponsor } = await createCampaignFixture();

    await expect(vault.connect(stranger).closeCampaign(campaignId)).to.be.revertedWithCustomError(
      vault,
      "NotCampaignSponsor"
    );
    await expect(vault.connect(sponsor).closeCampaign(campaignId))
      .to.emit(vault, "CampaignClosed")
      .withArgs(campaignId, sponsor.address);

    const campaign = await vault.getCampaign(campaignId);
    expect(campaign.isActive).to.equal(false);
  });

  it("emits safe payout metadata without plaintext private amount", async function () {
    const { vault, campaignId, builder, sponsor } = await createCampaignFixture();
    const handle = ethers.keccak256(ethers.toUtf8Bytes("encrypted payout handle"));

    await expect(vault.recordPayout(campaignId, builder.address, handle, "Milestone 1"))
      .to.emit(vault, "PayoutRecorded")
      .withArgs(campaignId, sponsor.address, builder.address, handle, "Milestone 1");

    const event = vault.interface.getEvent("ConfidentialPayoutSent");
    const inputs = event.inputs.map((input) => `${input.type} ${input.name}`);
    expect(inputs).to.not.include("uint256 amount");
    expect(inputs.join("|")).to.not.include("plaintext");
  });

  it("rejects invalid token and campaign input", async function () {
    const { vault } = await deployFixture();
    await expect(
      vault.createCampaign(
        "",
        "Description",
        ethers.ZeroAddress,
        ethers.ZeroAddress,
        "grant",
        1n,
        0n,
        ethers.ZeroAddress
      )
    ).to.be.revertedWithCustomError(vault, "EmptyString");

    await expect(vault.getCampaign(999)).to.be.revertedWithCustomError(vault, "InvalidCampaign");
  });

  it("rejects invalid payout metadata", async function () {
    const { vault, campaignId, builder } = await createCampaignFixture();

    await expect(
      vault.recordPayout(campaignId, builder.address, ethers.ZeroHash, "bad")
    ).to.be.revertedWithCustomError(vault, "InvalidPayoutReference");
  });
});
