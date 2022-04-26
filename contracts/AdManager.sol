pragma solidity ^0.5.0;

contract AdManager {
    uint public adCount = 0;
    uint public userCount = 0;

    mapping(uint => User) public activeUsers;

    struct Ad {
        uint id;
        string content;
        uint pending_count;
    }

    struct User {
        uint user_id;
        uint active_ads;
        mapping(uint => Ad) advertisements;
    }

    function createUser() public {
        userCount++;
        User memory new_user = User({user_id : userCount, active_ads : 0});
        activeUsers[userCount] = new_user;
    }

    function createAd(uint user_id, string memory _content, uint _count) public {
        adCount++;
        Ad memory new_ad = Ad(adCount, _content, _count);
        uint count = ++activeUsers[user_id].active_ads;
        activeUsers[user_id].advertisements[count] = new_ad;
    }

}