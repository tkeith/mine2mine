import 'dart:convert';
import 'dart:developer';
import 'dart:io';
import 'dart:async';
import 'package:http/http.dart' as http;

import 'package:shared_preferences/shared_preferences.dart';

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
