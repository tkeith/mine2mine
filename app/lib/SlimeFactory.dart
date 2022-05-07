import 'dart:math';
import 'package:app/GameLevel.dart';
import 'package:flutter/material.dart';

// slime generating widget.

class Bubbles extends StatefulWidget {
  final bubblestate = _BubblesState();
  final Key? key;
  final double generating_rate = 0.01;
  Offset? aimPosition;
  final Function? completionCallback;
  Bubbles({this.key, this.aimPosition , this.completionCallback});

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

  static removeBubbleById( int bubbleid){
    bubbles.removeWhere((element) => element.id == bubbleid);
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
        duration: const Duration(seconds: 10), vsync: this);
    _controller!.addListener(() {
      updateSlimeStatus();
    });
    play();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _controller = AnimationController(
          duration: const Duration(seconds: 10), vsync: this);
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

  @override
  Widget build(BuildContext context) {
    width = MediaQuery.of(context).size.width * 0.9 ;
    height = MediaQuery.of(context).size.height * 0.9 ;

    return Stack(
      children: bubbles.map((e) => e.getWidget()).toList(),
    );
  }

  void updateSlimeStatus() {
    if (_controller == null) {
      dispose();
    }
    var rng = Random();
    if( rng.nextDouble() < widget.generating_rate ){
      bubbles.add( Bubble(Offset( rng.nextDouble() * width, rng.nextDouble() * height ),color, maxBubbleSize) );
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
  double x = 0;
  double y = 0;
  double? opacity;

  Bubble(Offset initPosition, Color colour, double maxBubbleSize) {
    Bubble.nBubble = Bubble.nBubble + 1;
    this.id = Bubble.nBubble;
    this.colour = colour.withOpacity(Random().nextDouble());
    this.direction = 3.14 / 4 + Random().nextDouble() * 3.14 / 5;
    this.speed = 10;
    this.radius = Random().nextDouble() * 20 + 20;
    this.x = initPosition.dx;
    this.y = initPosition.dy;
    this.opacity = 1.0;
  }

  Widget getWidget() {
    return Positioned(
      child: GestureDetector(
          onTapDown: (TapDownDetails details){
            recordStart!();
          },
          onTapUp: (TapUpDetails details){
            recordStop!();
            _BubblesState.removeBubbleById(this.id);
          },
          onTapCancel: (){
            recordStop!();
            _BubblesState.removeBubbleById(this.id);
          },
        child: SizedBox(
          width: 100,
          height: 100,
          child: Image.asset("check.png"),
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