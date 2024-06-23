
#include <FastLED.h>
#include <SoftwareSerial.h>
#include <EEPROM.h>
FASTLED_USING_NAMESPACE

#define DATA_PIN    5
//#define CLK_PIN   4
#define LED_TYPE    WS2812B
#define COLOR_ORDER RGB
#define NUM_LEDS    124
CRGB leds[NUM_LEDS];

#define BRIGHTNESS         255
#define FRAMES_PER_SECOND  30

String inputString = "";      // a String to hold incoming data
bool stringComplete = false;  // whether the string is complete

SoftwareSerial espSerial(2, 3); 
// rahnema!
const int input1Pin = 6;
const int input2Pin = 7;

const unsigned long debounceDelay = 50; // Debounce time in milliseconds
const int requiredStableReadings = 3; // Number of times the state must be stable

int lastStableState1 = HIGH; // Last stable state for inputPin
int lastState1 = HIGH; // Last stable state for inputPin
unsigned long lastDebounceTime1 = 0; // Last time the input signal toggled
int stableReadingsCount1 = 0; // Counter for stable readings
bool isSquareWave1 = false; // Flag to indicate if input is a square wave
unsigned long lastSquareTime1 = 0;

int lastStableState2 = HIGH; // Last stable state for inputPin
int lastState2 = HIGH; // Last stable state for inputPin
unsigned long lastDebounceTime2 = 0; // Last time the input signal toggled
int stableReadingsCount2 = 0; // Counter for stable readings
bool isSquareWave2 = false; // Flag to indicate if input is a square wave
unsigned long lastSquareTime2 = 0;


void setup() {  
  Serial.begin(2400);
  espSerial.begin(2400);
  FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);
  Serial.println("start");
  welcome2(96);
  inputString.reserve(400);
  //rainbow3point(96,0,0);
  pinMode(input1Pin, INPUT_PULLUP);
  pinMode(input2Pin, INPUT_PULLUP);
  FastLED.show();  
  FastLED.delay(1000/FRAMES_PER_SECOND);
  loadEEpRom();
  delay(2000);
  
}

  // List of patterns to cycle through.  Each is defined as a separate function below.
  typedef void (*SimplePatternList[])(int); // , int, uint8_t
  SimplePatternList gPatterns = { rainbow, rainbowWithGlitter, confetti, sinelon, juggle, bpm, gradient2color2,
      rahnema, gradient2color, moving3, rotate3point, rainbow3point, solid, beatcoin, loop2Point, loop1Point,
      loop1Point2, loop1Point2del, loop1Point3, loop2Point22, fillSmoth, zeus};
  const char* gPatternName[] = { "0rainbow", "1rainbowWithGlitter", "2confetti", "3sinelon", "4juggle", "5bpm", "6gradient2color2",
    "rahnema", "8gradient2color", "9moving3", "10rotate3point", "11rainbow3point" ,"12solid", "13beatcoin", "14loop2Point", "15loop1Point"
    ,"16loop1Point2" ,"17loop1Point2del", "18loop1Point3", "19loop2Point22", "20fillSmoth", "21zeus" };

    uint8_t gCurrentPatternNumber[] = {  0, 0 , 0 , 0 , 0 , 0, 0, 0 ,}; // Index number of which pattern is current
  	uint8_t gHue = 0; // rotating "base color" used by many of the patterns
  	uint8_t colors1[] = {0, 0, 0, 0, 160, 160, 160, 160,};
  	uint8_t sats1[] = {255, 255, 255, 255, 255, 255, 255, 255,};
  	uint8_t colors2[] = {255, 255, 255, 255, 255, 255, 255, 255,};
  	uint8_t sats2[] = {0, 0, 0, 0, 0, 0, 0, 0,};
  	uint8_t colors3[] = {0, 0, 0, 0, 0, 0, 0, 0,};
  	uint8_t startPoints[] = {0, 11, 24, 37, 49, 60, 73, 86,};
  	uint8_t lineLength[] = {11, 13, 13, 12, 11, 13, 13, 12,};
  	bool useGhue[] = {false, false, false, false, false, true, false, false, };

  	uint8_t lights1[] = {255, 255, 255, 255, 255, 255, 255, 255,};
  	uint8_t lights2[] = {255, 255, 255, 255, 255, 255, 255, 255,};


