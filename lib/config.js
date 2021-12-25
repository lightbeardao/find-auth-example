import * as fcl from "@onflow/fcl";

const config = {
  mainnet: {
    accessNode: "https://access-mainnet-beta.onflow.org",
    wallet: "https://fcl-discovery.onflow.org/authn",
    "0xFungibleToken": "0xf233dcee88fe0abe",
    "0xFUSD": "0x3c5959b568896393",
    "0xProfile": "0x97bafa4e0b48eef",
    "0xFIND": "0x97bafa4e0b48eef",
  },
  testnet: {
    accessNode: "https://access-testnet.onflow.org",
    wallet: "https://fcl-discovery.onflow.org/testnet/authn",
  },
};

let c = config.mainnet;

fcl
  .config()
  .put("accessNode.api", c.accessNode)
  .put("discovery.wallet", c.wallet)
  .put("0xFIND", c["0xFIND"])
  .put("0xProfile", c["0xProfile"])
  .put("0xFUSD", c["0xFUSD"])
  .put("0xFungibleToken", c["0xFungibleToken"]);

export async function getProfile(user) {
  return fcl.query({
    cadence: `
        import Profile from 0xProfile

        //Check the status of a fin user
        pub fun main(address: Address) :  Profile.UserProfile? {
          return getAccount(address)
            .getCapability<&{Profile.Public}>(Profile.publicPath)
            .borrow()?.asProfile()
        }
        `,
    args: (arg, t) => [arg(user?.addr, t.Address)],
  });
}

export async function myScript() {
  return fcl.query({
    cadence: `
        import FlowToken from 0xFlowToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

        pub fun main(): UFix64 { 
          return FlowToken.totalSupply  // arbitrary script that can access FlowToken interface
        }
      `,
  });
}
