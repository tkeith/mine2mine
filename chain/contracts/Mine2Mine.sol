pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Mine2Mine {

  struct Submission {
    address creator;
    string ipfsHash;
  }

  struct Task {
    address creator;
    string text;
    uint256 bid;
    uint256 expiresAt;
    uint256 originalQuantity;
    uint256 remainingQuantity;
    uint256 numberOfSubmissions;
    mapping(uint256 => Submission) submissions;
  }

  event TaskCreated(
    uint256 taskId,
    address creator,
    string text,
    uint256 bid,
    uint256 expiresAt,
    uint256 quantity);

  event SubmissionCreated(
    uint256 taskId,
    uint256 submissionId,
    address creator,
    string ipfsHash);

  uint256 numberOfTasks;
  mapping(uint256 => Task) tasks;

  IERC20 USDC = IERC20(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174);

  function createTask(string calldata text, uint256 bid, uint256 expiresAt, uint256 quantity) external returns(uint256) {
    require(bid > 0);
    require(expiresAt > block.timestamp);
    require(quantity > 0);

    numberOfTasks += 1;
    uint256 taskId = numberOfTasks;
    Task storage task = tasks[taskId];
    task.creator = msg.sender;
    task.text = text;
    task.bid = bid;
    task.expiresAt = expiresAt;
    task.originalQuantity = quantity;
    task.remainingQuantity = quantity;

    emit TaskCreated(taskId, msg.sender, text, bid, expiresAt, quantity);

    return taskId;
  }

  function createSubmission(uint256 taskId, string calldata ipfsHash) external returns(uint256) {
    require(tasks[taskId].remainingQuantity > 0);

    Task storage task = tasks[taskId];

    // here, we should transfer `task.bid` of USDC from `task.creator` to `msg.sender`

    task.numberOfSubmissions += 1;
    uint256 submissionId = task.numberOfSubmissions;

    Submission storage submission = task.submissions[submissionId];
    submission.creator = msg.sender;
    submission.ipfsHash = ipfsHash;

    task.remainingQuantity -= 1;

    emit SubmissionCreated(taskId, submissionId, msg.sender, ipfsHash);

    return submissionId;
  }
}