bool phase = false;
void loop()
{
  if( isSquareWave1 )  {
    rahnema4l2(2);
    rahnema4l1(1);
    rahnema4l2(3);
    rahnema4l0(0);
  }else{
    for(uint8_t i=0; i<4; i++){  
      gPatterns[gCurrentPatternNumber[i]](i);//(lineLength[i], startPoints[i], useGhue[i] ? gHue : colors1[i]);
      if (colors3[i] != 0){
        addGlitter(100, lineLength[i], startPoints[i],colors3[i], 255);\
        addGlitter(100, lineLength[i], startPoints[i],colors3[i], 255);\
        FastLED.delay(8);
      }
    }
  }
  if( isSquareWave2 )  {
    rahnema4l2(6);
    rahnema4l2(7);
    rahnema4l1(5);
    rahnema4l0(4);
  }else{
    for(uint8_t i=4; i<8; i++){  
      gPatterns[gCurrentPatternNumber[i]](i);//(lineLength[i], startPoints[i], useGhue[i] ? gHue : colors1[i]);
      if (colors3[i] != 0){
        addGlitter(100, lineLength[i], startPoints[i],colors3[i], 255);\
        addGlitter(100, lineLength[i], startPoints[i],colors3[i], 255);\
        FastLED.delay(8);
      }
    }
  }
 

  //gPatterns[gCurrentPatternNumber](13, 11);
  //gradient2color(11, 0);
  //moving3(13,11);
  FastLED.show();  
  FastLED.delay(1000/FRAMES_PER_SECOND);

  EVERY_N_MILLISECONDS( 15 ) { gHue+=4; } // slowly cycle the "base color" through the rainbow
  //EVERY_N_SECONDS( 15) { nextPattern(); } // change patterns periodically
  EVERY_N_SECONDS(3) {
    //  phase = !phase;
    //  if(phase){
    //   for(uint8_t i=0; i<4; i++) colors1[i] = 160;
    //   for(uint8_t i=4; i<8; i++) colors1[i] = 0;
    // }else{
    //   for(uint8_t i=0; i<4; i++) colors1[i] = 0;
    //   for(uint8_t i=4; i<8; i++) colors1[i] = 160;      
    //  }
  }

  EVERY_N_SECONDS(1){
   
    
  }
  if (stringComplete) {
    // Serial.print("inputString :\t");
    // Serial.println(inputString);
    // clear the string:
    parseData3(inputString);
    inputString = "";
    stringComplete = false;
    }
  if (espSerial.available()) {
        String data = espSerial.readStringUntil('\n');
        parseData3(data);
    }

    //rahnema
    checkRahnema();
}

#define ARRAY_SIZE(A) (sizeof(A) / sizeof((A)[0]))

void rainbow(int index) 
{
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, thisGhue3;
  if (useGhue[index]){
    thisGhue = gHue;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
  }
  // FastLED's built-in rainbow generator

  fill_rainbow( leds + startPoint, cnt, gHue, 7);
}

void rainbowWithGlitter(int index) 
{
  // built-in FastLED rainbow, plus some random sparkly glitter
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, thisGhue3;
  if (useGhue[index]){
    thisGhue = gHue;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
  }
  rainbow(index);
  addGlitter(10, cnt , startPoint , 0, 0);
}

void addGlitter( fract8 chanceOfGlitter,int cnt, int startPoint, uint8_t gcolor , uint8_t sat) 
{
  if( random8() < chanceOfGlitter) {
    leds[ random16(cnt) + startPoint ] += CHSV(gcolor, sat, 255);//CRGB::White;
  }
}

void confetti(int index) 
{
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, thisGhue3;
  if (useGhue[index]){
    thisGhue = gHue;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
  }
  
  // random colored speckles that blink in and fade smoothly
  fadeToBlackBy( leds+ startPoint, cnt, 10);
  int pos = random16(cnt);
  leds[pos + startPoint] += CHSV( gHue + random8(64), 200, 255);
}

void sinelon(int index)
{
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, thisGhue3;
  if (useGhue[index]){
    thisGhue = gHue;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
  }
  // a colored dot sweeping back and forth, with fading trails
  fadeToBlackBy( leds + startPoint, cnt, 20);
  int pos = beatsin16( 15, 0, cnt-1 );
  leds[pos + startPoint] += CHSV( thisGhue, 255, 192);
}

void bpm(int index)
{
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, thisGhue3;
  if (useGhue[index]){
    thisGhue = gHue;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
  }
  // colored stripes pulsing at a defined Beats-Per-Minute (BPM)
  uint8_t BeatsPerMinute = 30;
  CRGBPalette16 palette = PartyColors_p;
  uint8_t beat = beatsin8( BeatsPerMinute, 64, 255);
  for( int i = 0; i < cnt; i++) { //9948
    leds[i+startPoint] = ColorFromPalette(palette, gHue+(i*2), beat-gHue+(i*10));
  }
}

void juggle(int index) {
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, thisGhue3;
  if (useGhue[index]){
    thisGhue = gHue;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
  }
  // eight colored dots, weaving in and out of sync with each other
  fadeToBlackBy( leds + startPoint, cnt, 20);
  uint8_t dothue = 0;
  for( int i = 0; i < 8; i++) {
    leds[beatsin16( i+7, 0, cnt-1 )] |= CHSV(dothue, 200, 255);
    dothue += 32;
  }
}

