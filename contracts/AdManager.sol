// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract AdManager {
    uint public adCount = 0;
    uint public userCount = 0;

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
        mapping(uint => uint) viewers;
    }

    struct User {
        uint userId;
        uint numAds;
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

    function createUser(string memory username) public  {
        userCount++;
        User memory newUser = User(userCount, 0);
        users[userCount] = newUser;

        uId[username] = userCount;
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

    function addViewer(uint adId,  uint userId) public {
        Ad storage a = advertisements[adId];
        a.viewCount++;
        a.viewers[a.viewCount] = userId;
    }

    function getViewerId(uint adId, uint index) public view returns (uint) {
        Ad storage ad = advertisements[adId];
        uint userId = ad.viewers[index];
        return userId;
    }
}