# Firebase Realtime Database Arduino Library for ESP8266


Google's Firebase Realtime Database Arduino Library for ESP8266 v 2.0.4

This client library provides the most reliable operations for read, store, update, delete, backup and restore the database data.

In addition, the library allows you to read and store binary data from/to device's memory or external SD memory.

This library comunicated with Google Firebase Realtime Database using the REST API. 

The library supports all ESP8266 MCU based modules. For ESP32 please try [ESP32 Firebase Arduino library]( https://github.com/mobizt/Firebase-ESP32)




For Arduino MKR WiFi 1010, Arduino MKR VIDOR 4000 and Arduino UNO WiFi Rev.2, please try [Firebase Arduino Library for ARM/AVR WIFI Dev Boards based on WiFiNINA](https://github.com/mobizt/Firebase-Arduino-WiFiNINA)


For Arduino WiFi Shield 101 and Arduino MKR1000 WIFI, please try [Firebase Arduino Library for ARM/AVR WIFI Dev Boards based on WiFi101](https://github.com/mobizt/Firebase-Arduino-WiFi101)

For Arduino MKR1000 WIFI will be supported soon.



Copyright (c) 2019 K. Suwatchai (Mobizt).





## Tested Devices


This following devices were tested and work well.

 * Wemos D1 Mini
 * NodeMCU





## Features


* **Not required fingerprint** or **certificate data** to connect.

* **Fast and no delay** for contiuous read and store data from/to database.

* Using **Firebase Data object** that holds all data and instances.

* **Read data** at the defined database path using get functions e.g. **getInt**, **getFloat**, **getDouble**, **getBool**, **getString**, **getJSON**, **getBlob** and **getFile**.

* **Store data** at the defined database path using set functions e.g. **setInt**, **setFloat**, **setDouble**, **setBool**, **setString**, **setJSON**, **setBlob** and **setFile**.

* **Append data** to the defined database path using push functions e.g. **pushInt**, **pushFloat**, **pushDouble**, **pushBool**,  **pushString**, **pushJSON**, **pushBlob** and **pushFile**.

* **Update data** at the defined database path using **updateNode** and **updateNodeSilent** functions.

* **Delete data** at the defined database path (include all child nodes) using **deleteNode** function.

* **Read and write database rules** using **getRules** and **setRules** functions.

* Supports Conditional Requests through **ETag**.

* Supports **set and push server's Timestamp**.

* Supports **classic HTTP requests hack** in case of PUT and DELET blocked by Firewall (if device connected behind Firewall).

* **Supports Error Retry and Error Queue to resume all Firebase read/store Error oerations** up to 255 queues. Firebase Error queues can be tracked its status and saved as file for further restore. Data can be resumed from queue operation (get) when global variable is provided. 

* Supports **Data Filtering** using the orderBy, limitToFirst, limitToLast, startAt, endAt, and equalTo query parameters.

* Supports integer, float, double, boolean, string and JSON string data types.   

  For JSON string data type, parsing as an object required external JSON parser library e.g. [**ArduinoJson**](https://github.com/bblanchon/ArduinoJson).

* Supports **automatic stream resuming** when the stream connection was timeout. 

* Supports **multiple streaming paths** using multiple Firebase Data objects. 

* Supports **Firebase pause**.

* Supports data **backup and restore** that working with SD card. 

* Supports **blob** or binary data from memory and **File stream** from SD card.

* Supports send notification through **Firebase Cloud Messaging**.




## Dependencies


This library required ESP8266 Core SDK version 2.4.0 and above which can be installed through **Boards Manager**. 

Recommend to use Core SDK version 2.4.2 or 2.5.0 and above which offer more free memory.




## Installing


### Using Library Manager


At Arduino IDE goto menu **Sketch** -> **Include Library** -> **Manage Libraries...**


In Library Manager Window, search **"firebase"** in the search form then select **"Firebase ESP8266 Client"** and click **"Install"** button.



For PlatformIO IDE, using the following command.

**pio lib install "Firebase ESP8266 Client""**


Or at **PIO Home** -> **Library** -> **Registry** then search **Firebase ESP8266 Client**.


[More on PlatformIO...](https://platformio.org/lib/show/6247/Firebase%20ESP8266%20Client)




### Manual installing


For Arduino IDE, click on **Clone or download** dropdown at the top of repository, select **Download ZIP** and save file on your computer.


From Arduino IDE, goto menu **Sketch** -> **Include Library** -> **Add .ZIP Library...** and choose **Firebase-ESP8266-master.zip** that previously downloaded.


Go to menu **Files** -> **Examples** -> **Firebase-ESP8266-master** and choose one from examples.


For PlatformIO, create folder **"Firebase-ESP8266"** in folder **"lib"** and store **[these four files](https://github.com/mobizt/Firebase-ESP8266/tree/master/src)** in it.






## Usages


### Declaration and Initialization


#### The first thing to do to use this library.

```C++

//1. Include Firebase ESP8266 library (this library)

#include "FirebaseESP8266.h"

//2. Include ESP8266WiFi.h and must be included after FirebaseESP8266.h

#include <ESP8266WiFi.h>

//3. Declare the Firebase Data object in global scope

FirebaseData firebaseData;

//4. Setup Firebase credential in setup()

Firebase.begin("yout_project_id.firebaseio.com", "your_Firebase_database_secret");

//5. Optional, set AP reconnection in setup()

Firebase.reconnectWiFi(true);

//6. Optional, set number of auto retry when read/store data

 Firebase.setMaxRetry(firebaseData, 3);

//7. Optional, set number of read/store data error can be added to queue collection

Firebase.setMaxErrorQueue(firebaseData, 30);

//8. Optional, use classic HTTP GET and POST requests.
//This option allows get and delete functions (PUT and DELETE HTTP requests) works for device connected behind the
//Firewall that allows only GET and POST requests.
  
Firebase.enableClassicRequest(firebaseData, true);

```

___





### Read, Store, Update, Delete, Backup and Restore Data


**To read the data, use `get<Data Type>` functions i.e. getInt, getFlot, getDouble, getBool, getString, getJSON, getBlob and getFile.**



The `get<Data Type>` function returned boolean value for success of operation. The success of operation determined from

payload that Firebase server returned back to client. The http status and matching between data type request and response were determined to set the success status.

To read the payload data, one of theses functions can be called i.e. intData, floatData, doubleData, boolData, stringData, jsonData and blobData.

The data you read from returned payload will tell actual data type stored or existed in database, not the modification version or variant data types e.g. string "1.5" stored in database, can be read only from stringData as it returned from server.

Any attempt to read integer from intData, float from floatData, double from doubleData and JSON from JsonData will return zero and empty string. 

This allow you to know what exactly data type stored in database and how to manage it instead of cast all data as string (int -> string or float -> string) or as number. 

You can call getDataType to determine what type of data returned to be manipulated.

BLOB and file stream daya types were only implemented by this library.

Normally BLOB or any binary data type is not supported by Firebase Realtime database, this library working with binary data by encoding the data into string before sending to server.

Then getBlob and getFile functions will read the encoded string from database and decoded it back to binary data before return data to client.

Encoding binary to string in this library is using base64 binary-to-text encoding schemes, the encoded string will be prefixed with some header string ("file,base64," and "blob,base64,") for data type manipulation. 

The encoded string length will larger than the original binary data by 30%.

The terms used in this document and library, Blob data is byte array in memory that encoded to string to store or decoded when read from database.

While file stream is binary data that being write to SD card which obtained from decoded string that read from database or binary data that being read from SD card and encoded to string to store in database.

Then getBlob function reads data in database and decoded it into byte array, while getFile reads data in database, then decoded and save it to SD card.

Here is the example usage to read integer value from defined database path "/test/int".


```C++

//Read integer value from database at "/test/int" 

  int val = 0;

  if (Firebase.getInt(firebaseData, "/test/int")) {

    //Success, then read the payload value

    //Make sure payload value returned from server is integer
    //This prevent you to get garbage data
    if (firebaseData.dataType() == "int")) {
      val = firebaseData.intData();
      Serial.println(val);
    }

  } else {
    //Failed, then print out the error detail
    Serial.println(firebaseData.errorReason());
  }

```





**To store the data, use `set<Data Type>` functions i.e. setInt, setFlot, setDouble, setBool, setString, setJSON, setBlob and setFile.**



The `set<Data Type>` function returned boolean value for success of operation. The success of operation determined from

payload that Firebase server returned back to client. The http status and matching between data type request and response.

Only setBlob and setFile functions that make a silent request to Firebase server, thus no payload response is returned. 

The success operation for setBlob and setFile determined only from http status "No Content".

You can set or delete the data upon the condition of ETag (unique identifier value) that belongs to every database path.

By provide ETag value (string) to set or delete functions (setInt, setFloat, setDouble, setBool, setString, setJSON, setBlob, setFile and deleteNode), the data will be set/delete only if the provided ETag matches the ETag at defined database path.

If the provided ETag is not match, the data was not set/deleted, HTTP response code 412 Precondition Failed will return.

You can get ETag from get, set and delete functions by call firebaseData.ETag() which return unique identifier and null_etag respectively.

You can get ETag from any database path by call Firebase.getETag(firebaseData, PATH_TO_GET_ETAG).

ETag value changed up on data was set or delete.

The functions updateNode, setRules, getRules, backup and restore are not support ETag.

For the ETag usage, see ETag.ino sketch file in examples folder.



For set server timestamp in database, call Firebase.setTimestamp. The returned timestamp value can get from firebaseData.getInt(). Because of internal server error, ETag is not request during perform setTimestamp function but can get it later by call Firebase.getETag.

The functions getTimestamp and set, push, delete with ETag functions will not queue in Error Queue collection.


Below is the example usage to store or set file data from SD card, "/test.txt" to defined database path "/test/file_data".


```C++

//Store file content "/test.txt" on SD card to database at "/test/file_data".
//Due to SD library used, file name must be in 8.3 DOS format (max. 8 bytes file name and 3 bytes file extension).

if (Firebase.setFile(firebaseData, "/test/file_data", "/test.txt")){

  //Success, data was downloaded and saved then open the file.
  //Print out all file content.

  File file = SD.open("/test.txt", FILE_READ);

  while (file.available())
  {     
    Serial.print(file.read(), HEX);     
  }    
  file.close();
  Serial.println();

} else {
  //Failed, then print out the error detail for file transfer error.
  //Use firebaseData.fileTransferError instead of firebaseData.errorReason() in case of working with file.
  Serial.println(firebaseData.fileTransferError());
}

```





**To append new data to database, `push<Data Type>` should be called e.g. pushInt, pushFloat, pushDouble, pushBool, pushString, pushJSON, pushBlob and pushFile.**


With push operation, server will return payload (key or name of newly appended node) to client.

Working with JSON data allow us to read or store multiple data at once because JSON data can store many key/value pairs, array of object and nested objects.

Function setJSON will set/replace value at defined database path with value in JSON data, and also create child nodes.  

While in function pushJSON, all key/value in JSON data  will be appended to the defined database path as new node.

For push server timestamp in database, call Firebase.pushTimestamp. Because of internal server error, ETag is not request during perform setTimestamp function but can get it later by call Firebase.getETag.


Below is the example for appending new data (using JSON) to the path "/test/append.


```C++

//Append many data (multiple keys included nest data) to the database at "/test/append"

String jsonData = "{\"parent_001\":\"parent 001 text\", \"parent 002\":{\"child_of_002\":123.456}}";

if (Firebase.pushJSON(firebaseData, "/test/append", jsonData)) {

  //Success, then read the payload value

  //Database path to be appended
  Serial.println(firebaseData.dataPath()); //Should be "/test/append"

  //New created key/name
  Serial.println(firebaseData.pushName());

  //Absolute path of new appended data
    Serial.println(firebaseData.dataPath() + "/"+ firebaseData.pushName());


} else {
  //Failed, then print out the error detail
  Serial.println(firebaseData.errorReason());
}

```





**To update database at defined path and its child nodes, updateNode or updateNodeSilent should be called.**


JSON data is needed, and passed to these functions. The result from update operation, the database data at defined path will be partialy or completed update depending on the keys in JSON data. 

If any key provided in JSON data was not existed in database at the path, new key will be created.

Everytime you call updateNode, the payload that exactly the JSON data you sent will return back from server. 

Update database with large JSON will consume as much as double network data. Function updateNodeSilent can reduce the network data usage in this case.

Below is the example for database update at "/test" using JSON data.


```C++

//Append many data (multiple keys included nest data) to the database at "/test/update"

String updateData = "{\"data1\":\"value1\", \"data2\":{\"_data2\":\"_value2\"}}";

if (Firebase.updateNode(firebaseData, "/test/update", updateData)) {

  //Success, then try to read the payload value

  //Database path that updated
  Serial.println(firebaseData.dataPath());

  //Data type at updated database path
  Serial.println(firebaseData.dataType()); //Should be "json"

  //Print the JSON string payload that returned from server
  Serial.println(firebaseData.jsonData()); //Should mathes the value in updateData variable

  //Actual sent payload JSON data
  Serial.println(updateData);

} else {
  //Failed, then print out the error detail
  Serial.println(firebaseData.errorReason());
}

```





**To delete the data in database, just call deleteNode function.**


Below example will delete data and its child nodes at "/test/append"

```C++

Firebase.deleteNode(firebaseData, "/test/append");

```





**Data Filtering via query parameters**

The quey parameters that can set using the QueryFilter class.

These parameters are `orderBy`, `limitToFirst`, `limitToLast`, `startAt`, `endAt`, and `equalTo`.

To filter data, parameter `orderBy` should be assigned which you can assign "$key" for filtering all nodes under defined database path
using their keys, assign "$value" for filtering all nodes under defined database path using their values. 

Assign specific node key or name for filtering the specified child node under defined database path using their key, and assign "$priority" for filtering all nodes under defined database path using their "virtual child" named .priority.

And using the follower query properties to limit the queries.

`QueryFilter.limitToFirst` -  The total children (number) to filter from the first child.

`QueryFilter.limitToLast` -   The total last children (number) to filter. 

`QueryFilter.startAt` -       Starting value of range (number or string) of query upon orderBy param.

`QueryFilter.endAt` -         Ending value of range (number or string) of query upon orderBy param.

`QueryFilter.equalTo` -       Value (number or string) matches the orderBy param



Below example show how to using queries parameter in QueryFilter class to filter the data at database path "/test/data"

```C++

//Assume that children that have key "sensor" are under "/test/data"

//Instantiate the QueryFilter class
QueryFilter query;

//Build query using specified child node key "sensor" under "/test/data"
query.orderBy("sensor");

//Query any child that its value is begin with 2 (number), assumed that its data type is float or integer
query.startAt(2);

//Query any child that its value is end with 8 (number), assumed that its data type is float or integer
query.endAt(8);

//Limit the maximum query result to return only the last 5 nodes
query.limitToLast(5);


if (Firebase.getJSON(firebaseData, "/test/data", query))
{
  //Success, then try to read the JSON payload value
  Serial.println(firebaseData.jsonData());
}
else
{
  //Failed to get JSON data at defined database path, print out the error reason
  Serial.println(firebaseData.errorReason());
}

//Clear all query parameters
query.clear();



```



___






### Data Changes Monitoring (Stream)



**The Firebase Realtime Database update or change event was sent to client using the HTTP stream connection. The connection was keep alive as long as no network interruption.**

The function to handle the update and change event monitoring are beginStream, setStreamCallback and readStream.

To subscribe, monitor or follow the data changes on defined database path, the function beginStream must be called first.

To handle the data that will be received when database at that path updates or changes, the function readStream should be called in loop, otherwise callback function is required and assigned using the function setStreamCallback.

When no callback function was assigned, the data that return from stream should be routinely read inside the loop function. To determine the stream data is available, function streamAvailable should be called. 

The function streamAvailable returned true when stream data was received in received buffer. 

Then stream data can be accessed directly by calling intData, floatData, doubleData, boolData, stringData, jsonData and blobData.

If stream callback function was assigned, it should accept StreamData as parameter which is a class that contains all data from stream, included streamPath, dataPath, dataType and value changes at defined streaming path.

To end the stream, call endStream. 

Here is the example use of stream to handle the data changes or data updates at "/test/data".

```C++


//In setup(), set the streaming path to "/test/data" and begin stream connection

if (!Firebase.beginStream(firebaseData, "/test/data"))
{
  //Could not begin stream connection, then print out the error detail
  Serial.println(firebaseData.errorReason());
}

//In loop()


 if (!Firebase.readStream(firebaseData))
  {
    //If read stream was failed, print the error detail.
    Serial.println(firebaseData.errorReason());
  }

  if (firebaseData.streamTimeout())
  {
     //If stream timeout, just notify
    Serial.println("Stream timeout, resume streaming...");
    Serial.println();
  }

  if (firebaseData.streamAvailable())
  {
   
   //Print out value
   //Stream data can be many types which can be determined from function dataType

  if (data.dataType() == "int")
    Serial.println(data.intData());
  else if (data.dataType() == "float")
    Serial.println(data.floatData(), 5);
  else if (data.dataType() == "double")
    Serial.println(data.doubleData(), 9);
  else if (data.dataType() == "boolean")
    Serial.println(data.boolData() == 1 ? "true" : "false");
  else if (data.dataType() == "string")
    Serial.println(data.stringData());
  else if (data.dataType() == "json")
    Serial.println(data.jsonData());
    
  }



```

___





### Database Backup and Restore


**The backup and restore, specify the filename and the database path to backup or restore.**

Due to SD library used, only 8.3 DOS format file name was support i.e. maximum 8 characters for file name and 3 characters for file extension.

The database restoration returned completed status only when Firebase server completely update the data. 

Any failed operation will not affected the database (no updates or changes).

Here is the usage example to back up all database at root path "/" and restore it back to database.

```C++

 String backupFileName = "";

 //Begin backup whole database and download to "/backup.txt" on SD card
 if (!Firebase.backup(firebaseData, "/", "/backup.txt"))
 {
   //Error when backup database, then print out file transfer error detail
   Serial.println(firebaseData.fileTransferError());
 }
 else
 {
   //Successfull backup, print out the file path and size
   Serial.println(firebaseData.getBackupFilename());
   Serial.println(firebaseData.getBackupFileSize());

   backupFileName = firebaseData.getBackupFilename();
  }


  //Begin restore backed dup data back to database

  if (!Firebase.restore(firebaseData, "/", backupFileName))
  {
    //Database restoration failed, printout the error detail
    Serial.println(firebaseData.fileTransferError());
  }
  else
  {
    //Database restoration success, printout the filename that used for restore
    Serial.println(firebaseData.getBackupFilename());
  }

```


___


### Error Retry and Queues




**To set number of trial when read or store database failed, call setMaxRetry function**

Any Firebase read or store data was failed due to network problems or buffer overflow, it will retry for the times that defined by setMaxRetry function.

```C++
//set maximum trial to 3
 Firebase.setMaxRetry(firebaseData, 3);

```


**To set maximum Error Queues that added to Error Queue collection, call setMaxErrorQueue function**

After trial was reached the max retry in setMaxRetry, that error operation (due to netork and overflow problems) will be added to Error Queue collection. The maximum queues that can be stored in Error Queue collection will be limited by setMaxErrorQueue.

The queue collection status can be checked by isErrorQueueFull function.


```C++

 //set maximum queues to 10
 Firebase.setMaxErrorQueue(firebaseData, 10);

 //determine whether Error Queue collection is full or not
 Firebase.isErrorQueueFull(firebaseData);

```

**To run Error Queues**

The function processErrorQueue will run or process queues manually and recommended to use it in loop().

To track Error Queues, when Firebase operation was failed to read/store data, call getErrorQueueID function i.e. Firebase.getErrorQueueID(firebaseData) to get the unsigned integer presents the id of queue, use this number to check whether this queue id is still existed in Error Queue collection or not. 

Use isErrorQueueExisted i.e. Firebase.isErrorQueueExisted(firebaseData, SOME_ID) to check the existence of queue in Error Queue collection.

If the queue id is not existed, that queue is already done.


Below is to run Error Queues and track the status.


```C++

//In setup()

//Set the maximum Firebase Error Queues in collection (0 - 255).
//Firebase read/store operation causes by network problems and buffer overflow will be added to Firebase Error Queues ollection.
Firebase.setMaxErrorQueue(firebaseData, 10);



//All of the following are in loop()

Firebase.processErrorQueue(firebaseData);

//Detrnine the queue status
if (Firebase.isErrorQueueFull(firebaseData))
{
  Serial.println("Queue is full");
}

//Remaining Error Queues in Error Queue collection
Serial.print("Remaining queues: ");
Serial.println(Firebase.errorQueueCount(firebaseData));

//Assumed that queueID is unsigned integer array of queue that added to Error Queue collection when error and use Firebase.getErrorQueueID to get this Error Queue id.

for (uint8_t i = 0; i < LENGTH_OF_QUEUEID_ARRAY; i++)
{
  Serial.print("Error Queue ");
  Serial.print(queueID[i]);
  if (Firebase.isErrorQueueExisted(firebaseData, queueID[i]))
    Serial.println(" is queuing");
  else
    Serial.println(" is done");
}
Serial.println();


```


**To save and restore Error Queues**

**To save Error Queue, call saveErrorQueue and to restore Error Queues, call restoreErrorQueue**

Error Queus can be save as file in SD card or Flash memory with saveErrorQueue function which two types of storage can be asigned, QueueStorageType::SPIFFS and QueueStorageType::SD.

Error Queues store as file can be restored to Error Queue collection with restoreErrorQueue function which two types of storage can be asigned as defined in saveErrorQueue function.

Only set/push/update queues can be saved to file for further resume due to it not need destination variable to store data as get queue.

Below is example for restore and save Error Queues in /test.txt file.

```C++
//To restore Error Queues

if (Firebase.errorQueueCount(firebaseData, "/test.txt", QueueStorageType::SPIFFS) > 0)
{
    Firebase.restoreErrorQueue(firebaseData, "/test.txt", QueueStorageType::SPIFFS);
    Firebase.deleteStorageFile("/test.txt", QueueStorageType::SPIFFS);
}

//To save Error Queues to file
Firebase.saveErrorQueue(firebaseData, "/test.txt", QueueStorageType::SPIFFS);

```



**Send Notification message through Firebase Cloud Messaging (FCM)**

There are two types of FCM message data that can be sent using this library e.g. notification and custom data.

These two types data can send together or separately.

To send message to one recipient, call Firebase.sendMessage and call Firebase.broadcastMessage to send message to multiple recipients.  

Use Firebase.sendTopic when to send message to any recipient who subscribed to the topic.

The FCM message it self offers broad range of messaging options and capabilities for various recipient device platforms i.e. Android, iOS and web, these basic options can be set and work for all platforms. 


To assign server key of your Firebase project, call firebaseData.fcm.begin.

To add recipient registered device token which you want to send message to, call firebaseData.fcm.addDeviceToken. This recipient device token can be removed or clear by firebaseData.fcm.removeDeviceToken and firebaseData.fcm.clearDeviceToken.

For the notification message, title, body, icon (optional), and click_action (optional) can be set through firebaseData.fcm.setNotifyMessage. And clear these notify message data with firebaseData.fcm.clearNotifyMessage.

For the data message, provide your custom data as JSON object (string) to firebaseData.fcm.setDataMessage which can be clear with firebaseData.fcm.clearDataMessage.

The other options are priority, collapse key, Time to Live of message and topic to send message to, can be set from the following functions.

Call firebaseData.fcm.setPriority for priority ("normal" or "high"), firebaseData.fcm.setCollapseKey for collapse key setup, firebaseData.fcm.setTimeToLive for life span of message setup between 0 sec. to 2,419,200 sec.  (or 4 weeks), and firebaseData.fcm.setTopic for assigning the topic that message to send to.


Below is example how to send FCM message.

```C++
//Provide your Firebase project's server key here
firebaseData.fcm.begin(FIREBASE_FCM_SERVER_KEY);

//Prvide one or more the recipient registered token or instant ID token
firebaseData.fcm.addDeviceToken(FIREBASE_FCM_DEVICE_TOKEN);

//Provide the priority (optional)
firebaseData.fcm.setPriority("normal");

//Provide the time to live (optional)
firebaseData.fcm.setTimeToLive(5000);

//Set the notification message data
firebaseData.fcm.setNotifyMessage("Notification", "Hello World!", "firebase-logo.png", "http://www.google.com");

//Set the custom message data
firebaseData.fcm.setDataMessage("{\"myData\":\"myValue\"}");

//Send message to one recipient with inddex 1 (index starts from 0)
if (Firebase.sendMessage(firebaseData, 1))
{
  //Success, print the result returned from server
  Serial.println(firebaseData.fcm.getSendResult());
}
else
{
  //Failed, print the error reason
  Serial.println(firebaseData.errorReason());
}

```


See [full examples](https://github.com/mobizt/Firebase-ESP8266/tree/master/examples) for all features usages.





## All Supported Functions


**These are all functions available from the library and the descriptions.**


### Global functions


**Store Firebase's authentication credentials.**

param *`host`* - Your Firebase database project host without http:// or https:// protocol e.g. Your_ProjectID.firebaseio.com.

param *`auth`* - Your database secret.

```C++
void begin(const String &host, const String &auth);
```





**Reconnect WiFi if lost connection.**

param *`reconnect`* - The boolean to set/unset WiFi AP reconnection.

```C++
void reconnectWiFi(bool reconnect);
```





**Read the database rules.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

return - *`Boolean`* type status indicates the success of operation.

```C++
bool getRules(FirebaseData &dataObj);
```





**Write the database rules.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`rules`* - Database rules in jSON String format.

return - *`Boolean`* type status indicates the success of operation.

```C++
bool setRules(FirebaseData &dataObj, const String &rules);
```






**Determine whether defined database path is existed or not.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path to be checked.

return - *`Boolean`* type result indicates whether the defined database
path was existed or not.

```C++
bool pathExist(FirebaseData &dataObj, const String &path);
```





**Determine the unique identifier (ETag) of current data at the defined database path.**

return *`String`* of unique identifier.

```C++
String getETag(FirebaseData &dataObj, const String &path);
```






**Enable the library to use only classic HTTP GET and POST methods.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`flag`* - Boolean value to enable.

This option used to escape the Firewall restriction (if device is connected through Firewall) that allows only HTTP GET and POST
    
HTTP PATCH request was sent as PATCH which not affected by this option.

```C++
void enableClassicRequest(FirebaseData &dataObj, bool flag);
```







**Append new integer value to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which integer value will be appended.

param *`intValue`* - The appended value.

return *`Boolean`* type status indicates the success of operation.

The new appended node's key will be stored in Firebase Data object, 
which its value can be accessed via function [FirebaseData object].pushName().

```C++
bool pushInt(FirebaseData &dataObj, const String &path, int intValue);
```





**Append new float value to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which float value will be appended.

param *`floatValue`* - The appended value.

return *`Boolean`* type status indicates the success of operation.

The new appended node's key will be stored in Firebase Data object, 
which its value can be accessed via function [FirebaseData object].pushName().

```C++
bool pushFloat(FirebaseData &dataObj, const String &path, float floatValue);
```






**Append new double value (8 bytes) to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which float value will be appended.

param *`doubleValue`* - The appended value.

return *`Boolean`* type status indicates the success of operation.

The new appended node's key will be stored in Firebase Data object,
which its value can be accessed via function [FirebaseData object].pushName().

```C++
bool pushDouble(FirebaseData &dataObj, const String &path, double doubleValue);
```






**Append new Boolean value to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which Boolean value will be appended.

param *`boolValue`* - The appended value.

return *`Boolean`* type status indicates the success of operation.

The new appended node's key will be stored in Firebase Data object, 
which its value can be accessed via function [FirebaseData object].pushName().

```C++
bool pushBool(FirebaseData &dataObj, const String &path, bool boolValue);
```




**Append new string (text) to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which string will be appended.

param *`stringValue`* - The appended value.

return *`Boolean`* type status indicates the success of operation.

The new appended node's key stored in Firebase Data object, 
which can be accessed via function [FirebaseData object].pushName().

```C++
bool pushString(FirebaseData &dataObj, const String &path, const String &stringValue);
```





**Append new child nodes's key and value (using JSON data) to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which key and value in JSON data will be appended.

param *`jsonString`* - The appended JSON string (should be valid JSON data).

return *`Boolean`* type status indicates the success of operation.

The new appended node's key will be stored in Firebase Data object, 
which its value can be accessed via function [FirebaseData object].pushName().

```C++
bool pushJSON(FirebaseData &dataObj, const String &path, const String &jsonString);
```





**Append new blob (binary data) to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which binary data will be appended.

param *`blob`* - Byte array of data.

param *`size`* - Size of byte array.

return *`Boolean`* type status indicates the success of operation.

The new appended node's key will be stored in Firebase Data object, 
which its value can be accessed via function [FirebaseData object].pushName().

```C++
bool pushBlob(FirebaseData &dataObj, const String &path, uint8_t *blob, size_t size);
```





**Append new binary data from file stores on SD card to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which binary data from file will be appended.

param *`fileName`* - File name (8.3 DOS format) in SD card.

return *`Boolean`* type status indicates the success of operation.

The new appended node's key will be stored in Firebase Data object, 
which its value can be accessed via function [FirebaseData object].pushName().

```C++
bool pushFile(FirebaseData &dataObj, const String &path, const String &fileName);
```





 **Append new Firebase server's timestamp to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which timestamp will be appended.

return - *`Boolean`* type status indicates the success of operation.
    
The new appended node's key will be stored in Firebase Data object, 
which its value can be accessed via function [FirebaseData object].pushName().

```C++
bool pushTimestamp(FirebaseData &dataObj, const String &path);
```





**Set integer data at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which integer data will be set.

param *`intValue`* - Integer value to set.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 
    
Call [FirebaseData object].intData will return the integer value of
payload returned from server.

```C++
bool setInt(FirebaseData &dataObj, const String &path, int intValue);
```





**Set integer data at the defined database path if defined database path's ETag matched the ETag value.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which integer data will be set.

param *`intValue`* - Integer value to set.

param *`ETag`* - Known unique identifier string (ETag) of defined database path.

return - *`Boolean`* type status indicates the success of operation.


Call [FirebaseData object].dataType to determine what type of data that successfully stores in database. 
    
If ETag at the defined database path is not match the provided ETag parameter,the operation will failed with HTTP code 412, Precondition Failed (ETag is not match).

If operation failed due to ETag is not match, call [FirebaseData object].ETag() to get the current ETag value.
Also call [FirebaseData object].intData to get the current integer value.
    
```C++
bool setInt(FirebaseData &dataObj, const String &path, int intValue, const String &ETag);
```






**Set float data at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which float data will be set.

param *`floatValue`* - Float value to set.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].floatData will return the float value of
payload returned from server.

```C++
bool setFloat(FirebaseData &dataObj, const String &path, float floatValue);
```







**Set float data at the defined database path if defined database path's ETag matched the ETag value.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which float data will be set.

param *`floatValue`* - Float value to set.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].floatData will return the float value of
payload returned from server.

If ETag at the defined database path is not match the provided ETag parameter,the operation will failed with HTTP code 412, Precondition Failed (ETag is not match).

If operation failed due to ETag is not match, call [FirebaseData object].ETag() to get the current ETag value.
Also call [FirebaseData object].floatData to get the current float value.

```C++
bool setFloat(FirebaseData &dataObj, const String &path, float floatValue, const String &ETag);
```







**Set double data at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which float data will be set.

param *`doubleValue`* - Double value to set.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database.

Call [FirebaseData object].doubleData will return the double value of
payload returned from server.

```C++
bool setDouble(FirebaseData &dataObj, const String &path, double doubleValue);
```





**Set double data at the defined database path if defined database path's ETag matched the ETag value.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which float data will be set.

param *`doubleValue`* - Double value to set.

param *`ETag`* - Known unique identifier string (ETag) of defined database path.

return - *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully stores in database.

Call [FirebaseData object].doubleData will return the double value of payload returned from server.

If ETag at the defined database path is not match the provided ETag parameter, the operation will failed with HTTP code 412, Precondition Failed (ETag is not match).

If operation failed due to ETag is not match, call [FirebaseData object].ETag() to get the current ETag value.
Also call [FirebaseData object].doubeData to get the current double value.

```C++
bool setDouble(FirebaseData &dataObj, const String &path, double doubleValue, const String &ETag);
```





**Set Boolean data at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which float data will be set.

param *`boolValue`* - Boolean value to set.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].boolData will return the Boolean value of
payload returned from server.

```C++
bool setBool(FirebaseData &dataObj, const String &path, bool boolValue);
```




**Set Boolean data at the defined database path if defined database path's ETag matched the ETag value.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which float data will be set.

param *`boolValue`* - Boolean value to set.

param *`ETag`* - Known unique identifier string (ETag) of defined database path.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].boolData will return the Boolean value of
payload returned from server.


If ETag at the defined database path is not match the provided ETag parameter,
the operation will failed with HTTP code 412, Precondition Failed (ETag is not match).

If operation failed due to ETag is not match, call [FirebaseData object].ETag() to get the current ETag value.
Also call [FirebaseData object].doubeData to get the current boolean value.

```C++
bool setBool(FirebaseData &dataObj, const String &path, bool boolValue, const String &ETag);
```





**Set string (text) at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which string data will be set.

param *`stringValue`* - String or text to set.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].stringData will return the string value of
payload returned from server.

```C++
bool setString(FirebaseData &dataObj, const String &path, const String &stringValue);
```






**Set string (text) at the defined database path if defined database path's ETag matched the ETag value.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which string data will be set.

param *`stringValue`* - String or text to set.

param *`ETag`* - Known unique identifier string (ETag) of defined database path.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].stringData will return the string value of
payload returned from server.

If ETag at the defined database path is not match the provided ETag parameter, 
the operation will failed with HTTP code 412, Precondition Failed (ETag is not match).

If operation failed due to ETag is not match, call [FirebaseData object].ETag() to get the current ETag value.
Also call [FirebaseData object].stringData to get the current string value.

```C++
bool setString(FirebaseData &dataObj, const String &path, const String &stringValue, const String &ETag);
```





**Set child nodes's key and value (using JSON data) to the defined database path.**

This will replace any child nodes inside the defined path with node' s key
and value defined in JSON data.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which key and value in JSON data will be replaced or set.

param *`jsonString`* - The JSON string to set (should be valid JSON data).

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 
 
Call [FirebaseData object].jsonData will return the JSON string value of
payload returned from server.

```C++
bool setJSON(FirebaseData &dataObj, const String &path, const String &jsonString);
```






**Set child nodes's key and value (using JSON data) to the defined database path if defined database path's ETag matched the ETag value.**

This will replace any child nodes inside the defined path with node' s key
and value defined in JSON data.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which key and value in JSON data will be replaced or set.

param *`jsonString`* - The JSON string to set (should be valid JSON data).

param *`ETag`* - Known unique identifier string (ETag) of defined database path.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 
 
Call [FirebaseData object].jsonData will return the JSON string value of
payload returned from server.


If ETag at the defined database path is not match the provided ETag parameter,
the operation will failed with HTTP code 412, Precondition Failed (ETag is not match).

If operation failed due to ETag is not match, call [FirebaseData object].ETag() to get the current ETag value.
Also call [FirebaseData object].jsonData to get the current JSON string value.


```C++
bool setJSON(FirebaseData &dataObj, const String &path, const String &jsonString, const String &ETag);
```






**Set blob (binary data) at the defined database path.**

This will replace any child nodes inside the defined path with blob or binary data.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which binary data will be set.

param *`blob`* - Byte array of data.

param *`size`* - Size of byte array.

return *`Boolean`* type status indicates the success of operation.

No payload returned from server.

```C++
bool setBlob(FirebaseData &dataObj, const String &path, uint8_t *blob, size_t size);
```






**Set blob (binary data) at the defined database path if defined database path's ETag matched the ETag value.**

This will replace any child nodes inside the defined path with blob or binary data.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which binary data will be set.

param *`blob`* - Byte array of data.

param *`size`* - Size of byte array.

param *`ETag`* - Known unique identifier string (ETag) of defined database path.

return *`Boolean`* type status indicates the success of operation.

No payload returned from server.

If ETag at the defined database path is not match the provided ETag parameter,
the operation will failed with HTTP code 412, Precondition Failed (ETag is not match).

```C++
bool setBlob(FirebaseData &dataObj, const String &path, uint8_t *blob, size_t size, const String &ETag);
```






**Set binary data from file stores on SD card to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which binary data from file will be set.

param *`fileName`* - File name in 8.3 DOS format (max. 8 bytes file name and 3 bytes file extension) stored in SD card.

return *`Boolean`* type status indicates the success of operation.

No payload returned from server.

```C++
bool setFile(FirebaseData &dataObj, const String &path, const String &fileName);
```







**Set binary data from file stores on SD card to the defined database path if defined database path's ETag matched the ETag value.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which binary data from file will be set.

param *`fileName`* - File name in 8.3 DOS format (max. 8 bytes file name and 3 bytes file extension) stored in SD card.

param *`ETag`* - Known unique identifier string (ETag) of defined database path.

return *`Boolean`* type status indicates the success of operation.

No payload returned from server.

If ETag at the defined database path is not match the provided ETag parameter,
the operation will failed with HTTP code 412, Precondition Failed (ETag is not match).

```C++
bool setFile(FirebaseData &dataObj, const String &path, const String &fileName, const String &ETag);
```






 **Set Firebase server's timestamp to the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which timestamp will be set.

return - *`Boolean`* type status indicates the success of operation.
    
Call [FirebaseData object].intData will return the integer value of timestamp returned from server.

```C++
bool setTimestamp(FirebaseData &dataObj, const String &path);
```






**Update child nodes's key or exising key's value (using JSON data) under the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which key and value in JSON data will be update.

param *`jsonString`* - The JSON string use for update.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 
 
Call [FirebaseData object].jsonData will return the json string value of
payload returned from server.

To reduce the network data usage, use updateNodeSilent instead.

```C++
bool updateNode(FirebaseData &dataObj, const String &path, const String &jsonString);
```





**Update child nodes's key or exising key's value (using JSON data) under the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Target database path which key and value in JSON data will be update.

param *`jsonString`* - The JSON string use for update.

return *`Boolean`* type status indicates the success of operation.

Owing to the objective of this function to reduce the netwok data usage, 
no payload will be returned from server.

```C++
bool updateNodeSilent(FirebaseData &dataObj, const String &path, const String &jsonString);
```





**Read the integer value at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the integer value is being read.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].intData will return the integer value of
payload returned from server.

