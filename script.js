var Vector = function (x,y){
  //沒傳x y 時，初始值為0
  this.x = x || 0
  this.y = y || 0
}
Vector.prototype.add=function(v){
  return new Vector(this.x+v.x,this.y+v.y)
}
Vector.prototype.sub = function(v){
  return new Vector(this.x-v.x,this.y-v.y)
}
Vector.prototype.length=function(){
  return Math.sqrt(this.x*this.x+this.y*this.y)
}
Vector.prototype.set=function(v){
  this.x=v.x
  this.y=v.y
}
Vector.prototype.equal=function(v){
  return (this.x==v.x && this.y==v.y)
}
Vector.prototype.clone=function(){
  return new Vector(this.x,this.y)
}
Vector.prototype.mul=function(s){
  return new Vector(this.x*s,this.y*s)
}

//蛇的原理(queue)
var Snake = function(){
  this.body = []
  //蛇得長度
  this.maxLength = 5
  //蛇的頭
  // this.head = new Vector(0,0)
  //不傳值，初始值直接為(0,0)
  this.head = new Vector()
  //蛇的預設速度，往右
  this.speed = new Vector(1,0)
  //蛇的方向，域設往右
  this.direction="Right"
  this.setDirection(this.direction)
}

Snake.prototype.update = function(){
  //頭的位置的等於自己加上速度
  let newHead = this.head.add(this.speed)
  //把頭推進身體
  this.body.push(this.head) 
  this.head = newHead
   //把尾巴砍掉
  //用while不斷執行Update。直到小於
  // if((this.body.length>this.maxLength)){
  //    this.body.shift()
  // }
  while(this.body.length>this.maxLength){
    this.body.shift()
  }
}

Snake.prototype.setDirection = function(dir){
  //var 限制在function let 限制在{}，離開if就不會有作用
  let target
  if (dir=="Up"){
    target = new Vector(0,-1)
  }
  if (dir=="Down"){
    target = new Vector(0,1)
  }
  if (dir=="Left"){
    target = new Vector(-1,0)
  }
  if (dir=="Right"){
    target = new Vector(1,0)
  }
  this.speed=target
  //設定不能往來的方向走，不然會變短
  //蛇跟現在的速度、蛇跟現在的速度-1倍不一樣的話才會執行更新速度
  if (target.equal(this.speed)==false && target.equal(this.speed.mul(-1))==false){
    this.speed=target
  }
}

//檢查蛇有沒有超出範圍，return範圍
Snake.prototype.checkBoundary = function(gameWidth){
  let xInRange= 0<=this.head.x && this.head.x < gameWidth
  let yInRange= 0<=this.head.y && this.head.y < gameWidth
  return xInRange && yInRange
}

var Game = function(){
  //每個格子的寬度
  this.bw=12
  //每個格子的艱鉅
  this.bs=2
  //遊戲的寬度總共有40格
  this.gameWidth=40
  //蛇的速度
  this.speed = 30
  //蛇 null 先不畫
  // this.snake = null
  this.snake = new Snake()
  //畫面上的食物
  this.foods = []
  // 產生食物
  // this.generateFood()
  this.init()
  this.start = false
}

//遊戲初始化
Game.prototype.init = function(){
  this.canvas = document.getElementById("mycanvas")
  //格子的寬度 + 格子的間隙寬度
  this.canvas.width=this.bw*this.gameWidth + this.bs * (this.gameWidth-1) 
  this.canvas.height=this.canvas.width
  this.ctx = this.canvas.getContext("2d")
  //渲染畫面
  this.render()
  //呼叫自己更新
  this.update()
  //初始化食物
  this.generateFood()
  // setTimeout(()=>{this.update()},1000/this.speed)
}

//遊戲開始
Game.prototype.startGame = function(){
  this.start=true
  //用jquery 藏起來
  $(".panel").hide()
  //開始遊戲時，產生新的蛇
  this.snake = new Snake()
  //開始音效
  //升Do
  this.playSound("C#5",-20)
  //Mi
  this.playSound("E5",-20,200)
}
//遊戲結束
Game.prototype.endGame = function(){
  this.start=false
  //用jquery 顯示
  $(".panel").show()
  //遊戲結束時，顯示分數，減掉自己的長度後，每吃到一個+10分
  $("h2").text("Score: "+ (this.snake.body.length-5)*10)
  //死亡音效 La mi la
  //A3 La
  this.playSound("A3")
  //E2 mi
  this.playSound("E2",-10,200)
  //la
  this.playSound("A2",-10,400)
}

