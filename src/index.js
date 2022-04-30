const username = "supreeth"
var uid;

App = {
    contracts: {},

    load: async() => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
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
        App.contracts.AdManager.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
        App.AdManager = await App.contracts.AdManager.deployed()
        await App.createUser(username)
        uid = await App.AdManager.getUid(username)
        console.log(uid.toString())
    },
    createUser: async (username) => {
        await App.AdManager.createUser(username, {from:  App.account})
    },
    createAd: async (ownerId, content, numAds) => {
        return await App.AdManager.createAd.sendTransaction(ownerId, content, numAds, {from:  App.account, value: web3.utils.toWei(String(1), 'ether'), gas: 3000000});
    },
    addViewer: async(adId, userId) => {
        return await App.AdManager.addViewer.call(adId, userId, {from: App.account});
    },
    getViewerId: async(adId, index) => {
        return await App.AdManager.getViewerId(adId, index, {from:  App.account});
    },
    getUid: async(username) => {
        return await App.AdManager.getUid(username)
    }
}


async function getAllAds(owner) {
    let adCount = await App.AdManager.adCount();
    console.log(adCount)
    let ads = [];
    for(index = 1; index<=adCount; index++) {
        let ad = await App.AdManager.advertisements(index);
        let id = ad["id"].toString();
        let ownerId = ad["ownerId"].toString();
        let content = ad["content"]
        if(ownerId === owner) {
            ads.push({id: id, content:content})
        }
    }
    return ads
}

async function createAdRoute () {
    let content = document.getElementById("content").value;
    let numAds = Number(document.getElementById("num-ads").value);
    let response = await App.createAd(uid, content, numAds);
    console.log(response)
}

window.onload = (event) => {
    App.load()
}