If the payload returned from server is not integer or float type, 
the function [FirebaseData object].intData will return zero (0).

If the payload returned from server is float type, 
the function [FirebaseData object].intData will return rounded integer value.

```C++
bool getInt(FirebaseData &dataObj, const String &path);
```





**Read the integer value at the defined database path**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the integer value is being read.

param *`target`* - The integer type variable to store value.

return *`Boolean`* type status indicates the success of operation.

If the type of payload returned from server is not integer, float and double, 
the target variable's value will be zero (0).

```C++
bool getInt(FirebaseData &dataObj, const String &path, int &target);
```






**Read the float value at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the float value is being read.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].floatData will return the float value of
payload returned from server.

If the payload returned from server is not integer or float type, 
the function [FirebaseData object].intData will return zero (0).

```C++
bool getFloat(FirebaseData &dataObj, const String &path);
```






**Read the float value at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the float value is being read.

param *`target`* - The float type variable to store value.

return *`Boolean`* type status indicates the success of operation.

If the type of payload returned from server is not integer, float and double, 
the target variable's value will be zero (0).

```C++
bool getFloat(FirebaseData &dataObj, const String &path, float &target);
```






**Read the double value at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the float value is being rea.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 
    
Call [FirebaseData object].doubleData will return the double value of
payload returned from server.