void rahnema(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, thisGhue3;
  if (useGhue[index]){
    thisGhue = gHue;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
  }
  for( int i = 0; i < NUM_LEDS; i++) { //9948
    leds[i] =0x0 ;//ColorFromPalette(palette, gHue+(i*2), beat-gHue+(i*10));
  }
  FastLED.show();  
  FastLED.delay(35);
  for (int i=11;i<24;i++)
  leds[i] = 0xFF8C00;
  for (int i=0;i<11;i++)
    {
      leds[i] = 0xFF8C00;
      FastLED.show();  
      FastLED.delay(35); 
    }

  }


void welcome2(int index){
  // int cnt = lineLength[index], startPoint= startPoints[index];
  // uint8_t thisGhue, thisGhue2, thisGhue3;
  // if (useGhue[index]){
  //   thisGhue = gHue;
  // }else{
  //   thisGhue = colors1[index];
  //   thisGhue2 = colors2[index];
  // }
  // for( int i = 0; i < NUM_LEDS; i++) { //9948
  //   leds[i] =0x0 ;//ColorFromPalette(palette, gHue+(i*2), beat-gHue+(i*10));
  // }
  // FastLED.show();  
  // FastLED.delay(35);
  // int lineLoc= 0, lineEnd= 11, loopLoc= 0, loopEnd=13;
  // for (int i=0;i<6006;i++){
  //     bool isShow = false;
  //     if (i % 91 ==0 ){
  //       if(++lineLoc == lineEnd){
  //         lineEnd--;
  //         leds[lineEnd] = CRGB::White;
  //         leds[lineEnd+49] = CRGB::White;
  //         lineLoc=0;
  //       }
  //       if (lineLoc>0) {
  //         leds[lineLoc-1]=0x0;
  //         leds[49+lineLoc-1]=0x0;//8
  //       }
  //       leds[lineLoc] = CHSV(170,200,128);
  //       leds[49+lineLoc] = CHSV(170,200,128);//8
  //       isShow = true;
  //     }
  //     if (i % 66 ==0 ){
  //       if(++loopLoc == loopEnd){
  //         loopEnd--;
  //         leds[11+loopEnd] = CRGB::White;
  //         leds[24+loopEnd] = CRGB::White;
  //         leds[loopEnd+60] = CRGB::White;
  //         leds[loopEnd+73] = CRGB::White;
  //         loopLoc=0;
  //       }
  //       if (loopLoc>0) {
  //         leds[loopLoc+10]=0x0;
  //         leds[23+loopLoc]=0x0;//49
  //         leds[59+loopLoc]=0x0;//49
  //         leds[72+loopLoc]=0x0;//49
  //       }
  //       leds[loopLoc] = CRGB::White ;
  //       leds[24+loopLoc] = CRGB::White ;//49
  //       leds[11+loopLoc] = CRGB::White ;//49
  //       leds[73+loopLoc] = CRGB::White ;//49
  //       leds[60+loopLoc] = CRGB::White ;//49
  //       isShow = true;
  //     }
      
  //     if ( isShow)  FastLED.show();         
  //     if (i % 13 ==0) FastLED.delay(1);
  // } 
  // fill_solid(leds, 16, CRGB::White);
  // for(int j=0;j<2;j++)
  // {
  //   for(int k=0;k<8;k++)
  //   { 
  //     FastLED.setBrightness(BRIGHTNESS-k*33);
  //     FastLED.show();  
  //     FastLED.delay(15);
  //   }
    
  // FastLED.delay(100); 
  //   for(int k=7;k>=0;k--)
  //   { 
  //     FastLED.setBrightness(BRIGHTNESS-k*33);
  //     FastLED.show();  
  //     FastLED.delay(15);
  //   }
  // FastLED.delay(250);    
  // }
  
  // fill_solid(leds, 16, CRGB::White);
  // FastLED.show();
  for( int i = 0; i < NUM_LEDS; i++) { //9948
    leds[i] =0x0 ;//ColorFromPalette(palette, gHue+(i*2), beat-gHue+(i*10));
  }
  FastLED.show();  
  FastLED.delay(35);
  int lineLoc= 0, lineEnd= 11, loopLoc= 0, loopEnd=13;
  for (int i=0;i<6006;i++){
      bool isShow = false;
      if (i % 91 ==0 ){
        if(++lineLoc == lineEnd){
          lineEnd--;
          leds[lineEnd] = CRGB::White;
          leds[lineEnd+49] = CRGB::White;
          lineLoc=0;
        }
        if (lineLoc>0){
         leds[lineLoc-1]=0x0;
         leds[49+lineLoc-1]=0x0;
        }
        leds[lineLoc] = CRGB::Blue ;
        leds[lineLoc+49] = CRGB::Blue ;
        isShow = true;
      }
      if (i % 66 ==0 ){
        if(++loopLoc == loopEnd){
          loopEnd--;
          leds[11+loopEnd] = CRGB::White ;
          leds[24+loopEnd] = CRGB::White;
          leds[60+loopEnd] = CRGB::White ;
          leds[73+loopEnd] = CRGB::White;
          loopLoc=0;
        }
        if (loopLoc>0){
          leds[10+loopLoc]=0x0;
          leds[23+loopLoc]=0x0;
          leds[59+loopLoc]=0x0;
          leds[72+loopLoc]=0x0;
        }
        leds[11+loopLoc] = CRGB::Blue ;
        leds[24+loopLoc] = CRGB::Blue ;
        leds[60+loopLoc] = CRGB::Blue ;
        leds[73+loopLoc] = CRGB::Blue ;
        isShow = true;
      }
      if ( isShow)  FastLED.show();         
      if (i % 15 ==0) FastLED.delay(1);
  } 
  for( int i = 0; i < NUM_LEDS; i++) { //9948
    leds[i] =0xFFFFFF ;//ColorFromPalette(palette, gHue+(i*2), beat-gHue+(i*10));
  }

  for(int j=0;j<2;j++)
  {
    for(int k=0;k<8;k++)
    { 
      FastLED.setBrightness(BRIGHTNESS-k*30);
      FastLED.show();  
      FastLED.delay(15);
    }
    for(int k=7;k>=0;k--)
    { 
      FastLED.setBrightness(BRIGHTNESS-k*30);
      FastLED.show();  
      FastLED.delay(15);
    }
  }
}

