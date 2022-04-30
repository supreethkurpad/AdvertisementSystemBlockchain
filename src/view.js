const username = "supreeth"
var uid=1;
var vid=1;

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
        console.log(App.account);
    },
    loadContract: async() => {
        const adm = await $.getJSON('AdManager.json')
        App.contracts.AdManager = TruffleContract(adm)
        App.contracts.AdManager.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
        App.AdManager = await App.contracts.AdManager.deployed()
        await App.createUser(username)
        uid = await App.AdManager.getUid(username)
        console.log(uid.toString())
    }

    
    ,
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function viewAds(){
    
    let adCount = await App.AdManager.adCount();
    console.log(adCount)
    let ads = [];
    //console("print something atleast")
    for(i = 1; i<=3; i++) {
    index = getRandomInt(1,adCount);
    console.log(index);
    let ad = await App.AdManager.advertisements(index);
    let id = ad["id"].toString();
    let idd = ad["id"]
    //let ownerId = ad["ownerId"].toString();
    let content = ad["content"].toString();
    ads.push({id: id, content:content})
    console.log(id)
    console.log(content)
    //document.getElementById('ad_display').innerHTML += '<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">';
    //document.getElementById('ad_display').innerHTML += '<div class="d-flex w-100 justify-content-between">'
    document.getElementById('ad_display').innerHTML += '<li class="list-group-item">'+content+' '+id  +'</li>';
   // document.getElementById('ad_display').innerHTML += '<small>'+id+'</small>';
    console.log("id="+idd+" "+"uid="+vid)}
    let response = await App.addViewer(1,  1);
    let response2 = await App.getViewerId(1, 8);
    console.log(response)
    console.log(response2)
}
/*
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
*/
window.onload = (event) => {
    App.load()
    
}
