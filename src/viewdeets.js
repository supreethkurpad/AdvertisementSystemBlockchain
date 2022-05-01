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
        await viewAdss();
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
    addViewer: async(adId, userId) => {
        return await App.AdManager.addViewer.call(adId, userId, {from: App.account});
    },
    getViewerAddress: async(adId, index) => {
        return await App.AdManager.getViewerAddress(adId, index, {from:  App.account});
    },
    getUid: async(username) => {
        return await App.AdManager.getUid(username)
    },
    getViewerInterests: async (adId, index) => {
        return await App.AdManager.getViewerInterests(adId, index);
    },
    addViewer: async (adId, interests, address) => {
        return await App.AdManager.addViewer(adId, interests, address)
    },
    getUserInterests: async (id) => {
        return await App.AdManager.getUserInterests(id);
    }

}

async function getAllAds(owner) {
    let adCount = await App.AdManager.adCount();
    let ads = [];
    for(var index = 1; index<=adCount; index++) {
        let ad = await App.AdManager.advertisements(index);
        let id = ad["id"];
        let ownerId = ad["ownerId"].toString();
        let content = ad["content"]
        let viewCount = ad["viewCount"]

        if(ownerId === owner) {
            ads.push({id: id, content:content, viewCount: viewCount})
        }
    }
    return ads
}

window.onload = (event) => {
    App.load()  
}

async function viewAdss(){
    let ads = await getAllAds(App.uid);
    let root1 = document.getElementById("viewerdeets");
    
    ads.forEach(async ad => {
        let htm = `<h4 style="padding: 4px;">Viewers</h4>`;
        for(var i = 1; i<=ad["viewCount"]; i++) {
                count = 1;
                let add = await App.getViewerAddress(ad["id"], i);
                let ex = await App.getViewerInterests(ad["id"], i);
                htm += `<div class = "card" style="background-color:#b0f7ff"><li><h5>Address</h5><small>${add}</small></li><li><h5>Interests</h5><small>${ex}</small></li></div>`;
        }
        
        if(ad["viewCount"] == 0) htm = 'No Viewers Currently';
        else htm = `<ul>${htm}</ul>`
        root1.innerHTML += `<div class = "card">
        <h3>Content</h3>
        <p>${ad["content"]}</p>
        <ul>
            <li style="padding: 4px;">
                <div>
                    ${htm}
                </div>
            </li>
        </ul>
        </div>`;
    })
}