void welcome(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, thisGhue3;
  if (useGhue[index]){
    thisGhue = gHue;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
  }
  for( int i = 0; i < NUM_LEDS; i++) { //9948
    leds[i] =0x0 ;//ColorFromPalette(palette, gHue+(i*2), beat-gHue+(i*10));
  }
  FastLED.show();  
  FastLED.delay(35);
  for (int i=0;i<11;i++)
  {
    for(int j=0;j<10-i;j++)
    {
      if (j>0) leds[j-1]=0x0;
      leds[j] = 0xFFaaFF;
      FastLED.show();  
      FastLED.delay(10);
    }
    leds[10-i]=0x0;
    leds[11-i] = 0xFFFFFF;
    FastLED.show();  
    FastLED.delay(10);
  }

  for (int i=11;i<18;i++)
    for(int j=0;j<18-i;j++)
    {
      if (j>0) {leds[10+j]=0x0;leds[24-j] =0x0;}
      leds[11+j] = 0xFFFFFF;
      leds[23-j] = 0xFFFFFF;
      FastLED.show();  
      FastLED.delay(20);
    } 

  for(int j=0;j<2;j++)
  {
    for(int k=0;k<8;k++)
    { 
      FastLED.setBrightness(BRIGHTNESS-k*30);
      FastLED.show();  
      FastLED.delay(15);
    }
    for(int k=7;k>=0;k--)
    { 
      FastLED.setBrightness(BRIGHTNESS-k*30);
      FastLED.show();  
      FastLED.delay(15);
    }
  }
  FastLED.delay(500);    
}

void gradient2color(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }
  //static char pos = 0;  
  int pos = beat8(45 ); 
  int i ;

  //pos = map(pos,0,255,0,cnt-1);
  pos = pos*cnt/255;
  for ( i = 0; i < cnt / 2; i++) {
    int index = (i + pos) % cnt;
    leds[index + startPoint] = CHSV(thisGhue, sat1,  max(light1-(i*42) , 0));//CRGB(0, 255 - (i * 42) , 0);  // Red gradient
  }

  for ( i = cnt / 2; i < cnt; i++) {
    int index = (i + pos) % cnt;
    leds[index + startPoint] = CHSV(thisGhue2, sat2, max(light2-((i-cnt/2)*42) , 0));//CRGB(255 - (i - cnt / 2) * 42, 0, 0 ); // Blue gradient
  }
  //pos = (++pos) % cnt; 

}

void moving2(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }
  static char pos1 = 0, pos2=cnt/2;  
  for (int i = 0; i < cnt; i++) {
    leds[i + startPoint] = CRGB(255 , 0, 0);//SOLID_COLOR;  // Set all LEDs to solid color
  }

  leds[pos1+ startPoint] = CRGB(0, 200, 40);  // Set first moving LED color
  leds[pos2+ startPoint] = CRGB(0, 200, 40);  // Set second moving LED color

  pos1++;  // Update first position (wrap around if needed)
  pos1 %= cnt;

  pos2--;  // Update second position (wrap around if needed)
  if (pos2 < 0) {
    pos2 = cnt - 1;
  }
}

void moving3(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }
  //static char pos1 = 0, pos2=1; 
  int pos1 = beatsin8( 60, 0, cnt-1 ); 
  int pos2 = pos1+1;
  if (pos2>=cnt) pos2 = cnt-1;
  for (int i = 0; i < cnt; i++) {
    leds[i + startPoint] = CHSV(thisGhue, sat1, light1);//CRGB(255 , 0, 0);//SOLID_COLOR;  // Set all LEDs to solid color
  }

  leds[pos1+ startPoint] = CHSV(thisGhue2, sat2, light2);//CRGB(0, 200, 40);  // Set first moving LED color
  leds[pos2+ startPoint] = CRGB(thisGhue2, sat2, light2);  // Set second moving LED color

}

