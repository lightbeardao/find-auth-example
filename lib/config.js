import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("0xFlowToken", "0x7e60df042a9c0868");

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
