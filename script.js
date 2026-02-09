var keys=[]; //stores keypad buttons  class=keypad
var buttons=[];  //stores control buttons, edit buttons  class=control
var xlocs=[0,50,100,0,50,100,0,50,100,0,150,150,50,100,150,150,200,200,200,200,250,250,250,250];
var ylocs=[0,0,0,50,50,50,100,100,100,150,0,50,150,150,150,100,0,50,100,150,0,50,100,150];
var names=["f(x)","g(x)","h(x)","k(x)","c(x)", "p(x)"];
var polarnames=["r(𝜽)","r(𝜽)","r(𝜽)","r(𝜽)","r(𝜽)","r(𝜽)"];
var theta = "𝜽";
var cols=[[0,20,90],[40,100,50],[160,5,25],[220,110,25],[110,50,190]];
var functions=[];  //display output
var preserves=[]; 
var testers=[];
var typing=true;
var editing=false;
var index=0;
var mode=1; //1=function ... 4 sequence

var polars=[];
var polarpreserves=[];
var polartesters=[];
var g;
var display="";
var express=[];
var xdisplay;
var ydisplay;
var fcol=[150,65,65];
var pocol=[85,85,140];
var pacol=[95,140,95];
var outline=[0,20,90];
var currentcol;
var xmin=ymin=-10;
var xmax=ymax=10;


function setup(){
  createCanvas(1050,670);
  currentcol=fcol;
 for(nums=0;nums<10;nums++){
   keys.push(new keypad(xlocs[nums],ylocs[nums],45,45,(nums+1)%10));  //change all of this to make it 
 }                                                                    //same locations as TI84
keys.push(new keypad(xlocs[10],ylocs[10],45,45,"+"));  
keys.push(new keypad(xlocs[11],ylocs[11],45,45,"-"));  
keys.push(new keypad(xlocs[12],ylocs[12],45,45,"."));
keys.push(new keypad(xlocs[13],ylocs[13],45,45,"("));
keys.push(new keypad(xlocs[14],ylocs[14],45,45,")"));
keys.push(new keypad(xlocs[15],ylocs[15],45,45,"/"));
keys.push(new keypad(xlocs[16],ylocs[16],45,45,"radical"));
keys.push(new keypad(xlocs[17],ylocs[17],45,45,"sin"));
keys.push(new keypad(xlocs[18],ylocs[18],45,45,"cos"));
keys.push(new keypad(xlocs[19],ylocs[19],45,45,"tan"));
keys.push(new keypad(xlocs[20],ylocs[20],45,45,"clear"));
keys.push(new keypad(xlocs[21],ylocs[21],45,45,"x"));
keys.push(new keypad(xlocs[22],ylocs[22],45,45,"^"));
keys.push(new keypad(xlocs[23],ylocs[23],45,45,"ENTER"));

  buttons.push(new control(660,10,85,40,"Function"));
  buttons.push(new control(755,10,85,40,"Polar"));
  buttons.push(new control(850,10,85,40,"Parametric"));
  buttons.push(new control(945,10,85,40,"Sequence"));
  for(var g=0;g<6;g++){
      buttons.push(new control(950,105+70*g,60,30,"Edit"));
  }
  for(var h=0;h<5;h++){
    buttons.push(new control(660,90+70*h,60,40,"+"));
  }
  
  clearScreen();
}

function clearScreen(){
  background(currentcol);
  fill(230);
  rect(15,15,630,630);
  buttons[0].showit();
  buttons[1].showit();
  buttons[2].showit();
  buttons[3].showit();
  if(mode===1){ fgrid(); }
  else if(mode===2){ pogrid(); }
  else if(mode===3){pagrid();}
  else{  }
}

function checkexpress(arr){
  var open=0;
  var closed=0;
  for(var g=0; g<arr.length; g++){
    if(arr[g]==="("){open++;}
    if(arr[g]===")"){closed++;}
  }
  if(open===closed){return arr;}
  else{
    var diff=open-closed;
    for(var h=0;h<diff;h++){
      arr.push(")");
    }
    return arr;
  }
}

