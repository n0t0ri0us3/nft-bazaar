// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

contract nftBazaar is ERC721Connector{
    string[] public tokens;

    mapping(string => bool) _tokenExists;

    function mint(string memory _token) public{
        require(!_tokenExists[_token], 'Error - token already exists');
        
        tokens.push(_token);
        uint256 _id = tokens.length - 1;

        _mint(msg.sender, _id);

        _tokenExists[_token] = true;
    }
    constructor() ERC721Connector('Non - Fungible Token', 'NFT'){

    }
}