import 'dart:async';

import 'package:flutter/material.dart';
import 'package:record/record.dart';

import 'SlimeFactory.dart';
import 'dart:core';

Function? recordStart ;
Function? recordStop ;

class GameLevel extends StatefulWidget {
  const GameLevel({Key? key}) : super(key: key);

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
  }



  // TODO generates slime at random positions
  List<Offset> slimeList = [];


  @override
  Widget build(BuildContext context) {
    return Container(
      child: Stack(
        children: [
          Image.asset("gamebg.jpeg", fit: BoxFit.cover, height: double.infinity,
            width: double.infinity,
            alignment: Alignment.center,),
          Bubbles( key: ObjectKey("1"),
            completionCallback: (){},
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
          recording ? const Icon( Icons.record_voice_over ) : Container(),
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