If the payload returned from server is not integer, float and double, 
the function [FirebaseData object].doubleData will return zero (0).

```C++
bool getDouble(FirebaseData &dataObj, const String &path);
```







**Read the float value at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the float value is being read.

param *`target`* - The double type variable to store value.

return *`Boolean`* type status indicates the success of operation.

If the type of payload returned from server is not integer, float and double, 
the target variable's value will be zero (0).

```C++
bool getDouble(FirebaseData &dataObj, const String &path, double &target);
```






**Read the Boolean value at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the Boolean value is being read.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].boolData will return the Boolean value of
payload returned from server.

If the payload returned from server is not boolean type, 
the function [FirebaseData object].boolData will return false.

```C++
bool getBool(FirebaseData &dataObj, const String &path);
```







**Read the Boolean value at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the Boolean value is being read.

param *`target`* - The boolean type variable to store value.

return *`Boolean`* type status indicates the success of operation.

If the type of payload returned from server is not Boolean, 
the target variable's value will be false.

```C++
bool getBool(FirebaseData &dataObj, const String &path, bool &target);
```






**Read the string or text at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the string value is being read.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].stringData will return the string value of
payload returned from server.

If the payload returned from server is not string type, 
the function [FirebaseData object].stringData will return empty string (String object).

```C++
bool getString(FirebaseData &dataObj, const String &path);
```






