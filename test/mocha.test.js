const {assert} = require('chai')

const nftBazaar = artifacts.require('./nftBazaar');

//check for chai

require('chai')
.use(require('chai-as-promised'))
.should()

contract('nftBazaar', (accounts) => {
    let contract
    //before tells our tests to run this before anything else
    before( async () =>{
    contract = await nftBazaar.deployed()
    })

    //testing container - describe

    describe('deployment', async()=> {
        //test samples with writing it
        it('deploys successfully', async() => {
            const address = contract.address;
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            assert.notEqual(address, 0x0)
        })
        
        it('has a name', async()=>{
            const name = await contract.name();
            assert.equal(name, 'Non - Fungible Token')
        })

        it('has a symbol', async()=>{
            const symbol = await contract.symbol();
            assert.equal(symbol, 'NFT')
        })
    })

    describe('minting', async()=>{
        it('creates a new token', async()=>{
            const result = await contract.mint('https...1')
            const totalSupply = await contract.totalSupply()
            //Success
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event._from, '0x0000000000000000000000000000000000000000', 'from is the contract')
            assert.equal(event._to, accounts[0], 'to is msg.sender')
            //Failure
            await contract.mint('https...1').should.be.rejected;
        })
    })

    describe('indexing', async()=>{
        it('lists tokens', async()=>{
            await contract.mint('https...2')
            await contract.mint('https...3')
            await contract.mint('https...4')
            const totalSupply = await contract.totalSupply()

            let result = [];
            let nftBazaar;

            for(i = 1; i <= totalSupply; i++){
                token = await contract.tokens(i - 1)
                result.push(token)            
            }
            //assert that our new array result will equal our expected result
            let expected = ['https...1', 'https...2', 'https...3', 'https...4']
            assert.equal(result.join(','), expected.join(','))
        })
    })
})