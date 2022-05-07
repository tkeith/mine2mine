import 'dart:async';

import 'package:app/utils.dart';
import 'package:flutter/material.dart';
import 'package:record/record.dart';
import 'package:app/test.g.dart';
import 'RewardPage.dart';
import 'SlimeFactory.dart';
import 'dart:core';
import 'package:http/http.dart';
import 'dart:math'; //used for the random number generator
import 'package:web3dart/web3dart.dart';

import 'const.dart';
import 'ifpssrc/ipfs_client_flutter_base.dart';
const privateKey = "26dd62ddab48780847376fc95e0a8d635206126242b8d2e549d7f14255ce943c";
const ABI = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "taskId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "submissionId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "creator", "type": "address" }, { "indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string" }], "name": "SubmissionCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "taskId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "creator", "type": "address" }, { "indexed": false, "internalType": "string", "name": "text", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "bid", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "expiresAt", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "TaskCreated", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "taskId", "type": "uint256" }, { "internalType": "string", "name": "ipfsHash", "type": "string" }], "name": "createSubmission", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256", "name": "bid", "type": "uint256" }, { "internalType": "uint256", "name": "expiresAt", "type": "uint256" }, { "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "createTask", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }];
const CONTRACT_ADDRESS = '0x51797a758376671eA20f0Ace40c8DF7EcD72bc97';



Function? recordStart ;
Function? recordStop ;

class GameLevel extends StatefulWidget {
  final int? gameSpeed;
  const GameLevel({Key? key, this.gameSpeed}) : super(key: key);

  @override
  State<GameLevel> createState() => _GameLevelState();
}

class _GameLevelState extends State<GameLevel> {

  final _audioRecorder = Record();

  Future<void> _start() async {
    try {
      if (await _audioRecorder.hasPermission()) {
        // We don't do anything with this but printing
        final isSupported = await _audioRecorder.isEncoderSupported(
          AudioEncoder.aacLc,
        );
        print('${AudioEncoder.aacLc.name} supported: $isSupported');

        await _audioRecorder.start(encoder: AudioEncoder.wav);

        bool isRecording = await _audioRecorder.isRecording();
        setState(() {
          recording = isRecording;
          recordDuration = 0;
        });

        _startTimer();
      }
    } catch (e) {
      print(e);
    }
  }

  void _startTimer() {
    _timer?.cancel();

    _timer = Timer.periodic(const Duration(seconds: 1), (Timer t) {
      setState(() => recordDuration++);
    });

  }

  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    _audioRecorder.dispose();
    super.dispose();
  }


  Future<void> _stop() async {
    _timer?.cancel();
    final path = await _audioRecorder.stop();
    print(path.toString());
    setState(() => recording = false);
  }

  bool recording = false;
  double recordDuration = 0.0;
  bool showAim = false;
  double aimDx = 0 ;
  double aimDy = 0;

  @override
  void initState() {
    super.initState();
    recordStart = _start;
    recordStop = _stop;
    recording = false;
    recordDuration = 0.0;
    showAim = false;
    aimDx = 0 ;
    aimDy = 0;
    slimeList = [];
    initWallet();
  }


  Future<bool> uploadToIpfs() async{
    IpfsClient ipfsClient = IpfsClient();
    var res = await ipfsClient.mkdir(dir: 'testDir');

    var res1 = await ipfsClient.write(
        dir: 'testpath3/Simulator.png',
        filePath: "[FILE_PATH]/Simulator.png",
        fileName: "Simulator.png");

    var res2 = await ipfsClient.ls(dir: "testDir");
    return true;
  }

  Future<bool> initWallet()async{
    final credentials = EthPrivateKey.fromHex(privateKey);
    final address = credentials.address;
    String rpcUrl = "https://polygon-rpc.com";
    final client = Web3Client(rpcUrl, Client());
    print(address.hexEip55);
    var res = await client.getBalance(address);
    List<dynamic> tasks = await getAllTasks();
    print("!!" + tasks.toString());

    // IpfsClient ipfsClient = IpfsClient();
    Test testcontract = Test(address: EthereumAddress.fromHex("0x51797a758376671eA20f0Ace40c8DF7EcD72bc97"), client: client);

    // TODO call ifps
    testcontract.createSubmission(tasks[0]['taskId'], "ipfsHash", credentials: credentials);


    // client.call(contract: contract, function: function, params: params)
    // return true;
    // await client.sendTransaction(
    //   credentials,
    //   Transaction(
    //     to: EthereumAddress.fromHex('0xC914Bb2ba888e3367bcecEb5C2d99DF7C7423706'),
    //     gasPrice: EtherAmount.inWei(BigInt.one),
    //     maxGas: 100000,
    //     value: EtherAmount.fromUnitAndValue(EtherUnit.ether, 1),
    //   ),
    // );

    return true;
  }



  // TODO generates slime at random positions
  List<Offset> slimeList = [];


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Image.asset("gamebg.jpeg", fit: BoxFit.cover, height: double.infinity,
            width: double.infinity,
            alignment: Alignment.center,),
          Bubbles( key: ObjectKey("1"),
            completionCallback: (){},
            generating_rate: widget.gameSpeed!.toDouble() * 0.005,
            tasksInfo: ["asdf", "asdf1", "asdf2"],
          ),
          Align(
            alignment: AlignmentDirectional.topEnd,
            child: Container(
              padding: EdgeInsets.all(10),
              child: InkWell(
                child: Image.asset("goldbars.png", width: 100, height: 100,),
                onTap: (){
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) =>
                              RewardPage()
                      )
                  );
                },
              )
            ),
          ),


          // GestureDetector(
          //   // TODO only when aiming
          //   onTapDown: (TapDownDetails details){
          //     _start();
          //   },
          //   onTapUp: (TapUpDetails details){
          //     _stop();
          //   },
          //   onTapCancel: (){
          //     _stop();
          //     setState(() {
          //       showAim = false;
          //     });
          //   },
          //   child: const CircleAvatar(
          //     maxRadius: 50,
          //     minRadius: 50,
          //     backgroundColor: Colors.yellow,
          //   ),
          // ),
          showAim ? Positioned(
              left: aimDx - 30,
              top: aimDy - 30,
              child: Container(
                height: 60,
                width: 60,
                child: Image.asset("aim.png"),
              )
          ) : Container(),
          recording ? const Icon( Icons.record_voice_over, size: 50, ) : Container(),
        ],
      ),

      // onPanUpdate: (details){
      //   setState(() {
      //     aimDx = details.globalPosition.dx;
      //     aimDy = details.globalPosition.dy;
      //   });
      // },
      // onPanStart: (details){
      //   setState(() {
      //     showAim = true;
      //     aimDx = details.globalPosition.dx;
      //     aimDy = details.globalPosition.dy;
      //   });
      // },
      // onPanEnd: (_){
      //   setState(() {
      //     showAim = false;
      //     aimDx = 0;
      //     aimDy = 0;
      //   });
      // },

    );
  }
}
