import 'package:flutter/material.dart';

import 'MineMainGame.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mine2Mine',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MainGame(),
      debugShowCheckedModeBanner: false,
    );
  }
}