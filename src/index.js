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

async function renderAds() {
    let ads = await getAllAds(App.uid);
    let root = document.getElementById("root");
    
    
    ads.forEach(async ad => {
        let htm = '';
        for(var i = 1; i<=ad["viewCount"]; i++) {
            let add = await App.getViewerAddress(ad["id"], i);
            let ex = await App.getViewerInterests(ad["id"], i);
            htm += `<h4 style="padding: 4px;">Viewer</h4><li><h5>Address</h5><small>${add}</small></li><li><h5>Interests</h5><small>${ex}</small></li>`;
        }
    

        if(htm === '') htm = 'No Viewers Currently';
        else htm = `<ul>${htm}</ul>`

        root.innerHTML += `<div class = "card">
        <h3>Advertisement Id</h3>
        <p>${ad["id"]}</p>
        <h3>Content</h3>
        <p>${ad["content"]}</p>
        <h3>View Count</p>
        <p>${ad["viewCount"]}</p>
        <h3>Viewer Details</h3>
        <button type="submit" class="btn btn-info" onclick="viewAds()">Viewer Details</button></div>
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
async function createAdRoute () {
    let content = document.getElementById("content").value;
    let numAds = Number(document.getElementById("slots").value);

    let response = await App.createAd(App.uid, content, numAds);
    alert("Advertisement Created Successfully\nTransaction Hash: " + response.receipt.transactionHash)
}

async function login() {
    let username = document.getElementById("username").value;
    localStorage.setItem("username", username);
    let uid = await App.getUid(username);
    let interests = await App.getUserInterests(uid);
    localStorage.setItem("uid", uid);
    localStorage.setItem("interests", interests);

    localStorage.setItem("address", App.account);
    window.location.replace('http://localhost:3000/ad.html')
}

window.onload = (event) => {
    App.load()
}

async function signup(){
    let username = document.getElementById("username").value;
    let interests = document.getElementById("interest").value;
    let response = await App.createUser(username, interests);
    alert("User Created Successfully");
    window.location.replace('http://localhost:3000/index.html')
}