// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract FrontendAssessment {
    uint public data1;
    string public data2;

    event SetNumber(address indexed sender, uint256 num);

    event SetString(address indexed sender, string detail);

    function setNumber(uint _data) external {
        data1 = _data;

        emit SetNumber(msg.sender, _data);
    }

    function setString(string memory _data) external {
        data2 = _data;

        emit SetString(msg.sender, _data);
    }

    function getNumber() public view returns (uint) {
        return data1;
    }

    function getString() public view returns (string memory) {
        return data2;
    }
}
