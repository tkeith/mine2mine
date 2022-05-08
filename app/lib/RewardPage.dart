import 'package:app/GameLevel.dart';
import 'package:flutter/material.dart';

class RewardPage extends StatefulWidget {
  const RewardPage({Key? key}) : super(key: key);

  @override
  State<RewardPage> createState() => _RewardPageState();
}

class _RewardPageState extends State<RewardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Stack(children: [
      Image.asset(
        "gamebg.jpeg",
        fit: BoxFit.cover,
        height: double.infinity,
        width: double.infinity,
        alignment: Alignment.center,
        color: Colors.white.withOpacity(0.5),
        colorBlendMode: BlendMode.modulate,
      ),
      Align(
          alignment: AlignmentDirectional.topStart,
          child: Container(
              padding: EdgeInsets.all(10),
              child: InkWell(
                child: Image.asset(
                  "back_arrow.png",
                  width: 100,
                  height: 100,
                ),
              ))),
      Align(
          alignment: AlignmentDirectional.center,
          child: Container(
              padding: EdgeInsets.all(10),
              child: InkWell(
                child: Image.asset(
                  "cashout.png",
                  width: 203,
                  height: 69,
                ),
              )))
    ]));
  }
}
