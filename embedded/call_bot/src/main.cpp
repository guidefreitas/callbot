#include <Arduino.h>
#include "FirebaseESP8266.h"
#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>
#include <ESP8266HTTPClient.h>

#define FIREBASE_HOST "https://callbotapp-1d5dc.firebaseio.com/"
#define FIREBASE_AUTH "13MEycrGrJxodhos2MWbakXZ4kCwd3ymyHFfWiQx"

unsigned long sendDataPrevMillis = 0;

FirebaseData firebaseData;
String path = "/call/status";

int get_status(String address);

void setup() {
  Serial.begin(9600);
  delay(100);
  WiFiManager wifiManager;
  wifiManager.autoConnect();

  pinMode(D1, OUTPUT);
  pinMode(D3, OUTPUT);
  pinMode(BUILTIN_LED, OUTPUT);

  digitalWrite(D1, LOW);
  digitalWrite(D3, LOW);

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  if (!Firebase.beginStream(firebaseData, path))
  {
    Serial.println("------------------------------------");
    Serial.println("Can't begin stream connection...");
    Serial.println("REASON: " + firebaseData.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }
}

void turnOn() {
  pinMode(BUILTIN_LED, HIGH);
  digitalWrite(D1, HIGH);
  digitalWrite(D3, LOW);
}

void turnOff() {
  pinMode(BUILTIN_LED, LOW);
  digitalWrite(D1, LOW);
  digitalWrite(D3, LOW);
}

void loop() {
  if (millis() - sendDataPrevMillis > 5000)
  {
    Serial.println("Reading data");

    sendDataPrevMillis = millis();

    if (Firebase.getInt(firebaseData, path))
    {
      Serial.println("PASSED");
      Serial.println("PATH: " + firebaseData.dataPath());
      Serial.println("TYPE: " + firebaseData.dataType());
      Serial.println("ETag: " + firebaseData.ETag());
      Serial.print("VALUE: ");
      if (firebaseData.dataType() == "int")
        Serial.println(firebaseData.intData());
      else if (firebaseData.dataType() == "float")
        Serial.println(firebaseData.floatData(), 5);
      else if (firebaseData.dataType() == "double")
        Serial.println(firebaseData.doubleData(), 9);
      else if (firebaseData.dataType() == "boolean")
        Serial.println(firebaseData.boolData() == 1 ? "true" : "false");
      else if (firebaseData.dataType() == "string")
        Serial.println(firebaseData.stringData());
      else if (firebaseData.dataType() == "json")
        Serial.println(firebaseData.jsonData());
      Serial.println("------------------------------------");
      Serial.println();

      int active = firebaseData.intData();
      if(active == 1) {
        Serial.println("On");
        turnOn();
      }else if (active == 0)
      {
        Serial.println("Off");
        turnOff();
      }
      delay(5000);
    }
    else
    {
      Serial.println("FAILED");
      Serial.println("REASON: " + firebaseData.errorReason());
      Serial.println("------------------------------------");
      Serial.println();
    }
  }
}