//產生食物
Game.prototype.generateFood = function(){
  
  //食物位置
  let x = parseInt(Math.random()*this.gameWidth)
  let y = parseInt(Math.random()*this.gameWidth)
  //無條件捨去
  // let x = Math.floor(Math.random()*this.gameWidth)
  // let y = Math.floor(Math.random()*this.gameWidth)
  
  //放進game的foods裡面
  this.foods.push(new Vector(x,y))
  //食物特效
  this.drawEffect(x,y)
  //高音Mi ，負20音量
  this.playSound("E5",-20)
  //La 稍微慢一點出來delay 200
  this.playSound("A5",-20,200)
}


Game.prototype.update = function(){
  //如果遊戲沒有開始就不更新
  if (this.start){
    //開始遊戲撥放低音La
    this.playSound("A2", -20)
    //更新蛇的位置
    this.snake.update()
    //判斷蛇有沒有吃到食物  35:08
      this.foods.forEach((food,i)=>{
      //蛇的頭位置和食物相等‵，就吃到食物了
        if (this.snake.head.equal(food)){
          //蛇的長度+1
          this.snake.maxLength++
          //去除吃到的食物
          this.foods.splice(i,1)
          //產生一個新食物
          this.generateFood()
        }
      })
    
    //撞到自己時節速遊戲 
    this.snake.body.forEach(bp=>{
      if(this.snake.head.equal(bp)){
        console.log("碰!")
         this.endGame()
      }
    })
    
    //檢查有沒有撞到邊界
    if (this.snake.checkBoundary(this.gameWidth)==false){
      this.endGame()
    }
    
  }
  //調整遊戲速度，開根號+5
  this.speed = Math.sqrt(this.snake.body.length)+5
  
  //每300秒執行更新，遊戲速度
  // setTimeout(()=>{this.update()},300)
  //調整遊戲速度
  setTimeout(()=>{
    this.update()
  },parseInt(1000/this.speed))
  
}

//格子位置
Game.prototype.getPositon=function(x,y){
  return new Vector(
    x*this.bw+(x-1)*this.bs,
    y*this.bw+(y-1)*this.bs
  )
}

//格子上色
Game.prototype.drawBlock=function(v,color){
  this.ctx.fillStyle=color
  var pos = this.getPositon(v.x,v.y)
  this.ctx.fillRect(pos.x,pos.y,this.bw,this.bw)  
}

//食物特效
Game.prototype.drawEffect = function(x,y){
  let r = 2
  //食物的值
  let pos = this.getPositon(x,y)
  //抓遊戲物件當參考
  let _this = this
  
  let effect = ()=>{
    r++
    //線的顏色
    // _this.ctx.strokeStyle = "rgba(255,0,0,1)"
    //增加透明度 0~1之間
     _this.ctx.strokeStyle = "rgba(255,0,0,"+(100-r)/100+")"
    //清除原本的
    _this.ctx.beginPath()
    //畫圈圈
    // _this.ctx.arc(pos.x, pos.y, r ,0 , Math.PI*2 )
    //圓心預設是左上角，因此要+自己的一半
    _this.ctx.arc(pos.x+_this.bw/2,pos.y+_this.bw/2, 20*Math.log(r/2),0,Math.PI*2)
    _this.ctx.stroke()
    //執行到100
    if (r<100){
      requestAnimationFrame(effect)
    }
  }
  
  //執行第一次
  requestAnimationFrame(effect)
}

//遊戲畫面渲染
Game.prototype.render=function(){
  this.ctx.fillStyle = "rgba(0,0,0,0.3)"
  this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
  //畫格子
  for(let x=0;x<this.gameWidth;x++){
    for(let y=0;y<this.gameWidth;y++){
       this.drawBlock(new Vector(x,y),"rgba(255,255,255,0.03)")
    }
  }
  
  //畫蛇
  //sp snack.position 取身體所有陣列 
  this.snake.body.forEach((sp,i)=>{
     this.drawBlock(sp,"white")
  })
  
  //畫食物
  this.foods.forEach(p=>{
     this.drawBlock(p,"red")
  })
  
  //重複去執行
  requestAnimationFrame(()=>{this.render()})
}



//播放聲音
//參數:音符 聲音 播放聲音時機

// game.playSound("C3")  //Do

Game.prototype.playSound = function(note,volume,when){
  setTimeout(function(){
    
    //產生聲音物件   new Tone.Synth() 接到喇叭 toMaster()
    var synth = new Tone.Synth().toMaster();     
    
    //如果有給音量的話給volume，沒有的話，預設12
    // synth.volume.value= volume || -12;
     synth.volume= volume || -12;
    //觸發八分音符
    synth.triggerAttackRelease(note, "8n");
    //沒有指定時間，就0，直接執行
  },when || 0)
}

var game = new Game();
game.init()

//Jquery 抓鍵盤 操作方向
$(window).keydown(function(evt){
  //傳遞鍵盤按什麼鍵
  console.log(evt.key)
  //把Arrow字串移掉
  game.snake.setDirection(evt.key.replace("Arrow",""))
})