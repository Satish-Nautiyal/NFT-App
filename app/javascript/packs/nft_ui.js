export const Moralis = require('moralis');
import noimage from "../../assets/images/noimage"
require("jquery")
var serverUrl = "https://a6mx0qzskcmf.usemoralis.com:2053/server";
var appId = "fWZxyfpcs9HSh7tQQQ6RPbQ5g0sKjXm3gwkUW4L6";
Moralis.start({ serverUrl, appId});


//Login with MetaMask
const login = async function() {
    let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          alert(error.message);
        });
    }
    else
    {
        $("#btnConnect").hide();
    }
  }

var currentUserAddress = Moralis.User.current().attributes.accounts[0];

//LogOut From Metamask  
const logOut = async function() {
    await Moralis.User.logOut();
    alert("logged out");
  }
  $("#content").html("");
//Get All NFTs of a specific user
window.nftCollection = async function() {
    const userEthNFTs = await Moralis.Web3.getNFTs({ chain: "rinkeby", accounts: currentUserAddress});
    userEthNFTs.forEach(function (nft) {
        let url = fixURL(nft.token_uri);
        fetch(url)
        .then(response => response.json())
        .then(data =>{
            $("#content").append(" \
                <div class='bg-gray-600 hover:scale-110 w-[14rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer'> \
                    <div class=' bg-white h-2/3 w-full overflow-hidden flex justify-center items-center'> \
                        <img src='"+fixURL(data.image)+"' alt='"+data.name+"' class='w-full object-cover' /> \
                    </div> \
                    <div class='p-3'> \
                        <div class='flex justify-between text-[#e4e8eb] drop-shadow-xl'> \
                            <div class='flex-0.6 flex-wrap'> \
                                <div class='font-semibold text-sm text-[#8a939b]'>title</div> \
                                <div id='nft-name' class='font-bold text-lg mt-2 overflow-hidden w-[150px]'>"+data.name+"</div> \
                            </div> \
                            <div class='flex-0.4 text-right'></div>\
                            <div class='font-semibold text-sm text-[#8a939b]'>Price</div> \
                            <div id='nft-price' class='flex items-center text-xl font-bold mt-2'> \
                                <img src='https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg' alt='eth' class='h-5 mr-2' id='nft-image'/> \
                            </div> \
                        </div> \
                    </div> \
                    <div class='text-[#8a939b] font-bold flex items-center w-full justify-end mt-3'> \
                        <span id='nft-like' class='text-xl mr-2'> \
                        </span> \
                    </div> \
                </div>    ");
        }).catch((error)=>{
            $("#content").append(" \
                <div class='bg-gray-600 hover:scale-110 w-[14rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer'> \
                    <div class='bg-white h-2/3 w-full overflow-hidden flex justify-center items-center'> \
                        <img src='"+noimage+"' alt='noimage' class='h-auto w-full object-cover' /> \
                    </div> \
                    <div class='p-3'> \
                        <div class='flex justify-between text-[#e4e8eb] drop-shadow-xl'> \
                            <div class='flex-0.6 flex-wrap'> \
                                <div class='font-semibold text-sm text-[#8a939b]'>title</div> \
                                <div id='nft-name' class='font-bold text-lg mt-2 overflow-hidden w-[150px]'>Unnamed</div> \
                            </div> \
                            <div class='flex-0.4 text-right'></div>\
                            <div class='font-semibold text-sm text-[#8a939b]'>Price</div> \
                            <div id='nft-price' class='flex items-center text-xl font-bold mt-2'> \
                                <img src='https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg' alt='eth' class='h-5 mr-2' id='nft-image'/> \
                            </div> \
                        </div> \
                    </div> \
                    <div class='text-[#8a939b] font-bold flex items-center w-full justify-end mt-3'> \
                        <span id='nft-like' class='text-xl mr-2'> \
                        </span> \
                    </div> \
                </div>");
        })
    });
}

// Fix Urls which don't start with https://
function fixURL(url) {
    if(url != null){
        if(url.startsWith("ipfs")){
            return "https://ipfs.io/ipfs/"+url.split("ipfs://ipfs/").slice(-1);
        }
        else
        {
            return url;
        }
    }
    else{
        return "../assets/images/noimage.png";
    }
    
}

//Upload metadata of NFT
function upload_data_to_ipfs()
{

}

//Mint_nft
window.mint_nft = async function() {
    web3 = await Moralis.enableWeb3();
    const ABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                },
                {
                    "indexed": false,
                    "internalType": "uint256[]",
                    "name": "values",
                    "type": "uint256[]"
                }
            ],
            "name": "TransferBatch",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "TransferSingle",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "value",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "URI",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "ART",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "accounts",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                }
            ],
            "name": "balanceOfBatch",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "metadata_uri",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeBatchTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_metadata_uri",
                    "type": "string"
                }
            ],
            "name": "set_meta_data",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "uri",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }];
    const options = {
    contractAddress: "0x88af08386A4915DAb009f1F17551170013d9a53d",
    functionName: "mint",
    abi: ABI,
    params: { account: currentUserAddress,id: 1, amount: 1  },
    msgValue: 0
    };
    const allowance = await Moralis.executeFunction(options);
    console.log(allowance);
}

const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;
const LogoutButton = document.getElementById("btnLogout");
LogoutButton.onclick = logOut;
const userProfileButton = document.getElementById("btnProfile");

const createNftButton = document.getElementById("create-nft");
createNftButton.onclick = upload_data_to_ipfs();




