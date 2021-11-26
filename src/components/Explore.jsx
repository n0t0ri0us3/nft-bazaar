import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import nftBazaar from '../abis/nftBazaar.json'
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn} from 'mdb-react-ui-kit';
import './App.css';

class App extends Component{
    async componentDidMount(){
        await this.loadWeb3();
        await this.loadBlockchainData();
    }
    //detect ethereum provider
    async loadWeb3(){
        const provider = await detectEthereumProvider();

        //modern browsers
        if(provider){
            console.log('ethereum wallet is connected')
            window.web3 = new Web3(provider)
        } else{
            //no ethereum provider
            console.log('No ethereum wallet detected')
        }
    }

    async loadBlockchainData(){
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        console.log(this.state.account)

        const networkId = await web3.eth.net.getId()
        const networkData = nftBazaar.networks[networkId]
        
        if(networkData){
            const abi = nftBazaar.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address)
            this.setState({contract:contract})

            //call the total supply of CryptoBirdz

            const totalSupply = await contract.methods.totalSupply().call()
            this.setState({totalSupply:totalSupply})

            console.log(this.state.totalSupply)

            //set up an array to keep track of tokens

            for(let i = 1; i <= totalSupply; i++){
                const token = await contract.methods.tokens(i - 1).call()
                this.setState({
                    //spread operation for concatenating
                    minted_nfts:[...this.state.minted_nfts, token]
                })
            }

        } else{
            window.alert('Smart contract not deployed')
        }
    }

    mint = (nft_mint) =>{
        window.ethereum.enable()
        this.state.contract.methods.mint(nft_mint).send({from:this.state.account})
        .once('receipt', (receipt) =>{
            this.setState({
                //spread operation for concatenating
                minted_nfts:[...this.state.minted_nfts, nft_mint]
            })
        })
    }

    //While minting we are senfing information and we need to specify the account

    constructor(props){
        super(props);
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            minted_nfts: []
        }
    }

    render(){
        return(
            <div className='container-filled'>
                <div className='background-image'></div>
                <div className='container-fluid mt-1'>
                        <div className='row textCenter'>
                            {this.state.minted_nfts.map((nft_mint, key)=>{
                                return(
                                    <div>
                                        <div>
                                            <MDBCard className='token img' style={{maxWidth:'22rem'}}>
                                                <MDBCardImage src={nft_mint} position='top' style={{marginRight:'4px'}}/>
                                                <MDBCardBody>
                                                    <MDBCardTitle style={{color:'white'}}>NFT Token</MDBCardTitle>
                                                    <MDBCardText style={{color:'white'}}>NFT Açıklaması</MDBCardText>
                                                    <MDBBtn href={nft_mint} className='btn btn-light'>İndir</MDBBtn>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                </div>
            </div>
        )
    }
}

export default App;