**Read the string or text at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the string value is being read.

param *`target`* - The String object to store value.

return *`Boolean`* type status indicates the success of operation.

If the type of payload returned from server is not string,
the target String object's value will be empty.

```C++
bool getString(FirebaseData &dataObj, const String &path, String &target);
```





**Read the JSON string at the defined database path.**

The returned payload JSON string represents the child nodes and their value.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the JSON string value is being read.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].jsonData will return the JSON string value of
payload returned from server.

If the payload returned from server is not json type, 
the function [FirebaseData object].jsonData will return empty string (String object).

```C++
bool getJSON(FirebaseData &dataObj, const String &path);
```








**Read the JSON string at the defined database path.**

The returned payload JSON string represents the child nodes and their value.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the JSON string value is being read.

param *`target`* - The String object to store JSON string.

return *`Boolean`* type status indicates the success of operation.

If the type of payload returned from server is not string,
the target String object's value will be empty.

```C++
bool getJSON(FirebaseData &dataObj, const String &path, String &target);
```







**Read the JSON string with data filtering at the defined database path.**

The returned payload JSON string represents the child nodes and their value.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the JSON string value is being read.

param *`query`* - QueryFilter class to set query parameters to filter data.

return *`Boolean`* type status indicates the success of operation.

Available query parameters for filtering the data are the following.