function showKeys(x,y){
  var getindex=(y-150)/70;
  fill(140);
  stroke(outline);
  rect(x-5,y-5,305,213,5);
  noStroke();
  for (var a=0;a<keys.length;a++){
    keys[a].x=xlocs[a]+x;
    keys[a].y=ylocs[a]+y;
    keys[a].showit();
  }
  fill(255);
  stroke(outline);
  strokeWeight(2);
  rect(x-5,y-50,305,45,5);
  xdisplay=x;
  ydisplay=y;
  noStroke();
  
  rect(xdisplay-5,ydisplay-50,305,45,5);
  fill(cols[getindex]);
  noStroke();
  textSize(24);
  text(display,xdisplay,ydisplay-20);
}

function fgrid(){
  var thisheight;
  if(functions.length===0){typing=true;}
  if(functions.length===0||typing){thisheight=70*(functions.length);}
  else{thisheight=70*(functions.length-1);}
  stroke(fcol);     //left grid
  line(15,330,645,330);
  line(330,15,330,645);
  
  fill(198);   //right panel
  stroke(outline);
  line(660,48,660,66);
  line(745,48,745,66);
  rect(660,66,370,80+thisheight);
  noStroke();
  rect(661,48,83,20);
  
  fill(outline);    //output display
  textSize(24);
  if(functions.length==0){text("f(x) = "+display,665,127);}
  else{
    for(var b=0;b<functions.length;b++){
      fill(cols[b]);
      textSize(24);
      text(names[b]+" = "+functions[b],665,127+70*b);
      buttons[b+4].there=true;
      buttons[b+4].showit();
    }
    
  }
if(typing){
    textSize(24);
    fill(cols[index]);
    console.log(cols[index]);

    text(names[index]+" = ",665,127+70*index);
    showKeys(725,150+70*index);
    for(var a=4;a<9;a++){
      buttons[a].there=false;
    }
  }
else{
    buttons[functions.length+10].there=true;
    buttons[functions.length+10].showit();
  }
  fgraphit();
}
//focus on setting index when switching between modes
function pogrid(){
  var thisheight;
  if(polars.length===0){typing=true;}
  if(polars.length===0||typing){thisheight=70*(polars.length);}
  else{thisheight=70*(polars.length-1);}
  
  stroke(pocol);   //left grid
  strokeWeight(1);
  fill(230);
  for(var n=10;n>0;n--){
      ellipse(330,330,60*n,60*n);
  }
  line(15,330,645,330);
  line(330,15,330,645);
  
  
  fill(198);   //right panel
  stroke(outline);
  line(755,48,755,66);
  line(840,48,840,66);
  rect(660,66,370,80+thisheight);
  noStroke();
  rect(756,48,83,20);
  
  fill(outline);    //output display
  textSize(24);
  if(polars.length===0){text("r(𝜽) = "+display,665,127);}
  else{
    for(var b=0;b<polars.length;b++){
      fill(cols[b]);
      textSize(24);
      text(polarnames[b]+" = "+polars[b],665,127+70*b);
      buttons[b+4].there=true;
      buttons[b+4].showit();
    }
}
  if(typing){
    textSize(24);
    fill(cols[index]);
    text(polarnames[index]+" = ",665,127+70*index);
    showKeys(725,150+70*index);
    for(var a=4;a<9;a++){
      buttons[a].there=false;
    }
  }
else{
    buttons[polars.length+10].there=true;
    buttons[polars.length+10].showit();
  }
pographit();
}

function pagrid(){
  stroke(pacol);
  line(15,330,645,330);
  line(330,15,330,645);
   
  fill(198);   //right panel
  stroke(outline);
  line(850,48,850,66);
  line(935,48,935,66);
  rect(660,66,370,340);
  noStroke();
  rect(851,48,83,20);
}



function fgraphit(){  
  var x,x2,x1,y1,y,y2;
  for(var i=0;i<functions.length;i++){
    if(testers[i].length>0){
      stroke(cols[i]);
      x=xmin;
      g=fixexpress(testers[i]); 
      y=eval(testers[i].join(''));
      x1=map(x,xmin,xmax,15,646);
      y1=map(y,ymin,ymax,646,15);
      for(var n=16;n<646;n++){
        x=map(n,15,646,xmin,xmax);
        y=eval(testers[i].join(''));
        x2=map(x,xmin,xmax,15,646);
        y2=map(y,ymin,ymax,646,15);
        line(x1,y1,x2,y2);
        x1=x2;y1=y2;
      }
    }
  }
}

