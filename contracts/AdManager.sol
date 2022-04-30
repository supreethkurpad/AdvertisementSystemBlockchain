// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract AdManager {
    uint public adCount = 0;
    uint public userCount = 0;
    uint public recent = 0;

    mapping(string => uint) public uId;
    mapping(uint => User) public users;
    mapping(uint => Ad) public advertisements;

    address payable owner;

    struct Ad {
        uint ownerId;
        uint id;
        string content;
        uint adCount;
        uint viewCount;
        mapping(uint => Viewer) viewers;
    }

    struct User {
        uint userId;
        uint numAds;
        string interests;
    }

    struct Viewer {
        address addr;
        string interests;
    }

    event AdCreated (
        uint id,
        uint ownerId,
        string content,
        uint adCount
    );



    constructor(address payable addr) public {
        owner = addr;
    }

    function createUser(string memory username, string memory interests) public  {
        userCount++;
        User memory newUser = User(userCount, 0, interests);
        users[userCount] = newUser;

        uId[username] = userCount;
    }

    function getUserInterests(uint id) public view returns (string memory) {
        User memory u = users[id];
        return u.interests;
    } 

    function getUid(string memory username) public view returns (uint) {
        return uId[username];
    }

    function createAd(uint owner_id, string memory content, uint count) public payable {
        adCount++;

        owner.transfer(msg.value);

        Ad storage newAd = advertisements[adCount];
        newAd.ownerId = owner_id;
        newAd.content = content;
        newAd.adCount = count;
        newAd.id = adCount;
        newAd.viewCount = 0;

        emit AdCreated(adCount, owner_id, content, count);
    }

    function addViewer(uint adId, string memory interests, address userAddress) public {
        Ad storage a = advertisements[adId];
        a.viewCount++;
        Viewer storage v = a.viewers[a.viewCount];
        v.addr = userAddress;
        v.interests = interests;
    }

    function getViewerAddress(uint adId, uint index) public view returns (address) {
        Ad storage ad = advertisements[adId];
        address userAddress = ad.viewers[index].addr;
        return userAddress;
    }

    function getViewerInterests(uint adId, uint index) public view returns (string memory) {
        Ad storage ad = advertisements[adId];
        string memory userInterests = ad.viewers[index].interests;
        return userInterests;
    }

    function getRandomAd() public returns (uint) {
        recent = recent + 1;
        recent = recent % adCount;

        return recent;
    }
}