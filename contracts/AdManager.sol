pragma solidity ^0.5.0;

contract AdManager {
    uint public adCount = 0;
    uint public userCount = 0;

    mapping(uint => User) public users;
    mapping(uint => Ad) public advertisements;

    struct Ad {
        uint ownerId;
        uint id;
        string content;
        uint slots;
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
        Ad memory newAd = Ad(owner_id, adCount, content, count);
        advertisements[adCount] = newAd;
    }
}