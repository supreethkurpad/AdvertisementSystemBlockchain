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

        console.log(await getAllAds(App.uid));
        await renderAds()
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
    },
    getUserInterests: async (userId) => {
        return await App.AdManager.getUserInterests(userId);
    },
    addViewer: async (adId, interests, address) => {
        return await App.AdManager.addViewer(adId, interests, address)
    }
}

function pickN(numAds) {
    let adCount = App.AdManager.adCount();
    let ub = Math.min(numAds, adCount);
    let adsToBeDisplayed = []
    for(var i = 1; i<=ub; i++) {

    }
}

window.onload = (event) => {
    App.load()
}
