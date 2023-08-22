# NuLink web agent integration demo

<p align="center">
  <a href="https://www.nulink.org/"><img src="https://github.com/NuLink-network/nulink-resource/blob/94c5538a5fdc25e7d4391f4f2e4af60b3c480fc1/logo/nulink-bg-1.png" width=40%  /></a>
</p><p align="center">
  <a href="https://github.com/NuLink-network"><img src="https://img.shields.io/badge/Playground-NuLink_Network-brightgreen?logo=Parity%20Substrate" /></a>
  <a href="http://nulink.org/"><img src="https://img.shields.io/badge/made%20by-NuLink%20Foundation-blue.svg?style=flat-square" /></a>
  <a href="https://github.com/NuLink-network/nulink-web-agent-integration-demo"><img src="https://img.shields.io/badge/project-Nulink_SDK-yellow.svg?style=flat-square" /></a>
</p>NuLink agent integration demo is a demo for integration nulink-web-agent project.

## How to Use

### Build Source


```bash
1. Rename .env.example to .env
2. Modify config:
  // The SDK backend testnet server address. In the NuLink testnet,
  // you can use the address: https://agent-integration-demo.nulink.org/bk
  REACT_APP_CENTRALIZED_SERVER_URL=xxxxx
  // The SDK backend testnet server http(s) api base auth username and password. In the NuLink testnet,
  // you can use the address: REACT_APP_SERVER_USERNAME=nulink / REACT_APP_SERVER_PASSWORD=privacyshareisgood
  REACT_APP_SERVER_USERNAME=xxxxxx
  REACT_APP_SERVER_PASSWORD=xxxxxx
  // Your IPFS address, requires permission to write data. In the NuLink testnet,
  // you can use the address: https://agent-integration-demo.nulink.org/nuipfs
  REACT_APP_IPFS_NODE_URL=xxxxx

  // The SDK agent web address. In the NuLink testnet,
  // you can use the address: https://agent.testnet.nulink.org/
  REACT_APP_NULINK_AGENT_URL=xxxxx 

3. yarn install
4. yarn build
5. yarn start
```
