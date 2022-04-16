// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4; 

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract Inbox {
    string public message;

    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    /// @param initialMessage a parameter just like in doxygen (must be followed by parameter name)
    constructor(string memory initialMessage) {
        message = initialMessage;
    }

    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    /// @param newMessage a parameter just like in doxygen (must be followed by parameter name)
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }

    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    /// @return string the return variables of a contract’s function state variable
    // note: this is superfluous because the "public" message already provdes
    // us a get function
    function getMessage() public view returns (string memory) {
        return message;
    }

}
