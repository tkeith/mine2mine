import 'dart:convert';
import 'dart:developer';
import 'dart:io';
import 'dart:async';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:flutter/material.dart';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:web3dart/web3dart.dart';


import 'GameLevel.dart';

Future<String> apiRequest(String _url, Map jsonMap) async {
  print("apiRequest");
  // add production debug
  String url = _url.replaceAll("sixdegreestest1", "memology-demo");
  // send request
  HttpClient httpClient = new HttpClient();
  HttpClientRequest request = await httpClient.postUrl(Uri.parse(url));
  request.headers.set('content-type', 'application/json');
  request.add(utf8.encode(json.encode(jsonMap)));
  HttpClientResponse response = await request.close();

  if (response.statusCode == 200) {
    String reply = await response.transform(utf8.decoder).join();
    // DLog("$_url \n" + json.decode(reply));
    httpClient.close();
    return reply;
  } else {
    String reply = response.statusCode.toString();
    httpClient.close();
    return reply;
  }
}

Future<http.Response> fetchTask(String _url) {
  return http.get(Uri.parse(_url));
}

Future<List<dynamic>> getAllTasks() async {
  print("getAllTasks");
  String _url = 'https://mine2mine.tk.co/express/allTasks';
  http.Response reply = await fetchTask(_url);
  print(reply.body.runtimeType.toString());
  List<dynamic> ls = json.decode(reply.body);
  return ls;
  // final body = json.decode(reply);
  // print(body);
  // if (body['status_code'] == 200) {
  //   print("notify all friends about my post succeeded!");
  //   return body;
  // } else {
  //   print(body['message']);
  // }
}

class Loading extends StatelessWidget {
  const Loading();

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
        ),
      ),
    );
  }
}




Future<String> localPath() async {
  final directory = await getApplicationDocumentsDirectory();

  return directory.path;
}

Future<File> localFile(String name) async {
  final path = await localPath();
  return File('$path'+ "/" + name);
}

Future<Uint8List?> readFileByte(String filePath) async {
  Uri myUri = Uri.parse(filePath);
  File audioFile = new File.fromUri(myUri);
  Uint8List? bytes;
  await audioFile.readAsBytes().then((value) {
    bytes = Uint8List.fromList(value);
    print('reading of bytes is completed');
  }).catchError((onError) {
    print('Exception Error while reading audio from path:' +
        onError.toString());
  });
  return bytes;
}


Future<String> sendrawdataToServer(String data) async{
  Map _json = {
    "audio": data
  };

  String _url = 'https://mine2mine.tk.co/express/ipfsUpload';
  String reply = await apiRequest(_url, _json);
  final body = json.decode(reply);
  print("ipfsUpload");
  print(body.toString());
  return body['ipfsHash'];
}


Future<dynamic> getNextTask() async {
  print("getNextTask" + myaddress.toString());
  String _url = 'https://mine2mine.tk.co/express/users/' + myaddress! + '/getTask';
  http.Response reply = await fetchTask(_url);
  print(reply.body.runtimeType.toString());
  dynamic singleTask = json.decode(reply.body);
  print(singleTask.toString());
  return singleTask;
  // final body = json.decode(reply);
  // print(body);
  // if (body['status_code'] == 200) {
  //   print("notify all friends about my post succeeded!");
  //   return body;
  // } else {
  //   print(body['message']);
  // }
}
