// Generated code, do not modify. Run `build_runner build` to re-generate!
// @dart=2.12
import 'package:web3dart/web3dart.dart' as _i1;

final _contractAbi = _i1.ContractAbi.fromJson(
    '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"submissionId","type":"uint256"},{"indexed":false,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"string","name":"ipfsHash","type":"string"}],"name":"SubmissionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":false,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"string","name":"text","type":"string"},{"indexed":false,"internalType":"uint256","name":"bid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiresAt","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"TaskCreated","type":"event"},{"inputs":[{"internalType":"uint256","name":"taskId","type":"uint256"},{"internalType":"string","name":"ipfsHash","type":"string"}],"name":"createSubmission","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"text","type":"string"},{"internalType":"uint256","name":"bid","type":"uint256"},{"internalType":"uint256","name":"expiresAt","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"createTask","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]',
    'Test');

class Test extends _i1.GeneratedContract {
  Test(
      {required _i1.EthereumAddress address,
      required _i1.Web3Client client,
      int? chainId})
      : super(_i1.DeployedContract(_contractAbi, address), client, chainId);

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> createSubmission(BigInt taskId, String ipfsHash,
      {required _i1.Credentials credentials,
      _i1.Transaction? transaction}) async {
    final function = self.abi.functions[0];
    assert(checkSignature(function, 'a5e99c4e'));
    final params = [taskId, ipfsHash];
    return write(credentials, transaction, function, params);
  }

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> createTask(
      String text, BigInt bid, BigInt expiresAt, BigInt quantity,
      {required _i1.Credentials credentials,
      _i1.Transaction? transaction}) async {
    final function = self.abi.functions[1];
    assert(checkSignature(function, 'fabbe4dd'));
    final params = [text, bid, expiresAt, quantity];
    return write(credentials, transaction, function, params);
  }

  /// Returns a live stream of all SubmissionCreated events emitted by this contract.
  Stream<SubmissionCreated> submissionCreatedEvents(
      {_i1.BlockNum? fromBlock, _i1.BlockNum? toBlock}) {
    final event = self.event('SubmissionCreated');
    final filter = _i1.FilterOptions.events(
        contract: self, event: event, fromBlock: fromBlock, toBlock: toBlock);
    return client.events(filter).map((_i1.FilterEvent result) {
      final decoded = event.decodeResults(result.topics!, result.data!);
      return SubmissionCreated(decoded);
    });
  }

  /// Returns a live stream of all TaskCreated events emitted by this contract.
  Stream<TaskCreated> taskCreatedEvents(
      {_i1.BlockNum? fromBlock, _i1.BlockNum? toBlock}) {
    final event = self.event('TaskCreated');
    final filter = _i1.FilterOptions.events(
        contract: self, event: event, fromBlock: fromBlock, toBlock: toBlock);
    return client.events(filter).map((_i1.FilterEvent result) {
      final decoded = event.decodeResults(result.topics!, result.data!);
      return TaskCreated(decoded);
    });
  }
}

class SubmissionCreated {
  SubmissionCreated(List<dynamic> response)
      : taskId = (response[0] as BigInt),
        submissionId = (response[1] as BigInt),
        creator = (response[2] as _i1.EthereumAddress),
        ipfsHash = (response[3] as String);

  final BigInt taskId;

  final BigInt submissionId;

  final _i1.EthereumAddress creator;

  final String ipfsHash;
}

class TaskCreated {
  TaskCreated(List<dynamic> response)
      : taskId = (response[0] as BigInt),
        creator = (response[1] as _i1.EthereumAddress),
        text = (response[2] as String),
        bid = (response[3] as BigInt),
        expiresAt = (response[4] as BigInt),
        quantity = (response[5] as BigInt);

  final BigInt taskId;

  final _i1.EthereumAddress creator;

  final String text;

  final BigInt bid;

  final BigInt expiresAt;

  final BigInt quantity;
}
