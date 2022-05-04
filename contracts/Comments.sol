// Is there a way to integrate this with the main contract?
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Comments {
    // Exposed data structure
    struct Comment {
        uint32 id;
        string topic;
        address creator_address;
        string message;
        uint256 created_at;
    }

    // Notify users that a comment was added
    event CommentAddress(Comment comment);
    // Fetch a list of comments for a topic
    function getCommments(string calldata topic) public view returns(Comment[] memory) {}

    // Persist a new comment
    function addComment(string calldata topic, string calldata message) public {}
}