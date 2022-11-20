// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenERC20 is ERC20 {
    
    constructor (string memory name, string memory symbol) ERC20(name, symbol) public {
        
        _mint(msg.sender, 10000 * 10 ** 18 );

    }
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}