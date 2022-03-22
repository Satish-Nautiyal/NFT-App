export const Moralis = require('moralis');
import noimage from "../../assets/images/noimage";
require("jquery")
var serverUrl = "https://a6mx0qzskcmf.usemoralis.com:2053/server";
var appId = "fWZxyfpcs9HSh7tQQQ6RPbQ5g0sKjXm3gwkUW4L6";
Moralis.start({ serverUrl, appId});
console.log(Moralis.User.current())
if(Moralis.User.current()){
    var user = Moralis.User.current();
    $("#btnLogout").show();
    $("#btnConnect").hide();
    $("#profile").show();       
    var currentUserAddress = user.attributes.accounts[0];
}
else{
    $("#btnConnect").show(); 
    $("#btnLogout").hide(); 
    $("#profile").hide();   
}

//Login with MetaMask
$("#btnConnect").on("click",async function () {
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
    window.location.reload();
  }
)


//LogOut From Metamask  
$("#btnLogout").on("click",async function () {
    await Moralis.User.logOut();
    alert("logged out");
    window.location.reload();
})

  $("#content").html("");
//Get All NFTs of a specific user
window.getOwnedItems = async function() {
    const ownedItems = await Moralis.Cloud.run("getUserItems");
    console.log(ownedItems);
    ownedItems.forEach(function (nft) {
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

//Save NFTs into DataBase
window.saveNftsToDb = async function () {
    const EthTokenBlance = Moralis.Object.extend("EthTokenBalance");
    const userEthNFTs = await Moralis.Web3.getNFTs({ chain: "rinkeby", address: currentUserAddress});
    console.log(userEthNFTs);
    userEthNFTs.forEach(async function (nft) {
        const query = new Moralis.Query("EthTokenBalance");
        query.equalTo("token_id", parseInt(nft.token_id));
        query.equalTo("token_address", nft.token_address);
        const result = await query.find();
        console.log(result)
        if(result.length == 0) 
        {
            const nftBlance = new EthTokenBlance ();
            nftBlance.set("token_address", nft.token_address);
            nftBlance.set("token_uri", nft.token_uri);
            nftBlance.set("token_id", parseInt(nft.token_id));
            nftBlance.set("owner_of", currentUserAddress);
            nftBlance.set("contract_type", nft.contract_type);
            nftBlance.set("amount", nft.amount);
            nftBlance.save();
        }
    });
    getOwnedItems();
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
        return noimage;
    }
    
}

//Save File To IPFS and upload metadata in json format in ipfs
$("#create-nft").on("click",async function(){
    $("#create-nft").prop('disabled', true);
    const data = $("input[type=file][name=upload_file]").prop('files')[0];
        const file = new Moralis.File(data.name, data)
        await file.saveIPFS();
        const imageURI = file.ipfs();
        //console.log(imageURI);
        const metadata = {
            "name":$("#name").val(),
            "description":$("#description").val(),
            "image":imageURI
        }
        const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
        await metadataFile.saveIPFS();
        const metadataURI = metadataFile.ipfs();
        console.log(metadataURI);
        mint_nft(metadataURI);
})

//Mint_nft
window.mint_nft = async function(metadataURI) { 
    const metadata = metadataURI;
    web3 = await Moralis.enableWeb3();
    const ABI = [{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_metadata",
				"type": "string"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},];
    const options = {
    contractAddress: "0xE1dD9A07A9BC7Ab61f486602dd029A73A543735D",
    functionName: "mint",
    abi: ABI,
    params: { account: currentUserAddress, amount: 1, _metadata: metadata},
    msgValue: 0
    };
    const allowance = await Moralis.executeFunction(options);
    console.log(allowance);
}

window.openUserInfo = async () => {
    if(user)
    {
        $("#username").val(user.get("username"));
        if(user.get("email")){
            $("#email").val(user.get("email"));
        }
        if(user.get("avatar"))
        {
            $("#user-avatar").attr("src", user.get("avatar").url());
        }
        else if(!user.get("avatar"))
        {
            $("#user-avatar").attr("src", noimage);
        }
    }
    else{
        $("#btnConnect").click();
    }
}

//Update Profile
window.updateProfile = async () => {
    if(user)
    {   
        user.set("username",$("#username").val());
        user.set("email",$("#email").val());
        if($("#avatar").prop("files").length > 0 ){
            let tempPath = URL.createObjectURL($("#avatar").prop("files")[0]);
            $("#user-avatar").attr("src",tempPath);
            var avatar = new Moralis.File("avatar.jpg", $("#avatar").prop("files")[0]);
            user.set("avatar", avatar);
        }
    }
    try{
        await user.save();
        Toastify({
            text: "Profile Updated Successfully",    
            duration: 2000 ,
            style: {
                background: "green", margin: "auto"
            }  
        }).showToast();
    }
    catch(error){
        Toastify({
            text: error,    
            duration: 4000 ,
            style: {
                background: "red", margin: "auto"
            }  
        }).showToast();
    };
}
