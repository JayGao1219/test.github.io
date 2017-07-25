var c=document.getElementById('board');//4
var ctx=c.getContext("2d");
var c1=document.getElementById('score');//5
var ctx1=c1.getContext("2d");
var c2=document.getElementById('background');//1
var ctx2=c2.getContext("2d");
var c3=document.getElementById('ball');//3
var ctx3=c3.getContext("2d");
var c4=document.getElementById('food');//2
var ctx4=c4.getContext("2d");

var w = 2 * document.getElementById("main").getBoundingClientRect().width;
var h = 2 * document.getElementById("main").getBoundingClientRect().height;

var stage=-1;//0:Tobegin 1:playing 2:die 3:playagain
var fraction=0;

c.width=c1.width=c2.width=c3.width=c4.width=w;
c.height=c1.height=c2.height=c3.height=c4.height=h;

var d=document.getElementById("main");
var length=0;
if(window.innerWidth>window.innerHeight)
	length=window.innerHeight/4;
else
	length=window.innerWidth/4;
var pX,pY;
pX=(window.innerWidth-length)/2;
pY=(window.innerHeight-length)/2;
length=length*2;
pX=pX*2;
pY=pY*2;

function getlevel(){

	return Math.ceil((fraction+1)/10);
};

function grid(){//棋盘格
	ctx2.lineWidth=10;
	ctx2.strokeStyle='rgb(169,169,169)';
	ctx2.lineJoin="round";
	for(let i=0;i<4;++i){
		for(let j=0;j<2;++j){
			ctx2.beginPath();
			if(j===0){
				ctx2.moveTo(pX+i*length/3,pY);
				ctx2.lineTo(pX+i*length/3,pY+length);
			}
			else{
				ctx2.moveTo(pX,pY+i*length/3);
				ctx2.lineTo(pX+length,pY+i*length/3);
			}
			ctx2.closePath();
			ctx2.stroke();
		}
	}
};
//ctx.rotate(20*Math.PI/180);


function enermyball(index,velocity){
	this.index=index;
	this.radius=length/8;
	switch((index-index%3)/3){//不是很确定

		case 0://方向向下
		this.speedX=0;
		this.speedY=velocity;
		this.x=pX+length/6+index*length/3;
		this.y=0;
		break;
		case 1://方向向左
		this.speedX=-velocity;
		this.speedY=0;
		this.x=window.innerWidth*2;
		this.y=pY+length/6+(index-3)*length/3;
		break;
		case 2://方向向上
		this.speedX=0;
		this.speedY=-velocity;
		this.x=pX+length/6+(8-index)*length/3;
		this.y=window.innerHeight*2;
		break;
		case 3://方向向右
		this.speedX=velocity;
		this.speedY=0;
		this.x=0;
		this.y=pY+length/6+(11-index)*length/3;////
		break;
	}
};
//这里的x,y是纯坐标
enermyball.prototype={
	constructor:enermyball,
	draw:function(){
		ctx3.fillStyle="rgb(0,0,0)";
		ctx3.beginPath();
		ctx3.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
		ctx3.closePath();
		ctx3.fill();
	},
	check_if_over:function(x,y,r){
		var xx=this.x;
		var yy=this.y;
		var rr=this.radius;
		console.info((xx-x)*(xx-x)+(yy-y)*(yy-y)-(rr+r)*(rr+r));
		return(xx-x)*(xx-x)+(yy-y)*(yy-y)-(rr+r)*(rr+r)<0;
	},
	check_if_in:function(){
        if (this.speedX < 0) {
            if (this.x + this.radius < - this.radius)
                return true;
        }
        if (this.speedX > 0) {
            if (this.x > window.innerWidth * 2 + this.radius)
                return true;
        }
        if (this.speedY < 0) {
            if (this.y + this.radius < - this.radius)
                return true;
        }
        if (this.speedY > 0){
            if (this.y > window.innerHeight * 2 + this.radius)
                return true;
        }
        return false;
    },
    updating: function(){
    	this.radius=length/8;
    	this.x=this.x+this.speedX;
    	this.y=this.y+this.speedY;
    	this.draw();
    	
    }
};//基本的移动没有问题

function myself(xx,yy){
	this.index=xx+yy*3;
	this.radius=length/9;
	this.sx=pX+(2*xx+1)*length/6;
	this.sy=pY+(2*yy+1)*length/6;
	if(arguments.length===2){
		this.x=xx;
		this.y=yy;
	}
	else{
		this.x=0;
		this.y=0;
	}	
};//xx和yy就是坐标值

