/**
 * Canvas画心型图案(心形函数+贝叶斯曲线)
 */


var cas=document.getElementById('HeartCanvas'), ctx=cas.getContext('2d');
cas.width=600;
cas.height=520,
count=getRandInt(8,15),
angle=360/count,
petals=[],
startAngle=getRandInt(0,90),
chen=0.8,
offsetX=300,
offsetY=220,
dots=[],
timer1=0,
timer2=0;


setTimeout(function(){


	var vector={},i=10;
	timer1=setInterval(function(){
		vector=getHeartPoint(i);
		dots.push(new Dot(vector.x,vector.y));
		if(i<30){
			i+=0.3
		}else{
			clearInterval(timer1);
		}
	},100);
	
	timer2=setInterval(function(){
		for(var i=0;i<dots.length;i++){
			dots[i].draw();
		}
	});
}, 1000);

function Dot(x,y){
	this.transX=x;
	this.transY=y;
	this.petals=[];
	this.init();
}
Dot.prototype={
	init:function(){
		for(var i=0;i<count;i++){
			var color=getRGBA(255,128,128,0,128,0,0.1);
			var p=new Petal(getRandInt(1,5),getRandInt(1,5),startAngle,angle,getRand(0.1,0.5),color);
			this.petals.push(p);
			startAngle+=angle;
			//p.update();
		}
	},
	draw:function(){
		ctx.save();
		ctx.translate(this.transX, this.transY);
		for(var i=0;i<this.petals.length;i++){
			this.petals[i].update();
		}
		ctx.restore();
	}
}

function rgbaStr(r, g, b, a) {
		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	};
function getRGBA(rmin, rmax, gmin, gmax, bmin, bmax, a) {
	var r = Math.round(getRand(rmin, rmax));
	var g = Math.round(getRand(gmin, gmax));
	var b = Math.round(getRand(bmin, bmax));
	var limit = 5;
	if (Math.abs(r - g) <= limit && Math.abs(g - b) <= limit && Math.abs(b - r) <= limit) {
		return rgbaStr(rmin, rmax, gmin, gmax, bmin, bmax, a);
	} else {
		return rgbaStr(r, g, b, a);
	}
};
function getHeartPoint(angle) {/*agnle=10*/
	var t = angle / Math.PI;
	var x = 19.5 * (16 * Math.pow(Math.sin(t), 3))*chen;
	var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))*chen;
	return {x:offsetX + x, y:offsetY + y};
}
function Vector(x,y){
	this.x=x;
	this.y=y;
}
Vector.prototype={
	rotate:function(theta){
		var x = this.x;
		var y = this.y;
		this.x = Math.cos(theta) * x - Math.sin(theta) * y;
		this.y = Math.sin(theta) * x + Math.cos(theta) * y;
		return this;
	},
	mult:function(f){
		this.x *= f;
		this.y *= f;
		return this;
	},
	clone:function(){
		return new Vector(this.x,this.y);
	}
}

function Petal(xadd,yadd,startAngle,angle,grow,color){
	this.xadd=xadd;
	this.yadd=yadd;
	this.startAngle=startAngle;
	this.angle=angle;
	this.grow=grow;
	this.c=color;
	this.r=1;
}

Petal.prototype={
	draw:function(){/*r控制里面空白的大小，angle控制花瓣的数量，startAngle控制起始花瓣的位置，mult方法用来计算出两个控制点的位置*/
		var v1, v2, v3, v4;
		v1 = new Vector(0, this.r).rotate(this.startAngle * 2 * Math.PI /360);
		v2 = v1.clone().rotate(this.angle * 2 * Math.PI /360);
		v3 = v1.clone().mult(this.xadd); //.rotate(this.tanAngleA);
		v4 = v2.clone().mult(this.yadd); //.rotate(this.tanAngleB);
		ctx.beginPath();
		ctx.strokeStyle = this.c;
		//console.log(ctx.strokeStyle);
		
		ctx.lineWidth=1;
		ctx.moveTo(v1.x, v1.y);
		ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
		ctx.stroke();
	},
	update:function(){
		if(this.r<8){
			this.draw();
			this.r+=this.grow;
		}else{
			petals.splice(petals.indexOf(this),1);
		}
	}
}

function getRandInt(min,max){
	return Math.floor(Math.random()*(max-min)+min);
}
function getRand(min,max){
	return Math.random()*(max-min)+min;
}