void gradient2color2(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }
  CHSV color1 = CHSV(thisGhue, 255, 255);  // Red (hue: 0, saturation: 255, value: 255)
  CHSV color2 = CHSV((thisGhue+170)%256, 255, 255); // Blue (hue: 240, saturation: 255, value: 255)

  // Calculate the step size for hue (adjust for smoother transitions if needed)
  int sat_step = 400/(cnt);//(color2.hue - color1.hue) / (NUM_LEDS - 1); 320

  int sat=0;
  for (int i = 0; i <= cnt/2; i++) {
    leds[i+startPoint] = CHSV(thisGhue, sat1, 255- (2.*i*sat_step/3));
    leds[cnt + startPoint - i -1] = CHSV(thisGhue2, sat1, 255 - (2.*i*sat_step/3));
    if (sat1<sat_step) sat1=0;
    else sat1 -= sat_step;//sat = color1.sat -  i * sat_step;
  }
  
}

void rotate3point(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }
  int pos = beat8(30 ); 
  int i ;

  pos = map(pos,0,255,0,3);
  for ( i = 0; i < cnt; i++) {
    int index = (i + pos) % 4;

    leds[i + startPoint] = index<2 ? CHSV(thisGhue, sat1, light1) : CHSV( thisGhue2, sat2, light2);//CRGB(0, 255 - (i * 32) , 0);  // Red gradient
  }

}


void rainbow3point(int index){
    int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }
  //fadeToBlackBy( leds + startPoint, cnt, 85);
  fill_solid(leds + startPoint, cnt, CRGB::Black);
  
  int pos = beat8(1); 
  for (int i = 0; i < cnt +4; i=i+4) {
    int col = ((pos+i)/4*45)%255;
    int index = i + startPoint + 3 - pos % 4;
    if (index< startPoint+ cnt) leds[index] = CHSV(col, 255, 255);    
    if (index>startPoint && index< startPoint+ cnt+1 ) leds[index-1] = CHSV(col, 255, 255);
  }
}

void solid(int index){
    int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }
  fill_solid(leds + startPoint, cnt, CHSV(thisGhue,sat1, light1));
}


void beatcoin(int index)
{
    int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }
  // a colored dot sweeping back and forth, with fading trails
  fadeToBlackBy( leds + startPoint, cnt, 20);
  int pos = beat8(30); //beatsin16( 15, 0, cnt-1 );
  if (pos == 255) pos = 254;
  pos = pos*(cnt)/255;//map(pos,0,255,0,cnt-1);
  leds[pos + startPoint] += CHSV( thisGhue, sat1, light1);
}


void loop2Point(int index){
    int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }

  fill_solid(leds + startPoint, cnt, CHSV(thisGhue2,sat2,light2));
  
  int pos = beat8(2); 
  for (int i = 0; i < cnt +4; i=i+4) {
    int index = i + startPoint + 3 - pos % 4;
    if (index< startPoint+ cnt) leds[index] = CHSV(thisGhue,sat1, light2);
    if (index>startPoint && index< startPoint+ cnt+1 ) leds[index-1] = CHSV(thisGhue, sat1, light2);
  }
}

void loop2Point22(int index){
    int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }

  fill_solid(leds + startPoint, cnt, CHSV(thisGhue2,sat2, light2));
  
  int pos = beat8(2); 
  for (int i = 0; i < cnt +4; i=i+4) {
    int index = i + startPoint + 3 - pos % 4;
    if (index< startPoint+ cnt) leds[index] = CHSV(thisGhue,sat1, light1);
    if (index>startPoint && index< startPoint+ cnt+1 ) leds[index-1] = CHSV(thisGhue, sat1, light1);
  }
}


void loop1Point(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+160)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }

  fill_solid(leds + startPoint, cnt, CRGB::Black);
  
  int pos = beat8(2); 
  for (int i = 0; i < cnt +4; i=i+4) {
    int index = i + startPoint +  pos % 4;
    if (index< startPoint+ cnt) leds[index] = CHSV(thisGhue,sat1,light1);
  }
}


void loop1Point3(int index){
    int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }

  fill_solid(leds + startPoint, cnt, CRGB::Black);
  
  int pos = beat8(2); 
  for (int i = 0; i < cnt +3; i=i+3) {
    int col = ((pos+i)*45)%255;
    int index = i + startPoint +  pos % 3;
    if (index< startPoint+ cnt) leds[index] = CHSV(col,sat1, light1);
  }
}