myself.prototype={
	constructor:myself,
	draw:function(){
		ctx.beginPath();
		ctx.lineWidth=9;
		ctx.strokeStyle='rgb(169,169,169)';
		ctx.arc(this.sx,this.sy,this.radius,0,Math.PI*2,true);
		ctx.closePath();
		ctx.stroke();
	},
	updating:function(){
		ctx.clearRect(0,0,c.width,c.height);
		this.index=this.x+this.y*3;
		this.radius=length/9;
		this.sx=pX+(2*this.x+1)*length/6;
		this.sy=pY+(2*this.y+1)*length/6;
		this.draw();
	}
};

function score(n){//显示分数和等级
	ctx1.clearRect(0,0,c1.width,c1.height);
	ctx1.font="100px Microsoft YaHei";
	ctx1.strokeStyle='rgb(169,169,169)';
	ctx1.fillText(n,length/4,length/2,length/2);
	ctx1.fillText("level "+Math.ceil((n+1)/10),window.innerWidth*2-length,length/2,length);
};
//以上函数目前没有问题

function food(index){//c2
	this.x=index%3;
	this.y=(index-index%3)/3;
	this.sx=pX+(2*this.x+1)*length/6;
	this.sy=pY+(2*this.y+1)*length/6;
	this.l=length/4;//边长
	this.index=index;
};

food.prototype={
	constructor:food,
	draw:function(){
		ctx4.clearRect(0,0,c4.wight,c4.height);
		ctx4.fillStyle="rgb(169,169,169)";
		// ctx4.translate(this.sx,this.sy);
		// ctx4.rotate(angle*Math.PI/180);
		// ctx4.translate(-this.sx,this.sy);
		ctx4.fillRect(this.sx-this.l/2,this.sy-this.l/2,this.l,this.l);
	},
	updating:function(){
		ctx4.clearRect(0,0,c4.width,c4.height);
		this.l=length/4;//边长
		this.x=this.index%3;
		this.y=(this.index-this.index%3)/3;
		this.sx=pX+(2*this.x+1)*length/6;
		this.sy=pY+(2*this.y+1)*length/6;
		this.draw();

	}
};

window.onkeydown=function(event){
	// console.info("1");
	//left:37 up:38 right:39 down:40
	switch(event.keyCode){
		case 37://left
		if(me.x>0){
			--me.x;
			console.info("x"+me.x);
		}
		break;
		case 38:
		if(me.y>0){
			--me.y;
			console.info("y"+me.y);
		}
		break;
		case 39:
		if(me.x<2){
			++me.x;
			console.info("x"+me.x);
		}
		break;
		case 40:
		if(me.y<2){
			++me.y;
			console.info("y"+me.y);
		}
		case 13:
		if(stage===-1||stage===2){
			stage=0;
		}
		break;
		default:
		break;
	}
	if(event.keyCode>14){
		if((me.x===target.x) && (me.y===target.y)){
			++fraction;
			target.index=Math.floor(Math.random()*8);
		}
	}
};

window.onresize = function(event){

    var ww = 2 * document.getElementById("main").getBoundingClientRect().width;
	var hh = 2 * document.getElementById("main").getBoundingClientRect().height;
    c.width=c1.width=c2.width=c3.width=c4.width=w;
	c.height=c1.height=c2.height=c3.height=c4.height=h;
	var d=document.getElementById("main");
	var length=0;
	if(window.innerWidth>window.innerHeight)
		length=window.innerHeight/4;
	else
		length=window.innerWidth/4;
	var pX,pY;
	pX=(window.innerWidth-length)/2;
	pY=(window.innerHeight-length)/2;
	length=length*2;
	pX=pX*2;
	pY=pY*2;
};

var me=new myself(0,0);
var obscale=[];
var target=new food(8);

function updateobscale(){
	ctx3.clearRect(0,0,c3.width,c3.height);
	var num=0;
	var random;
	var xx=me.sx;
	var yy=me.sy;
	var rr=me.radius;
	var speed=getlevel()+5;
	for(let i=0;i<obscale.length;++i){
		if(!obscale[i].check_if_in()){
			if(obscale[i].check_if_over(xx,yy,rr)){
				stage=2;
				return;
			}
			++num;
			obscale[i].updating();
		}
	}
	var targetnum=getlevel()*2;
	for(let i=0;i<targetnum-num;++i){
		random=Math.floor(Math.random()*8);
		var a=new enermyball(random,speed);
		a.updating();
		obscale.push(a);
	}
}

function restart(){
	stage=0;
	me=new myself(0,0);
	obscale=[];
	target=new food(8);
	fraction=0;
}
var update=function(){//0:Tobegin 1:playing 2:die 3:playagain
	grid();
	updateobscale();
	score(fraction);
	switch(stage){
		case -1:
		alert("press \"enter\" or click me to begin the game");
		stage=0;
		case 0:case 1:
		me.updating();
		target.updating();
		updateobscale();
		break;
		case 3:
		me.updating();
		target.updating();
		break;
		case 2:
		alert("YOU LOST");
		alert("let us replay");
		restart();
		break;
		default:break;
	}
}

var aaa=self.setInterval("update()",15);
