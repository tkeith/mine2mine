import 'package:flutter/material.dart';
import 'package:app/GameLevel.dart';

import 'RewardPage.dart';



class MainGame extends StatefulWidget {
  const MainGame({Key? key}) : super(key: key);

  @override
  State<MainGame> createState() => _MainGameState();
}

class _MainGameState extends State<MainGame> {
  int speedLevel = 1;
  @override
  void initState() {
    super.initState();
    speedLevel = 1;
  }


  TextEditingController _textEditingController = TextEditingController();

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body: Stack(
        children: [
          Image.asset("startbg.jpeg", fit: BoxFit.cover,height: double.infinity,
            width: double.infinity,
            alignment: Alignment.center,),

          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      speedLevel = 1;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                      primary: (speedLevel == 1) ? Colors.deepPurpleAccent : Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(25),
                      ),
                      elevation: 15.0,
                      fixedSize: Size.fromWidth(200)
                  ),
                  child: const Padding(
                    padding: const EdgeInsets.all(15.0),
                    child: Text(
                      'Easy',
                      style: TextStyle(fontSize: 20),
                    ),
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      speedLevel = 2;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                      primary: (speedLevel == 2) ? Colors.deepPurpleAccent : Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(25),
                      ),
                      elevation: 15.0,
                      fixedSize: Size.fromWidth(200)
                  ),
                  child: const Padding(
                    padding: const EdgeInsets.all(15.0),
                    child: Text(
                      'Medium',
                      style: TextStyle(fontSize: 20),
                    ),
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      speedLevel = 3;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                      primary: (speedLevel == 3) ? Colors.deepPurpleAccent : Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(25),
                      ),
                      elevation: 15.0,
                      fixedSize: Size.fromWidth(200)
                  ),
                  child: const Padding(
                    padding: const EdgeInsets.all(15.0),
                    child: Text(
                      'Hard',
                      style: TextStyle(fontSize: 20),
                    ),
                  ),
                ),


                Padding(
                    padding: EdgeInsets.all(50),
                    child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  GameLevel( gameSpeed: speedLevel, )
                          )
                      ).then((value) {
                        if( (value != null) && value ){
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) =>
                                      RewardPage()
                              )
                          );
                        }
                      });
                    },
                    style: ElevatedButton.styleFrom(
                        primary: Colors.pinkAccent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(25),
                        ),
                        elevation: 15.0,
                        fixedSize: Size.fromWidth(200)
                    ),
                    child: Column(
                      children: [
                        const Padding(
                          padding: const EdgeInsets.all(15.0),
                          child: Text(
                            'Start Game',
                            style: TextStyle(fontSize: 20),
                          ),
                        ),
                        // Padding(
                        //   padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
                        //   child: TextFormField(
                        //     controller: _textEditingController,
                        //     decoration: const InputDecoration(
                        //       border: UnderlineInputBorder(),
                        //       labelText: 'address',
                        //     ),
                        //     initialValue: myaddress,
                        //
                        //   ),
                        // ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

        ],
      ),
    );
  }
}