void loop1Point2(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }

  int pos = beat8(2); 
  if (pos % 4 ==0 ) fill_solid(leds + startPoint, cnt,  CHSV(thisGhue,sat1, light1));
  else fill_solid(leds + startPoint, cnt, CRGB::Black);

}

void loop1Point2del(int index){
    int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }

  int pos = beat8(2); 
  if (pos % 4 ==1 ) fill_solid(leds + startPoint, cnt,  CHSV(thisGhue,sat1, light1));
  else fill_solid(leds + startPoint, cnt, CRGB::Black);

}


void fillSmoth(int index){
  int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }
  fill_solid(leds + startPoint, cnt,  CHSV(thisGhue2, sat2, light2));
  int pos = beat8(60); 
  pos = pos * (cnt+1) / 255;
  fill_solid(leds + startPoint, pos,  CHSV(thisGhue,sat1, light1));

}


void zeus(int index){
  static bool zeusShow = false;
  static uint8_t zeusCnt = 0;
    int cnt = lineLength[index], startPoint= startPoints[index];
  uint8_t thisGhue, thisGhue2, sat1, sat2, light1, light2;
  if (useGhue[index]){
    thisGhue = gHue;
    thisGhue2 = (gHue+80)%255;
    sat1 = 255;
    sat2 = 255;
    light1 = 255;
    light2 = 255;
  }else{
    thisGhue = colors1[index];
    thisGhue2 = colors2[index];
    sat1 = sats1[index];
    sat2 = sats2[index];
    light1 = lights1[index];
    light2 = lights2[index];
  }

    
    fill_solid(leds + startPoint, cnt, CHSV(thisGhue2, sat2, light2));
    int pos = beat8(60);
    if ((pos <= 10) || ( pos >35 && pos <45) || (pos>70 && pos< 80)) fill_solid(leds + startPoint, cnt, CHSV(thisGhue, sat1, light1));
    //(pos<=5) ? fill_solid(leds + startPoint, cnt, CRGB::White) : fill_solid(leds + startPoint, cnt, CRGB::Black);
  
}

  void patternFull(){
    static char pos = 0;  
    char numLeds = 13;
    CHSV color1 = CHSV(50, 255, 255); 
    
    // Initialize all LEDs to color1
    if (pos ==0 ) fill_solid(leds, numLeds, color1);    
    if(pos < (numLeds-1)*5) ++pos;
    //else if(pos == numLeds-1) pos = 0;//if (reapetMode)

    // Iterate through each LED position, starting from the end
    if (pos%5==0) leds[pos] = gHue;  // Set the current LED to color2
  }

  void patternFullRep(){
    static char pos = 0;  
    char numLeds = 13;
    CHSV color1 = CHSV(50, 255, 255); 
    
    // Initialize all LEDs to color1
    if (pos ==0 ) fill_solid(leds, numLeds, color1);    
    if(pos < (numLeds-1)*5) ++pos;
    else if(pos == (numLeds-1*5)) pos = 0;//if (reapetMode)

    // Iterate through each LED position, starting from the end
    if (pos%5==0) leds[pos] = gHue;  // Set the current LED to color2
  }

  void patternRot(){
    fadeToBlackBy( leds, NUM_LEDS/2, 20);
    fadeToBlackBy( leds+ NUM_LEDS/2, NUM_LEDS/2, 20);
    uint8_t dothue = 0;
    for( int i = 0; i < 8; i++) {
      leds[beatsin16( i+7, 0, (NUM_LEDS-1)/2 )] |= gHue;
      leds[beatsin16( i+7, (NUM_LEDS-1)/2, NUM_LEDS-1 )] |= gHue;
    }
  }


  void nextPattern()
  {
    // add one to the current pattern number, and wrap around at the end
    // gCurrentPatternNumber = (gCurrentPatternNumber + 1) % ARRAY_SIZE( gPatterns);
  }

  void prevPattern()
  {
    // add one to the current pattern number, and wrap around at the end
    // gCurrentPatternNumber = (gCurrentPatternNumber - 1) % ARRAY_SIZE( gPatterns);
  }

  void seyid(){
  }

  ////Serial
  void serialEvent() {
    while (Serial.available()) {
      // get the new byte:
      char inChar = (char)Serial.read();
      // add it to the inputString:
      inputString += inChar;
      // if the incoming character is a newline, set a flag so the main loop can
      // do something about it:
      if (inChar == '\n') {
        stringComplete = true;
      }
     
    }
  }

  void parseData3(const String& data) {    
    //Serial.println(data.length());
    // String newData = data;//.substring(data.length()-64)
    // Serial.println(newData.length());
    //Serial.println();
    Serial.println(data);
    // Serial.println();
    // int ii =  newData.indexOf(" ");;
    //Serial.println(data);
    // delay(10);
    // for (int i=0; i<8; i++){
    //   Serial.println(i);
    //   delay(50);
    //   if(newData[i*8 +ii] > 128){
    //     useGhue[i]= true;
    //     gCurrentPatternNumber[i] = (newData[i*8+ii] - 128) % ARRAY_SIZE( gPatterns);
    //   }else{
    //     useGhue[i]= false;
    //     gCurrentPatternNumber[i] = (newData[i*8+ii]) % ARRAY_SIZE( gPatterns);
    //   }
    //   Serial.print(gCurrentPatternNumber[i]);
    //   Serial.print(" - ");
    //   delay(50);
    //   colors1[i]= newData[i*8+1+ii];
    //   Serial.print(colors1[i]);
    //   Serial.print(" - ");
    //   delay(50);
    //   sats1[i]  = newData[i*8+2+ii];
    //   Serial.print(sats1[i]);
    //   Serial.print(" - ");
    //   delay(50);
    //   lights1[i]= newData[i*8+3+ii];
    //   Serial.print(lights1[i]);
    //   Serial.print(" - ");
    //   delay(50);
    //   colors2[i]= newData[i*8+4+ii];
    //   Serial.print(colors2[i]);
    //   Serial.print(" - ");
    //   delay(50);
    //   sats2[i]  = newData[i*8+5+ii];
    //   Serial.print(sats2[i] );
    //   Serial.print(" - ");
    //   delay(50);
    //   lights2[i]= newData[i*8+6+ii]; 
    //   Serial.print(lights2[i]);
    //   Serial.print(" - ");
    //   delay(50);     
    //   colors3[i]= newData[i*8+7+ii];
    //   Serial.println(colors3[i]);
    //   Serial.print(" - ");
    //   delay(50);
    // }

    // Serial.println("done!");
    // delay(50);
    for(int i=0; i<8;i++){
      int gh = data.substring(i*25, i*25+1).toInt();
      int pt = data.substring(i*25+1, i*25+4).toInt();
      int mt = data.substring(i*25+4, i*25+7).toInt();
      int st1 = data.substring(i*25+7, i*25+10).toInt();
      int lt1 = data.substring(i*25+10, i*25+13).toInt();
      int mt2 = data.substring(i*25+13, i*25+16).toInt();
      int st2 = data.substring(i*25+16, i*25+19).toInt();
      int lt2 = data.substring(i*25+19, i*25+22).toInt();
      int mt3 = data.substring(i*25+22, i*25+25).toInt();

      // Serial.print(gh);
      // Serial.print(" ");
      // Serial.print(pt);
      // Serial.print(" ");
      // Serial.print(mt);
      // Serial.print(" ");
      // Serial.print(st1);
      // Serial.print(" ");
      // Serial.print(lt1);
      // Serial.print(" ");
      // Serial.print(mt2);
      // Serial.print(" ");
      // Serial.print(st2);
      // Serial.print(" ");
      // Serial.print(lt2);
      // Serial.print(" ");
      // Serial.print(mt3);
      // Serial.println(" ");

      useGhue[i]= gh==1;

      colors1[i]= mt;
      colors2[i]= mt2;
      colors3[i]= mt3;

      sats1[i] = st1;
      sats2[i] = st2;

      lights1[i] = lt1;
      lights2[i] = lt2;
      gCurrentPatternNumber[i] = pt;

      // Serial.print(useGhue[i]);
      // Serial.print(" ");
      // Serial.print(gCurrentPatternNumber[i]);
      // Serial.print(" ");
      // Serial.print(colors1[i]);
      // Serial.print(" ");
      // Serial.print(sats1[i]);
      // Serial.print(" ");
      // Serial.print(lights1[i]);
      // Serial.print(" ");
      // Serial.print(colors2[i]);
      // Serial.print(" ");
      // Serial.print(sats2[i]);
      // Serial.print(" ");
      // Serial.print(lights2[i]);
      // Serial.print(" ");
      // Serial.print(colors3[i]);
      // Serial.println(" ");
      saveEEpRop();

    }
      
  } 

  void parseData2(const String& data) {
    Serial.println("done!");
    int lValue = getValue(data, "l") %8;
    int pValue = getValue(data, "p") % 22;
    int cValue = getValue(data, "c") % 256;
    int c2Value = getValue(data, "ct") % 256 ;
    int c3Value = getValue(data, "cth") %256;
    int gValue = getValue(data, "g")%2;
    if (lValue >= 0) {
      if (cValue >=0) colors1[lValue] = cValue;
      if (c2Value >=0) colors2[lValue] = c2Value;
      if (pValue >=0) gCurrentPatternNumber[lValue] = pValue;
      if (c3Value >=0) colors2[lValue] = c3Value;
      if (gValue >=0) useGhue[lValue] = gValue==1;
      saveEEpRop();
    }
    Serial.println(data);
    Serial.print(lValue);
    Serial.print(" ");
    Serial.print(cValue);
    Serial.print(" ");
    Serial.print(c2Value);
    Serial.print(" ");
    Serial.print(c3Value);
    Serial.print(" ");
    Serial.print(pValue);
    Serial.print(" ");
    Serial.println(gValue);
    // Parse other values similarly...
  }

  int getValue(const String& data, const String& key) {
  int index = data.indexOf(key);
  if (index != -1) {
    index += key.length(); // Move past the key
    int endIndex = data.length(); // Assume end of string by default
    for (int i = index; i < data.length(); i++) {
      // Check if the next character is not a digit, then it's the end of the value
      if (!isDigit(data[i]) && data[i] != '.') {
        endIndex = i;
        break;
      }
    }
    return data.substring(index, endIndex).toInt();
  }
  return -1; // or a suitable error value
}

