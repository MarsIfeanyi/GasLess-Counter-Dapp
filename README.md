# GasLess Counter Dapp

- This is a Decentralized Application (Dapp) that implements `Account Abstraction`. It has functions that allows a user to interact with a `Counter` contract to increase and decrease state without paying `gas` fees for that transaction.

- All the Write Operations on the `Counter` contract is gasless using [ERC4337](https://eips.ethereum.org/EIPS/eip-4337)

- It also has a view function that returns the address of the last user to interact with the Dapp.
