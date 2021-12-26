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

export async function getProfileFromFind(name) {
  return fcl.query({
    cadence: `
      import FIND from 0xFIND
      import Profile from 0xProfile

      pub fun main(name: String) :  Profile.UserProfile? {
        return FIND.lookup(name)?.asProfile()
      }
    `,
    args: (arg, t) => [arg(name, t.String)],
  });
}

export async function getName(address) {
  return fcl.query({
    cadence: `
    import FIND from 0xFIND
    import Profile from 0xProfile
    
    // Check the status of a find user
    pub fun main(address: Address) : String?{
    
      let account=getAccount(address)
      let leaseCap = account.getCapability<&FIND.LeaseCollection{FIND.LeaseCollectionPublic}>(FIND.LeasePublicPath)
    
      if !leaseCap.check() {
        return nil
      }
    
      let profile= Profile.find(address).asProfile()
      let leases = leaseCap.borrow()!.getLeaseInformation() 
      var time : UFix64?= nil
      var name :String?= nil
      for lease in leases {
    
        //filter out all leases that are FREE or LOCKED since they are not actice
        if lease.status != "TAKEN" {
          continue
        }
    
        //if we have not set a 
        if profile.findName == "" {
          if time == nil || lease.validUntil < time! {
            time=lease.validUntil
            name=lease.name
          }
        }
    
        if profile.findName == lease.name {
          return lease.name
        }
      }
      return name
    }
    `,
    args: (arg, t) => [arg(address, t.Address)],
  });
}

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