void checkRahnema(){
  int reading1 = digitalRead(input1Pin);
  int reading2 = digitalRead(input2Pin);

  // Debounce for input 1
  if (reading1 != lastState1) {
    lastDebounceTime1 = millis();
    stableReadingsCount1 = 0;
    lastState1 = reading1;
  } else if ((millis() - lastDebounceTime1) > debounceDelay) {
    if (stableReadingsCount1 >= requiredStableReadings) {
      if (isSquareWave1){
        if(reading1) { // rahnema off!
          if(stableReadingsCount1 == requiredStableReadings){
            stableReadingsCount1++;
            lastSquareTime1 = millis();
          }
          if (millis()- lastSquareTime1 > 1500){
            isSquareWave1 = false;
          }
        }
      }else{
        if(!reading1){
          isSquareWave1 = true;
        }
      }
      
    }else{
      stableReadingsCount1++;       
    }
    lastDebounceTime1 = millis();
  }

  

  if (reading2 != lastState2) {
    lastDebounceTime2 = millis();
    stableReadingsCount2 = 0;
    lastState2 = reading2;
  } else if ((millis() - lastDebounceTime2) > debounceDelay) {
    if (stableReadingsCount2 >= requiredStableReadings) {
      if (isSquareWave2){
        if(reading2) { // rahnema off!
          if(stableReadingsCount2 == requiredStableReadings){
            stableReadingsCount2++;
            lastSquareTime2 = millis();
          }
          if (millis()- lastSquareTime2 > 1500){
            isSquareWave2 = false;
          }
        }
      }else{
        if(!reading2){
          isSquareWave2 = true;
        }
      }
      
    }else{
      stableReadingsCount2++;       
    }
    lastDebounceTime2 = millis();
    }  
  // Debounce for input 2 (similar to input 1 with separate variables)
  

}

