#include<Wire.h>
void MPU6050_Init()
{
Wire.beginTransmission(0x68);
Wire.write(0x6B);
Wire.write(0);
 Wire.endTransmission(true);
}
void MPU6050_ReadData()
{
Wire.beginTransmission(0x68);
Wire.write(0x41);
Wire.requestFrom(0x68, 2, true);
Wire.endTransmission(true);
int val = Wire.read() << 8 | Wire.read(); 
double temp = (double) val / 340 + 34.53; 
Serial.println(temp);
}
void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(9600);
  MPU6050_Init();
}

void loop() {
  // put your main code here, to run repeatedly:
  MPU6050_ReadData();
  delay(500);
}