function pographit(){
   var x,x2,x1,y1,y,y2;
    var thetamin=0;  //variables later
    var thetamax=2*Math.PI-.01;
    var thetastep=.01;
  
  for(var i=0;i<polars.length;i++){
    stroke(cols[i]);
    y=eval(polartesters[i].join(''));
    x1=map(y*cos(thetamin),xmin,xmax,15,646);
    y1=map(y*sin(thetamin),ymin,ymax,646,15);
    for(var n=thetamin+thetastep;n<thetamax;n+=thetastep){
      x=n
      y=eval(polartesters[i].join(''));
      x2=map(y*cos(x),xmin,xmax,15,646);
      y2=map(y*sin(x),ymin,ymax,646,15);
      line(x1,y1,x2,y2);
      x1=x2;y1=y2;   
    }
  }
}

function touchStarted(){
     for(var n=0;n<buttons.length;n++){
      buttons[n].tapit();
    }
  if(typing){
    for(var h=0;h<keys.length;h++){
      keys[h].tapit();
    }
  }
  return false;
  }

function keyPressed() {
  
  }
function fixexpress(incoming){
  var opened=0;
  var closed=0;
  var construct = [];
  for(var n=0;n<incoming.length;n++){
    
    
    //num, +, -, ., /
    if(incoming[n]>-1||incoming[n]==="+"||incoming[n]==="-"||incoming[n]==="."||incoming[n]==="/"){
        construct.push(incoming[n]);
        }
    
    //sin cos tan that follows a coeff
    else if(incoming[n]==="sin"||incoming[n]==="cos"||incoming[n]==="tan"){
        if(incoming[n-1]>-1||incoming[n-1]===")"||incoming[n-1]==="x"){
          construct.push("*",incoming[n]);
        }
        else{construct.push(incoming[n]);}
      }
    
    else if(incoming[n]===")"){
      closed++;
      construct.push(")")
    }
    
    else if(incoming[n]==="("){
        opened++;
        if(construct.length===0||incoming[n-1]==="sin"||incoming[n-1]==="cos"||incoming[n-1]==="tan"||incoming[n-1]==="+"||incoming[n-1]==="-"||incoming[n-1]==="/"){
          construct.push(incoming[n]);
        }
        else{
          construct.push("*",incoming[n]);
        }  
      }
    
    //the independent variable
    else if(incoming[n]==="x"||incoming[n]===theta){
      if(incoming[n-1]>-1||incoming[n-1]===")"){
        construct.push("*");    //i could clean up some previous code with this style
      }
         construct.push("x");
    }
    
    else{construct.push(incoming[n]);}   //think of more later
    
    if(opened>closed&&n===incoming.length-1){
      console.log(construct);
      var diff=opened-closed;
      for(var a=0;a<diff;a++){
        construct.push(")")
      }
    }
  }
  return construct;
}

class keypad {
  constructor(x,y,w,h,op){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.op=op;
  }
  
  showit(){
    fill(198);
    rect(this.x,this.y,this.w,this.h);
    fill(outline);
    if(this.op==="radical"){
      strokeWeight(3);
      stroke(outline);
      line(this.x+11,this.y+24,this.x+16,this.y+29);
      line(this.x+16,this.y+29,this.x+20,this.y+13);
      line(this.x+20,this.y+13,this.x+28,this.y+13);
      noStroke();           
    }
    else if(this.op==="sin"||this.op==="cos"||this.op==="tan"){
      textSize(20);
      text(this.op,this.x+8,this.y+30);
    }
    else if(this.op==="clear"){
      textSize(16);
      text(this.op,this.x+5,this.y+28);      
    }
    else if(this.op==="ENTER"){
      textSize(12);
      text(this.op,this.x+2,this.y+28); 
    }
    else if(this.op==="x"&&mode===2){
      textSize(25);
      text(theta,this.x+14,this.y+31);
    }
    else{
    textSize(25);
    text(this.op,this.x+17,this.y+31);
    }
  }
  //i have to revamp and find a way to show as you type
  //but then change expression upon enter

  
  
  
  tapit(){
    if(mouseX>this.x&&mouseX<this.x+45&&mouseY>this.y&&mouseY<this.y+45){
      
      //insert if for num
     //fix updated way to display and checkexpress
      
      if(this.op==="clear"){
        display="";
        express=[];
      }
      
      else if(this.op>-1||this.op==="."||this.op==="+"||this.op==="-"||this.op==="/"||this.op==="("||this.op===")"){
        display+=this.op;
        express.push(this.op);
      }
      else if(this.op==="sin"||this.op==="cos"||this.op==="tan"){
        display+=this.op+"(";
        console.log(display);
        express.push(this.op,"(");
      }
      else if(this.op==="x"){
        if(mode===2){display+=theta;express.push(theta);}
        else{display+="x";express.push("x")}
      }
      
      else if(this.op==="ENTER"&&mode===1){
        var getindex=(this.y-300)/70;
        if(editing==false){
          var theone = fixexpress(express);
          preserves.push(express);
          functions.push(display);
          testers.push(theone);
        }
        else{
          functions[getindex]=display;
          testers[getindex]=fixexpress(express);
          preserves[getindex]=express;
        }
        buttons[getindex+10].there=true;
        for(var a=4;a<4+functions.length;a++){
          buttons[a].there=true;
        }
        display="";
        express=[];
        typing=false;
        editing=false;
        clearScreen();
      }
      
      else if(this.op==="ENTER"&&mode===2){    //havent updated yet
        var getindex=(this.y-300)/70;
        if(editing==false){
          polars.push(display);
          polartesters.push(fixexpress(express));
          polarpreserves.push(express);
        }
        else{
          polars[getindex]=display;
          polartesters[getindex]=fixexpress(express);
          polarpreserves[getindex]=express;
        }
        buttons[getindex+10].there=true;
        for(var a=4;a<4+functions.length;a++){
          buttons[a].there=true;
        }
        typing=false;
        editing=false;
        clearScreen();
      }
      
      if(typing){
        fill(255);
        stroke(outline);
        rect(xdisplay-5,ydisplay-50,305,45,5);
        fill(cols[index]);
        noStroke();
        textSize(22);
        text(display,xdisplay,ydisplay-20);
      }
      
      
      
  }
  
  
}
}