*`QueryFilter.orderBy`* - Required parameter to specify which data used for data filtering included child key, key and value.

Use "$key" for filtering data by keys of all nodes at the defined database path.

Use "$value" for filtering data by value of all nodes at the defined database path.

Use "$priority" for filtering data by "virtual child" named .priority of all nodes.

Use any child key to filter by that key.


*`QueryFilter.limitToFirst`* -  The total children (number) to filter from the first child.

*`QueryFilter.limitToLast`* -   The total last children (number) to filter. 

*`QueryFilter.startAt`* -       Starting value of range (number or string) of query upon orderBy param.

*`QueryFilter.endAt`* -         Ending value of range (number or string) of query upon orderBy param.

*`QueryFilter.equalTo`* -       Value (number or string) matches the orderBy param


Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 

Call [FirebaseData object].jsonData will return the JSON string value of
payload returned from server.

If the payload returned from server is not json type, 
the function [FirebaseData object].jsonData will return empty string (String object).

[FirebaseData object].jsonData will return null when the filtered data is empty.

```C++
bool getJSON(FirebaseData &dataObj, const String &path, QueryFilter &quer);
```







**Read the JSON string at the defined database path as above**

The returned payload JSON string represents the child nodes and their value.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the JSON string value is being read.

param *`target`* - The String object to store JSON string.

