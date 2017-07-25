# 作业四工程说明
## `game.html`中的`canvas`
**共有五个canvas层**(根据id区分）
	* `board`用户控制的小球
	* `score`得分和等级
	* `background`棋盘
	* `ball`黑色的敌人小球
	* `food`可以提高分数的食物
## 功能说明
### 变量说明
	1. `var me=new myself()`用户控制的小球
	2. `var obscale=[]`通过`function updateobscale()`来进行更新，`push`进`new enermy()`变量
	3. `var target=new food()`生成食物
### 小球移动
通过函数
```
window.onkeydown=function(event){
//...
}
```
来进行获取用户敲击键盘的键值，从而上下左右移动小球
### 生成黑棋，食物
通过函数`random=Math.floor(Math.radom()*N)`来生成[0,N-1]之间的整数值，从而通过棋牌相应的`index`来生成。
### 开始结束界面
通过函数`alert()`来设置开始和结束界面
### 关卡设定
通过增加小球的速度和数量来提高关卡的难度。
# test.github.io
# test.github.io
