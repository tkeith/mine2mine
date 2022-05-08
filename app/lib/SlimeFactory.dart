import 'dart:math';
import 'package:app/GameLevel.dart';
import 'package:flutter/material.dart';

// slime generating widget.

class Bubbles extends StatefulWidget {
  final bubblestate = _BubblesState();
  final Key? key;
  final double? generating_rate;
  Offset? aimPosition;
  final Function? completionCallback;
  List<dynamic>? tasksInfo = [];
  Bubbles({this.key, this.aimPosition , this.completionCallback, this.generating_rate, this.tasksInfo});

  @override
  State<StatefulWidget> createState() {
    return bubblestate;
  }

  repeat() {
    if (bubblestate._controller != null) {
      bubblestate.play();
    }
  }
}

class _BubblesState extends State<Bubbles> with SingleTickerProviderStateMixin {
  AnimationController? _controller;
  static late List<Bubble> bubbles;
  final Color color = Colors.amber;
  final double maxBubbleSize = 50.0;

  static removeBubbleById( int taskid){
    bubbles.removeWhere((element) => element.taskInfo["taskId"] == taskid);
  }

  void play() {
    // Initialize bubbles
    bubbles = [];
    _controller!.forward().whenComplete(() {
      widget.completionCallback!();
    });
  }

  late double width = 300 ;
  late double height = 500;

  @override
  void initState() {
    super.initState();
    // Init animation controller
    _controller = AnimationController(
        duration: const Duration(seconds: 300), vsync: this);
    _controller!.addListener(() {
      updateSlimeStatus();
    });
    // clear all bubbles.
    bubbles = [];
    Bubble.nBubble = 0;
    healthPoint = 10;
    moneyCollected = 0.0;
    play();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // _controller = AnimationController(
      //     duration: const Duration(seconds: 10), vsync: this);
      _controller = AnimationController(
          duration: const Duration(seconds: 300), vsync: this);
      _controller!.addListener(() {
        updateSlimeStatus();
      });
    }
  }

  @override
  void dispose() {
    _controller!.dispose();
    super.dispose();
  }

  double healthPoint = 100.0;
  double moneyCollected = 0.0;

  @override
  Widget build(BuildContext context) {
    width = MediaQuery.of(context).size.width * 0.9 ;
    height = MediaQuery.of(context).size.height * 0.9 ;

    return Stack(
      children: [
        Stack(
            children: bubbles.map((e) => e.getWidget()).toList()
        ),

      ],
    );
  }

  void updateSlimeStatus() {

    if (_controller == null) {
      dispose();
    }
    var rng = Random();

    if( rng.nextDouble() < widget.generating_rate! ){

      if( bubbles.length < 20 ){
        double aWidth = rng.nextDouble() * width;
        if( aWidth <= 50 ) {
          aWidth = 50;
        }
        if( aWidth >= width - 50 ){
          aWidth = width - 50;
        }
        double aHeight = rng.nextDouble() * height;
        if( aHeight <= 50 ) {
          aHeight = 50;
        }
        if( aHeight >= height - 50 ){
          aHeight = height - 50;
        }
        // print("!!!" + widget.tasksInfo.toString());
        print(Bubble.nBubble.toString());
        if( widget.tasksInfo!.length > Bubble.nBubble ){
          bubbles.add( Bubble(Offset( aWidth, aHeight ),color, maxBubbleSize, widget.tasksInfo![ Bubble.nBubble ]) );
        }

      }
    }
    if( bubbles.length > 0 ){
      bubbles.forEach((element) {
        element.updateLifeSpan();
      });
    }


    setState(() {});
  }
}



class Bubble {
  static int nBubble = 0;
  late Offset initPosition;
  late int id;
  late Color colour;
  late double direction;
  late double speed;
  late double radius;
  late int lifespan;
  dynamic taskInfo;
  double x = 0;
  double y = 0;
  double? opacity;

  Bubble(Offset initPosition, Color colour, double maxBubbleSize, dynamic _taskInfo) {
    Bubble.nBubble = Bubble.nBubble + 1;
    this.id = Bubble.nBubble;
    this.colour = colour.withOpacity(Random().nextDouble());
    this.direction = 3.14 / 4 + Random().nextDouble() * 3.14 / 5;
    this.speed = 10;
    this.radius = Random().nextDouble() * 20 + 20;
    this.x = initPosition.dx;
    this.y = initPosition.dy;
    this.opacity = 1.0;
    this.lifespan = 0;
    this.taskInfo = _taskInfo;
  }

  void updateLifeSpan(){
    // TODO updateLifeSpan, or update status
    // print("updateLifeSpan " + this.lifespan.toString());
    this.lifespan = this.lifespan + 1;
    if( lifespan >= 1200 ){
      // TODO aim failed!
      _BubblesState.removeBubbleById(this.taskInfo["taskId"]);
      aimFailedCallback!();
    }
  }

  Widget getWidget() {
    return Positioned(
      child: GestureDetector(
          onTapDown: (TapDownDetails details){
            recordStart!();
          },
          onTapUp: (TapUpDetails details){
            recordStop!(this.taskInfo["taskId"]);
            _BubblesState.removeBubbleById(this.taskInfo["taskId"]);

            aimSucceedCallback!( taskInfo["bid"].toDouble() );
          },
          onTapCancel: (){
            recordStop!(this.taskInfo["taskId"]);
            _BubblesState.removeBubbleById(this.taskInfo["taskId"]);
            aimSucceedCallback!( taskInfo["bid"].toDouble() );
          },
        child: Column(
          children: [
            Container(
              decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(
                    color: Colors.white,
                  ),
                  borderRadius: BorderRadius.all(Radius.circular(20))
              ),
              child: Padding(
                padding: EdgeInsets.all(10),
                child: DefaultTextStyle(
                  style: TextStyle(fontSize: 20, color: Colors.black),
                  child: Text(taskInfo["text"]),
                ),
              )

            ),
            SizedBox(
              width: 120,
              height: 120,
              child: (this.lifespan <= 300) ? Image.asset("FreshSpawn.gif") : this.lifespan <= 600 ? Image.asset("SecondSpawn.gif") : Image.asset("Spawn3.gif") ,
            ),
          ],
        ),
      ),
      top: y,
      left: x,
    );
  }

  draw(Canvas canvas, Size canvasSize) {
    Paint paint = new Paint()
      ..color = (x > 10 && y > 50) ? colour : Colors.transparent
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(x, y), radius, paint);
  }

}