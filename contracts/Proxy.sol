// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

//EOA -> Proxy-> Logic1
//            -> Logic2
contract Proxy {
    address implementation;

    function changeImplementation(address _implementation) external {
        implementation = _implementation;
    }

    fallback() external {
        (bool success, ) = implementation.call(msg.data);
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
