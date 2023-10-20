// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;
    address public lastAddr;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
        lastAddr = msg.sender;
    }

    function increment() public {
        number++;
        lastAddr = msg.sender;
    }

    function decrement() public {
        number--;
        lastAddr = msg.sender;
    }

    function showAddress() public view returns (address) {
        return lastAddr;
    }
}