class control{
  constructor(x,y,w,h,op){
    if(op==="Edit"||op==="+"){this.there=false;}
    else{this.there=true;}
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.op=op;
    this.ybuf=0;
    if(this.op==="Function"){this.buf=8;this.col=fcol;this.mode=1;}
    else if(this.op==="Polar"){this.buf=19;this.col=pocol;this.mode=2;}
    else if(this.op==="Parametric"){this.buf=4;this.col=pacol;this.mode=3;}
    else if(this.op==="Edit"){this.buf=13;this.col=outline;}
    else if(this.op==="+"){this.buf=20;this.ybuf=6;this.col=outline;}
    else{this.buf=0;this.col=255;this.mode=4;}
  }
  
  showit(){
    if(this.there){
    fill(198);
    strokeWeight(2);
    stroke(outline);
    if(this.op==="Edit"||this.op==="+"){rect(this.x,this.y,this.w,this.h,3);}
    else{rect(this.x,this.y,this.w,this.h);}
    fill(255);
    if(this.op==="Parametric"||this.op==="Sequence"){textSize(16);}
    else if(this.op==="+"){textSize(33);}
    else{textSize(18);}
    noStroke();
    fill(this.col);
    text(this.op,this.x+this.buf,this.y+23+this.ybuf);
    }
  }
  
  tapit(){
    var getindex;
    if(mouseX>this.x&&mouseX<this.x+this.w&&mouseY>this.y&&mouseY<this.y+this.h&&this.there){
      if(this.op==="Edit"&&mode===1){
        editing=true;
        index=getindex=(this.y-105)/70;
        typing=true;
        showKeys(725,150+getindex*70);
        for(var g=4;g<9;g++){
          buttons[g].there=false;
        }
        display=functions[getindex];
        express=preserves[getindex];  
        clearScreen();

      }
      
      else if(this.op==="Edit"&&mode===2){
        editing=true;
        index=getindex=(this.y-105)/70;
        typing=true;
        showKeys(725,150+getindex*70);
        for(var g=4;g<9;g++){
          buttons[g].there=false;
        }
        display=polars[getindex];
        express=polarpreserves[getindex];
        clearScreen();
      }

      else if(this.op==="+"){
        index=(this.y-90)/70;
         for(var g=4;g<9;g++){
          buttons[g].there=false;
        }
        this.there=false;
        typing=true;
        display="";
        express=[];
        clearScreen();
        //fgraphit();
      }
      
      else{
        currentcol=this.col;
        mode=this.mode;
        index=0;
        display="";
        express=[];
        clearScreen();     //add later to know which mode to goto and display that panel
      }
  }
}
}

//if expression ="", it should eliminate that function, and maybe reshift names
//fix expressions like ending with )



