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
                    <div className='row'>
                        <main role='main' className='col-lg-12 d-flex text-center'>
                            <div className='mr-auto ml-auto'>
                                <h1 style={{color:'white'}}>Yeni bir NFT yaratın</h1>
                                <p>Resim, video, ses veya 3B bir model yükleyin</p>
                                <form onSubmit={(event)=>{
                                    event.preventDefault()
                                    const nft_mint = this.nft_mint.value
                                    this.mint(nft_mint)
                                }}>
                                    <input
                                    type='text'
                                    placeholder='Dosya linkini girin'
                                    className='form-control mb1'
                                    ref={(input)=>this.nft_mint = input}
                                    />
                                    <input
                                    style={{margin:'6px'}}
                                    type='submit'
                                    className='btn btn-primary btn-light'
                                    value='MINT'
                                    />
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;