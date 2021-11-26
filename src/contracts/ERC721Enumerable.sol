// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721.sol';
import './interfaces/IERC721Enumerable.sol';

contract ERC721Enumerable is ERC721, IERC721Enumerable{
    uint256[] private _allTokens;

    //mapping from tokenId to position in _allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;
    //mapping of owner to list of all owner token ids
    mapping(address => uint256[]) private _ownedTokens;
    //mapping from tokenid to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    constructor(){
        _registerInterface(bytes4(keccak256('totalSupply(bytes4)')^
        keccak256('tokenByIndex(bytes4)')^keccak256('tokenOfOwnerByIndex(bytes4)')));
    }

    function _mint(address to, uint256 tokenId) internal override(ERC721){
        super ._mint(to, tokenId);
        //add tokens to the owner
        //all tokens to our totalsupply - to allTokens
        _addTokensToAllTokenEnumeration(tokenId);
        _addTokensToOwnerEnumeration(to, tokenId);
    }

    //add tokens to the _alltokens array and set the position of token indexes
    function _addTokensToAllTokenEnumeration(uint256 tokenId) private{
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    function _addTokensToOwnerEnumeration(address to, uint256 tokenId) private{
        //add address and token id to the _ownedTokens
        _ownedTokens[to].push(tokenId);        
        //_ownedTokensIndex tokenId set to address of _ownedTokens position
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        //execute the function with minting - SEE function _mint
    }

    //two functions - one that returns tokenByIndex
    //one that returns tokenOfOwnerByIndex

    function tokenByIndex(uint256 index) public override view returns(uint256){
        //make sure that the index is not out of bounds of the total supply
        require(index < totalSupply(), 'Global index is out of bounds');
        return _allTokens[index];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public override view returns(uint256){
        require(index < balanceOf(owner), 'Owner index is out of bounds');
        return _ownedTokens[owner][index];
    }

    //return the total supply of the _allTokens array
    function totalSupply() public override view returns(uint256){
        return _allTokens.length;
    }
}