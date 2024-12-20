// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import './StorageSlot.sol';
//EOA -> Proxy-> Logic1
//            -> Logic2
contract Proxy {
    //uint x = 0;
    //address implementation;

    //we use StorageSlot because test would fail at line 38. It's because it read storage slot "0x0" in proxy, and it is occupied by
    // address implementation variable. But now with StorageSlot we use a deterministic but random-looking slot for the
    // implementation address
    //keccak256('impl') generates a unique slot number very far from 0

    function changeImplementation(address _implementation) external {
        StorageSlot.getAddressSlot(keccak256('impl')).value = _implementation;
    }

    fallback() external {
        (bool success, ) = StorageSlot.getAddressSlot(keccak256('impl')).value.delegatecall(msg.data);
        require(success);
    }    
     
}

contract Logic1 {
    uint x = 0;

    function changeX(uint _x) external {
        x = _x;
    }
}


contract Logic2 {
    uint x = 0;

    function changeX(uint _x) external {
        x = _x;
    }

    function tripleX() external {
        x *= 3;
    }
}
