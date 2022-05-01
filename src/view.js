const username = localStorage.getItem("username");
var uid = localStorage.getItem("uid");

App = {
    contracts: {},
    username: null,
    uid: null,
    load: async() => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        const username = localStorage.getItem("username");
        const uid = localStorage.getItem("uid");
        App.username = username;
        App.uid = uid;

    },

    loadWeb3: async () => {
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                await ethereum.enable();
                web3.eth.sendTransaction({/* ... */});
            } catch (error) {

            }
        }
        else if (window.web3) {
            console.log("Using Legacy")
            window.web3 = new Web3(web3.currentProvider);
            web3.eth.sendTransaction({/* ... */});
        }
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    },
    loadAccount: async () => {
        const accounts = await web3.eth.getAccounts();
        App.account = accounts[0];
    },
    loadContract: async() => {
        const adm = await $.getJSON('AdManager.json')
        App.contracts.AdManager = TruffleContract(adm)
        App.contracts.AdManager.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
        App.AdManager = await App.contracts.AdManager.deployed()
    },
    createUser: async (username, interest) => {
        await App.AdManager.createUser(username, interest, {from:  App.account})
    },
    createAd: async (ownerId, content, numAds) => {
        return await App.AdManager.createAd.sendTransaction(ownerId, content, numAds, {from:  App.account, value: web3.utils.toWei(String(1), 'ether'), gas: 3000000});
    },
    addViewer: async(adId, interest, userId) => {
        return await App.AdManager.addViewer(adId, interest, userId, {from: App.account});
    },
    getViewerAddress: async(adId, index) => {
        return await App.AdManager.getViewerAddress(adId, index, {from:  App.account});
    },
    getUid: async(username) => {
        return await App.AdManager.getUid(username)
    },
    getUserInterests: async (userId) => {
        return await App.AdManager.getUserInterests(userId);
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function viewAds(){
    
    let adCount = await App.AdManager.adCount();
    // console.log(adCount)
    for(i = 1; i<=3; i++) {
        var interest = localStorage.getItem("interests");
        var address = localStorage.getItem("address");

        index = getRandomInt(1,adCount);
    //     // console.log(index);
        let ad = await App.AdManager.advertisements(index);
        let id = ad["id"];
        let content = ad["content"].toString();

        document.getElementById('ad_display').innerHTML += '<li class="list-group-item">'+content+' '+id  +'</li>';
        await App.addViewer(id, interest, address);
        let after = await App.AdManager.advertisements(index);
        let vc = after["viewCount"]
        console.log(vc);
    //     console.log(a)
        console.log("Viewer added")
    // }
    // let response = await App.addViewer(1,  1);
    // let response2 = await App.getViewerId(1, 8);
    // console.log(response)
    // console.log(response2)
}
}
window.onload = (event) => {
    App.load()  
}
