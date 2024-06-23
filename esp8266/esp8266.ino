#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
//#include <ESP8266WebServer.h>
//#include <ArduinoJson.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

#ifndef APSSID
#define APSSID "SKY-LIGHT"
#define APPSK "11223344"
#endif


const char *ssid = APSSID;
const char *password = APPSK;
 
const char* ssid2 = "N SH";//"Redmi Note 9 Pro";//"amod company";//type your ssid
const char* password2 = "5036250362";//"123456789";//"sajadsa2012sajadsaleh";//type your password

//WiFiServer server(80);//Service Port
AsyncWebServer server(80);

const char* PARAM_MESSAGE = "message";
void setup() {
  wifiInit();
  delay(500);
}

void loop() {
 //wifiLoop();
}

void wifiInit(){
  delay(2000);
  Serial.begin(2400);
  WiFi.mode(WIFI_AP_STA);   
  WiFi.softAP(ssid, password);
  IPAddress myIP = WiFi.softAPIP();
  //
  WiFi.begin(ssid2, password2);
  unsigned long timeout = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - timeout < 2000) {
    delay(500);
  }
  //

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin","*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  server.on("/data", HTTP_POST, handleDataRequest);
  
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
      AsyncWebServerResponse *response = request->beginResponse(200,"text/plain", "Hello Wordl!!!!");
      response-> addHeader("Access_Control-Allow-Origin","*");
      request->send(response);
     // request->send(200, "text/plain", "Hello, world","Access_Control-Allow-Origin","*");
  });

  // Send a GET request to <IP>/get?message=<message>
  server.on("/get", HTTP_GET, [] (AsyncWebServerRequest *request) {
      String message;
      if (request->hasParam(PARAM_MESSAGE)) {
          message = request->getParam(PARAM_MESSAGE)->value();
      } else {
          message = "No message sent";
      }
      AsyncWebServerResponse *response = request->beginResponse(200,"text/plain", "Hello, GET: " + message);
      response-> addHeader("Access_Control-Allow-Origin","*");
      request->send(response);
      //request->send(200, "text/plain", "Hello, GET: " + message);
  });

  // Send a POST request to <IP>/post with a form field message set to <message>
  server.on("/post", HTTP_POST, [](AsyncWebServerRequest *request){
      String message;
      if (request->hasParam(PARAM_MESSAGE, true)) {
          message = request->getParam(PARAM_MESSAGE, true)->value();
      } else {
          message = "No message sent";
      }
      AsyncWebServerResponse *response = request->beginResponse(200,"text/plain", "Hello, POST: " + message);
      response-> addHeader("Access_Control-Allow-Origin","*");
      request->send(response);
      //request->send(200, "text/plain", "Hello, POST: " + message);
  });

  server.onNotFound(notFound);

  // Start the server
  server.begin();
  
  // Print the IP address

}

void wifiLoop(){
  // Check if a client has connected
  static bool isConnect =false;
  while (!isConnect && WiFi.status() == WL_CONNECTED ) {
    isConnect = true;
  }  
  checkClient();
}

void checkClient()
{
  //JsonDocument doc;
  //WiFiClient client = server.available();
  //if (!client) {
  //  return;
  //}

  // Wait until the client sends some data
  // unsigned long timeout = millis();
  // while (!client.available() && millis() - timeout < 1000) 
  // {
  //  delay(10);
  //}

  // if (!client.available()) {
  //  client.stop();
  //  return;
  // }
  // Read the HTTP request line
  // String request = client.readStringUntil('\r');

 // if (!client.connected()) {
 //   client.stop();
 //   return;
 // }
  
  // doc["ip"] = WiFi.localIP().toString();
  // doc["ap"] = "192.168.4.1"; // Replace with actual AP IP if needed
  // doc["loop"] = 1;
  // doc["color"] = 120;

  // String jsonString;
  // serializeJson(doc, jsonString);

  // client.println("HTTP/1.1 200 OK");
  // client.println("Content-Type: application/json");
  // client.println("Connection: close");
  // client.println("Content-Length: " + jsonString.length());
  // client.println();
  // client.println(jsonString);
  // client.stop();  
  // Extract parameter values
    
  // Split the request line by '&'
  // int start = request.indexOf('?', 0);  
  // int end = request.indexOf(' ', start);  
  // String param = request.substring(start+1, end);
  // Serial.println(param); 
}

void notFound(AsyncWebServerRequest *request) {
    request->send(404, "text/plain", "Not found");
}

void handleDataRequest(AsyncWebServerRequest *request) {
  String data = request->getParam("data", true)->value(); // Get the POST data
  Serial.println(data);


  // Send the response
  AsyncWebServerResponse *response = request->beginResponse(200,"text/plain", "Hello, GET: " + data);
      response-> addHeader("Access_Control-Allow-Origin","*");
      request->send(response);
  //request->send(200, "text/plain", data);
}
