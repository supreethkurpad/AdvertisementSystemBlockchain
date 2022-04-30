// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract AdManager {
    uint public adCount = 0;
    uint public userCount = 0;

    mapping(uint => User) public users;
    mapping(uint => Ad) public advertisements;

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

    function createUser() public {
        userCount++;
        User memory newUser = User(userCount, 0);
        users[userCount] = newUser;
    }

    function createAd(uint owner_id, string memory content, uint count) public {
        adCount++;
        Ad memory newAd;
        newAd.ownerId = owner_id;
        newAd.content = content;
        newAd.adCount = count;
        newAd.id = adCount;
        newAd.viewCount = 0;
        advertisements[adCount] = newAd;
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