return *`Boolean`* type status indicates the success of operation.

If the type of payload returned from server is not json,
the target String object's value will be empty.

```C++
bool getJSON(FirebaseData &dataObj, const String &path, QueryFilter &query, String &target);
```







**Read the blob (binary data) at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the binary data is being read.

return *`Boolean`* type status indicates the success of operation.

Call [FirebaseData object].dataType to determine what type of data that successfully
stores in database. 
    
Call [FirebaseData object].blobData will return the dynamic array of unsigned 8-bit data (i.e. `std::vector<uint8_t>`) of
payload returned from server.

If the payload returned from server is not blob type, 
the function [FirebaseData object].blobData will return empty array.

```C++
bool getBlob(FirebaseData &dataObj, const String &path);
```






**Read the blob (binary data) at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path which the binary data is being read.

param *`target`* - Dynamic array of unsigned 8-bit data (i.e. std::vector<uint8_t>) to store value.

return *`Boolean`* type status indicates the success of operation.

If the type of payload returned from server is not blob,
the target variable value will be empty array.

```C++
bool getBlob(FirebaseData &dataObj, const String &path, std::vector<uint8_t> &target);
```







**Download file data in database at defined database path and save to SD card.**

The downloaded data will be decoded to binary and save to SD card, then

please make sure that data at the defined database path is file type.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`nodePath`* - Database path that file data will be downloaded.