void rahnema4l2(int index){  
  int startPoint= startPoints[index];
  int pos = beat8(1); 
  int cnt = lineLength[index];
  if (pos % 4 ==3 ) fill_solid(leds + startPoint, cnt,  CHSV(20,255, 255));
  else fill_solid(leds + startPoint, cnt, CRGB::Black);
}

void rahnema4l1(int index){
  int startPoint= startPoints[index];
  int pos = beat8(1); 
  int cnt = lineLength[index];
  if (pos % 4 ==0 ) fill_solid(leds + startPoint, cnt,  CHSV(20,255, 255));
  else fill_solid(leds + startPoint, cnt, CRGB::Black);
}

void rahnema4l0(int index){
  int startPoint= startPoints[index];
  int cnt = lineLength[index];
  int pos = beat8(60); 
  fill_solid(leds + startPoint, cnt,  CHSV(0, 0, 0));
  pos = pos * (cnt+1) / 255;
  fill_solid(leds + startPoint, pos,  CHSV(20,255, 255));
}

int address = 10;

void loadEEpRom()
{
  uint8_t value = EEPROM.read(address);
  if (value ==13){
    readEEpRom();
  }else{
    saveEEpRop();
  }
}

void readEEpRom(){
  address =11;
  for (int i=0;i<8 ; i++){
    gCurrentPatternNumber[i] = EEPROM.read(address++);
    colors1[i] = EEPROM.read(address++);
    sats1[i] = EEPROM.read(address++);
    colors2[i] = EEPROM.read(address++);
    sats2[i] = EEPROM.read(address++);
    colors3[i] = EEPROM.read(address++);
    startPoints[i] = EEPROM.read(address++);
    lineLength[i] = EEPROM.read(address++);
    useGhue[i] = EEPROM.read(address++);
  }
}

void saveEEpRop(){
  address =11;
  EEPROM.update(10, 13);
  for (int i=0;i<8 ; i++){
    EEPROM.update(address++, gCurrentPatternNumber[i]);
    EEPROM.update(address++, colors1[i]);
    EEPROM.update(address++, sats1[i]);
    EEPROM.update(address++, colors2[i]);
    EEPROM.update(address++, sats2[i]);
    EEPROM.update(address++, colors3[i]);
    EEPROM.update(address++, startPoints[i]);
    EEPROM.update(address++, lineLength[i]);
    EEPROM.update(address++, useGhue[i]);
  }
}
