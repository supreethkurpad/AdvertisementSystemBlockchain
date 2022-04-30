App = {
    contracts: {},
    load: async() => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.createUser()
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
    createUser: async () => {
        await App.AdManager.createUser({from:  App.account})
        // console.log(await App.AdManager.users(1))
    },
    createAd: async (ownerId, content, numAds) => {
        return await App.AdManager.createAd(ownerId, content, numAds, {from:  App.account});
    },
    addViewer: async(adId, userId) => {
        return await App.AdManager.addViewer.call(adId, userId, {from: App.account});
    }
}


async function createAdRoute () {
    let content = document.getElementById("content").value;
    let numAds = Number(document.getElementById("num-ads").value);
    let x = await App.createAd(1,content, numAds);
    // x = await App.addViewer(1,1);

    // x = await App.ad()

    x = await App.AdManager.advertisements(1);
    console.log(x)
}

window.onload = (event) => {
    App.load()
}