param *`fileName`* - File name in 8.3 DOS format (max. 8 bytes file name and 3 bytes file extension) to save in SD card.

return *`Boolean`* type status indicates the success of operation.

```C++
bool getFile(FirebaseData &dataObj, const String &nodePath, const String &fileName);
```





**Delete all child nodes at the defined database path.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path to be deleted.

return *`Boolean`* type status indicates the success of operation.*

```C++
bool deleteNode(FirebaseData &dataObj, const String &path);
```





**Delete all child nodes at the defined database path if defined database path's ETag matched the ETag value.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path to be deleted.

param *`ETag`* - Known unique identifier string (ETag) of defined database path.

return *`Boolean`* type status indicates the success of operation.*

If ETag at the defined database path is not match the provided ETag parameter,
the operation will failed with HTTP code 412, Precondition Failed (ETag is not match).

```C++
bool deleteNode(FirebaseData &dataObj, const String &path, const String &ETag);
```







**Start monitoring the value changes at the defined path and its children.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`path`* - Database path being monitor.

return *`Boolean`* type status indicates the success of operation.*

```C++
bool beginStream(FirebaseData &dataObj, const String &path);
```





**Read the stream event data at defined database path.**

Once beginStream was called e.g. in setup(), the readStream function
should call inside the loop function.

param *`dataObj`* - Firebase Data Object to hold data and instances.

return *`Boolean`* type status indicates the success of operation.

Using the same Firebase Data object for stream read/monitoring associated 
with read, store, update, delete will break or quit the current stream connection. 
    
The stream will be resumed or reconnected automatically when calling readStream.

```C++
bool readStream(FirebaseData &dataObj);
```





**End the stream connection at defined path.**

Can be restart again by calling beginStream.

param *`dataObj`* - Firebase Data Object to hold data and instances.

return *`Boolean`* type status indicates the success of operation.
 
```C++
bool endStream(FirebaseData &dataObj);
```




**Clear all Firbase Error Queues in Error Queue collection.**

param *`dataObj`* - Firebase Data Object to hold data and instances.


```C++
void clearErrorQueue(FirebaseData &dataObj);
```






**Set maximum Firebase read/store retry operation (0 - 255) in case of network problems and buffer overflow.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`num`* - The maximum retry.

```C++
void setMaxRetry(FirebaseData &dataObj, uint8_t num);
```





**Set the maximum Firebase Error Queues in collection (0 - 255).**

Firebase read/store operation causes by network problems and buffer overflow will be added to Firebase Error Queues collection.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`num`* - The maximum Firebase Error Queues.

```C++
void setMaxErrorQueue(FirebaseData &dataObj, uint8_t num);
```




   
**Save Firebase Error Queues as SPIFFS file (save only database store queues).**

Firebase read (get) operation will not be saved.

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`filename`* - File name to be saved.

param *`storageType`* - Type of storage to save file, QueueStorageType::SPIFS or QueueStorageType::SD.
    
```C++
bool saveErrorQueue(FirebaseData &dataObj, const String &filename, uint8_t storageType);
```
   





**Delete file in Flash (SPIFFS) or SD card.**

param *`filename`* - File name to delete.

param *`storageType`* - Type of storage to save file, QueueStorageType::SPIFS or QueueStorageType::SD.
    
```C++
bool deleteStorageFile(const String &filename, uint8_t storageType);
```




   
**Restore Firebase Error Queues from SPIFFS file.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`filename`* - File name to be read and restore queues.

param *`storageType`* - Type of storage to read file, QueueStorageType::SPIFS or QueueStorageType::SD.
    
```C++
bool restoreErrorQueue(FirebaseData &dataObj, const String &filename, uint8_t storageType);
```





**Determine number of Firebase Error Queues stored in defined SPIFFS file.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`filename`* - File name to be read and count for queues.

param *`storageType`* - Type of storage to read file, QueueStorageType::SPIFS or QueueStorageType::SD.


return *`Number`* (0-255) of queues store in defined SPIFFS file.

```C++
uint8_t errorQueueCount(FirebaseData &dataObj, const String &filename, uint8_t storageType);
```






**Determine number of queues in Firebase Data object Firebase Error Queues collection.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

return *`Number`* (0-255) of queues in Firebase Data object queue collection.

```C++
uint8_t errorQueueCount(FirebaseData &dataObj);
```






**Determine whether the Firebase Error Queues collection was full or not.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

return *`Boolean`* type status indicates whether the  Firebase Error Queues collection was full or not.

```C++
bool isErrorQueueFull(FirebaseData &dataObj);
```






**Pocess all failed Firebase operation queue items when network is available.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`callback`* - Callback function that accepts QueueInfo parameter.
  
```C++
void processErrorQueue(FirebaseData &dataObj, QueueInfoCallback callback = NULL);
```






**Return Firebase Error Queue ID of last Firebase Error.**

Return 0 if there is no Firebase Error from last operation.

param *`dataObj`* - Firebase Data Object to hold data and instances.
    
return *`Number`* of Queue ID.

```C++
uint32_t getErrorQueueID(FirebaseData &dataObj);
```




**Determine whether Firebase Error Queue is currently exsted is Error Queue collection or not.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`errorQueueID`* - The Firebase Error Queue ID get from getErrorQueueID.
    
return - *`Boolean type`* status indicates the queue existence.

```C++
bool isErrorQueueExisted(FirebaseData &dataObj, uint32_t errorQueueID);
```





**Backup (download) database at defined database path to SD card.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`nodePath`* - Database path to be backuped.

param *`fileName`* - File name in 8.3 DOS format (max. 8 bytes file name and 3 bytes file extension) to save in SD card.

return *`Boolean`* type status indicates the success of operation.


```C++
bool backup(FirebaseData &dataObj, const String &nodePath, const String &fileName);
```





**Restore database at defined path usin backup file saved on SD card.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`nodePath`* - Database path to  be restored.

param *`fileName`* - Backup file name in 8.3 DOS format (max. 8 bytes file name and 3 bytes file extension) stored in SD card.

return *`Boolean`* type status indicates the success of operation.

```C++
bool restore(FirebaseData &dataObj, const String &nodePath, const String &fileName);
```





**Send Firebase Cloud Messaging to device with first registeration token which added by firebaseData.fcm.addDeviceToken.**

param *`dataObj`* - Firebase Data Object to hold data and instances.

param *`index`* - The index (starts from 0) of recipient device token which added by firebaseData.fcm.addDeviceToken
    
return - *`Boolean type`* status indicates the success of operation.

```C++
bool sendMessage(FirebaseData &dataObj, uint16_t index);
```





**Send Firebase Cloud Messaging to all devices (multicast) which added by firebaseData.fcm.addDeviceToken.**

param *`dataObj`* - Firebase Data Object to hold data and instances.
    
return - *`Boolean type`* status indicates the success of operation.

```C++
bool broadcastMessage(FirebaseData &dataObj);
```




