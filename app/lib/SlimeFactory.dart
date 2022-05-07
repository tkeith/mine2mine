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
  Bubbles({this.key, this.aimPosition , this.completionCallback, this.generating_rate});

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
        duration: const Duration(seconds: 300), vsync: this);
    _controller!.addListener(() {
      updateSlimeStatus();
    });
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
    if( rng.nextDouble() < widget.generating_rate! ){
      if( bubbles.length < 20 ){
        bubbles.add( Bubble(Offset( rng.nextDouble() * width, rng.nextDouble() * height ),color, maxBubbleSize) );
      }
    }
    bubbles.forEach((element) {
      element.updateLifeSpan();
    });

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
    this.lifespan = 0;
  }

  void updateLifeSpan(){
    // TODO updateLifeSpan, or update status
    // print("updateLifeSpan " + this.lifespan.toString());
    this.lifespan = this.lifespan + 1;
    if( lifespan >= 400 ){
      // TODO aim failed!
    }
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
        child: Stack(
          children: [
            SizedBox(
              width: 120,
              height: 120,
              child: (this.lifespan <= 200) ? Image.asset("FreshSpawn.gif") : Image.asset("SecondSpawn.gif"),
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