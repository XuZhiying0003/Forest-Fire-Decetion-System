#include <ArduinoJson.h>   //JSON library for embedded systems
#include <ESP8266WiFi.h>  // library to use the Wifi functions of the ESP8266 module
#include <Wire.h>         //I2C communication library


/*
  Definitions of some common MPU6050 addresses
   the records can be easily found in the record map of the MPU6050
*/
const int MPU_ADDR =      0x68; // MPU6050 sensor address setting (0x68)
const int WHO_AM_I =      0x75; //device identification record
const int PWR_MGMT_1 =    0x6B; // power management configuration log
const int ACCEL_CONFIG =  0x1C; // sensor setup log


bool led_state = false;

// variables to store the raw data of the sensor
float Tmp;

// Wifi network settings
const char* SSID = "MiaoHwRouter";
const char* PASSWORD = "Gayy118410Ffi5h";

// where the web page will be displayed
const char* rpiHost = "192.168.1.198";
WiFiClient client;

// constructing the JSON object that will store the accelerometer data in the populateJSON () function
StaticJsonBuffer<300> jsonBuffer;
JsonObject& object = jsonBuffer.createObject();
JsonObject& data = object.createNestedObject("data");

JsonObject& temp = data.createNestedObject("temp");

/*
   function that connects the ESP8266 to the Wifi network
      SSID and PASSWORD should be indicated in the variables
*/
void reconnectWiFi()
{
  if (WiFi.status() == WL_CONNECTED)
    return;

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Successfully connected to the network: ");
  Serial.println(SSID);
}

void initWiFi()
{
  delay(10);
  Serial.print("Connecting to the network: ");
  Serial.println(SSID);
  Serial.println("Wait");

  reconnectWiFi();
}

/*
  function that stores each sensor data in a JSON object
      uses the ArduinoJson library
*/
void populateJSON()
{
  object["nodeID"] = "mcu1";


  data["temp"] = Tmp;

}

/*
  function that sends sensor data to the server in JSON format
      makes a POST request to the server
*/
void makePOST()
{

  if (!client.connect(rpiHost, 8080))   //here connect to the server
  {
    Serial.println("Could not connect to server!\n");
  }
  else
  {
    
    // Make HTTP POST request
    client.println("POST /accel HTTP/1.1");
    Serial.println("Connected to server");
    client.println("Host: test-mp1.herokuapp.com");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(object.measureLength());
    client.println();
    object.printTo(client);    // we send the data in JSON
  }
}



void readRawMPU() {
  if ( Serial.available()) {
    Tmp = Serial.parseFloat();
    Serial.println(Tmp);
    delay(0);
  }
}
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);

  Serial.println("\nStarting WiFi setup\n");
  initWiFi();


  Serial.println("\nConfiguration Complete, Starting Loop\n");
}

void loop() {
  readRawMPU();    // reads sensor data
  populateJSON();  // transforms the data into JSON format
  makePOST();      // sends the data to the server
  delay(100);
}