**Send Firebase Cloud Messaging to devices that subscribed to topic.**

param *`dataObj`* - Firebase Data Object to hold data and instances.
    
return - *`Boolean type`* status indicates the success of operation.

```C++
bool sendTopic(FirebaseData &dataObj);
```



### Firebase Data object functions


**Get WiFi client instance.**


return *`WiFi client instance`*.

```C++
WiFiClientSecure getWiFiClient();
```





**Pause/Unpause WiFiClient from all Firebase operations.**

param *`pause`* True for pause and False for unpause.

return *`Boolean`* type status indicates the success of operation.

```C++
bool pauseFirebase(bool pause);
```






**Determine the data type of payload returned from server.**

return *`The one of these data type e.g. integer, float, string, json and blob.`*

```C++
String dataType();
```






**Determine the event type of stream.**

return *`The one of these event type String e.g. put, patch, cancel, and auth_revoked.`*

The event type "put" indicated that data at event path relative to stream path was completely changed. Event path can be determined from dataPath().

The event type "patch" indicated that data at event path relative to stream path was updated. Event path can be determined from dataPath().

The event type "cancel" indeicated something wrong and cancel by server.

The event type "auth_revoked" indicated the provided Firebase Authentication Data (Database secret) is no longer valid.

```C++
String eventType();
```






**Determine the unique identifier (ETag) of current data.**

return *`String.`* of unique identifier.

```C++
String ETag();
```






**Determine the current stream path.**

return *`The database streaming path.`*

```C++
String streamPath();
```







**Determine the current data path.**

return *`The database path which belong to server' s returned payload.`*

The database path returned from this function in case of stream, also changed up on the child or parent's stream
value changes.

```C++
String dataPath();
```







**Determine the error reason String from process.**

return *`The error description string (String object).`*

```C++
String errorReason();
```







**Return the ineger data of server returned payload.**

return *`Integer value.`*

```C++
int intData();
```







**Return the float data of server returned payload.**

return *`Float value.`*

```C++
float floatData();
```





**Return the double data of server returned payload.**

return *`Double value.`*

```C++
float doubleData();
```





**Return the Boolean data of server returned payload.**

return *`Boolean value.`*

```C++
float boolData();
```






**Return the String data of server returned payload.**

return *`String (String object).`*

```C++
String stringData();
```







**Return the JSON String data of server returned payload.**

return *`String (String object).`*

```C++
String jsonData();
```







**Return the blob data (uint8_t) array of server returned payload.**

return *`Dynamic array`* of 8-bit unsigned integer i.e. `std::vector<uint8_t>`.

```C++
std::vector<uint8_t> blobData();
```







**Return the new appended node's name or key of server returned payload when calling pushXXX function.**

return *`String`* (String object).

```C++
String pushName();
```







**Determine the stream connection status.**

return *`Boolean`* type status indicates whether the Firebase Data object is working with stream or not.

```C++
bool isStream();
```






**Determine the server connection status.**

return *`Boolean`* type status indicates whether the Firebase Data object is connected to server or not.

```C++
bool httpConnected();
```





**Determine the timeout event of server's stream (30 sec is default).**

Nothing to do when stream connection timeout, the stream connection will be automatic resumed.

return *`Boolean`* type status indicates whether the stream was timeout or not.

```C++
bool streamTimeout();
```





**Determine the availability of data or paylaod returned from server.**

return *`Boolean`* type status indicates whether the server return back the new payload or not.

```C++
bool dataAvailable();
```





**Determine the availability of stream event-data paylaod returned from server.**

return *`Boolean`* type status indicates whether the server return back the stream event-data 
payload or not.

```C++
bool streamAvailable();
```





**Determine the matching between data type that intend to get from/store to database and the server's return payload data type.**

return *`Boolean`* type status indicates whether the type of data being get from/store to database 
and server's returned payload are matched or not.

```C++
bool mismatchDataType();
```





**Determine the http status code return from server.**

return *`Integer`* number of HTTP status.

```C++
int httpCode();
```





**Check overflow of the returned payload data buffer.**

return *`Boolean`* of the overflow status.


Default buffer size is 400 bytes, assigned via FIREBASE_RESPONSE_SIZE macro in FirebaseESP8266.h


```C++
bool bufferOverflow();
```





**Determine the name (full path) of backup file in SD card.**

return *`String`* (String object) of file name that store on SD card after backup operation.

```C++
String getBackupFilename();
```





**Determine the size of backup file.**

return *`Number of byte`* of backup file in byte after backup operation.

```C++
size_t getBackupFileSize();
```





**Clear or empty data in Firebase Data object.**

```C++
void clear();
```





**Determine the error description for file transfering (pushFile, setFile, backup and restore).**

return *`Error description string* (String object).`*

```C++
String fileTransferError();
```





**Return the server's payload data.**

return *`Payload string* (String object).`*

```C++
String payload();
```


### Firebase Cloud Messaging object functions


**Store Firebase Cloud Messaging's authentication credentials.**
    
param *`serverKey`* - Server key found on Console: Project settings > Cloud Messaging

```C++
void begin(const String &serverKey);
```






**Add recipient's device registration token or instant ID token.**
    
param *`deviceToken`* - Recipient's device registration token to addd that message will be sent to.

```C++
void addDeviceToken(const String &deviceToken);
```





 **Remove recipient's device registration token or instant ID token.**
    
param *`index`* - Index (start from zero) of recipient's device registration token that added to FCM Data Object of Firebase Data object.

```C++
void removeDeviceToken(uint16_t index);
```




**Clear all recipient's device registration tokens.**
    
 ```C++
 void clearDeviceToken();
```





**Set the notify message type information.**
    
param *`title`* - The title text of notification message.

param *`body`* - The body text of notification message.

```C++
void setNotifyMessage(const String &title, const String &body);
```




**Set the notify message type information.**
    
param *`title`* - The title text of notification message.

param *`body`* - The body text of notification message.

param *`icon`* - The name and/or included URI/URL of icon to show on notify message.

```C++
void setNotifyMessage(const String &title, const String &body, const String &icon);
```





**Set the notify message type information.**
    
param *`title`* - The title text of notification message.

param *`body`* - The body text of notification message.

param *`icon`* - The name and/or included URI/URL of icon to show on notify message.

param *`click_action`* - The URL or intent to accept click event on notification message.

```C++
void setNotifyMessage(const String &title, const String &body, const String &icon, const String &click_action);
```





**Clear all notify message information.**
    
```C++
void clearNotifyMessage();
```





**Set the custom data message type information.**
    
param *`jsonString`* - The JSON structured data string.

```C++
void setDataMessage(const String &jsonString);
```




**Clear custom data message type information.**
    
```C++
void clearDataMessage();
```





**Set the prioiry of message (notification and custom data).**
    
param *`priority`* - The priority string i.e. normal and high.

```C++
void setPriority(const String &priority);
```






**Set the collapse key of message (notification and custom data).**
    
param *`key`* - String of collapse key.

```C++
void setCollapseKey(const String &key);
```





**Set the Time To Live of message (notification and custom data).**
    
param *`seconds`* - Number of seconds from 0 to 2,419,200 (4 weeks).

```C++
void setTimeToLive(uint32_t seconds);
```




**Set topic of message will be send to.**
    
param *`topic - Topic string.

```C++
void setTopic(const String &topic);
```




**Get the send result.**
    
return *`String`* of payload returned from server.

```C++
String getSendResult();
```





## License

The MIT License (MIT)

Copyright (c) 2019 K. Suwatchai (Mobizt)


Permission is hereby granted, free of charge, to any person returning a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

