# -
纯Javascript原生 俄罗斯方块源码，有需要小伙伴拿走使用吧！！！！
2.1 初始化布局
我们还是设置Game为中介者类
(function () {
    window.Game = function () {
        // 设置行和列
        this.row = 20;
        // row行 col列
        this.col = 12
        // 初始化
        this.init()
    }
    Game.prototype.init = function () {
        var $table = $("<table></table>");
        // 渲染 表格
        for (var i = 0; i < this.row; i++) {
            // 创建tr
            var $tr = $("<tr></tr>")
            for (var j = 0; j < this.col; j++) {
                // 创建td
                var $td = $("<td></td>")
                // td放到tr里
                $td.appendTo($tr)
            }
            // tr放到table里
            $tr.appendTo($table)
        }
        // table放到body里
        $($table).appendTo("body")
    };
})()
你会发现我们的Game.js文件的最外层是用IIFE包裹起来的，和之前的贪吃蛇不同，因为我们需要知道实际工作中都是多个类进行并行开发的，由于为了上生产
，会将代码进行打包部署，也就是将所有的js文件打包为一个js文件，如果没有IIFE会造成作用域和命名的冲突，所以我们IIFE隔离作用域


css样式
* {
            margin: 0;
            padding: 0;
        }

        html {
            height: 100%;
        }

        body {
            overflow: hidden;
            background: url(images/bg.png);
            /* background: url(images/bg.png) repeat-x center bottom -webkit-linear-gradient(top, skyblue, white); */
            background-size: auto 50%;
        }

        table {
            border-collapse: collapse;
            margin: 10px auto;
        }

        td {
            border: 1px solid #fff;
            width: 25px;
            height: 25px;
        }
2.2认识方框
认识方框的状态
俄罗斯方框中，下落方框形态一共有七种，每一种又有不同的状态(方向)
S型，Z型，J型，L型，O型，T型，I型
这些形态都用一个4*4的矩阵表示

2.3方块的表示
我们使用二维数组去表示俄罗斯方框的方框状态
比如T我们使用二维数组
[
 [0,0,0,0],
 [1,1,1,0],
 [0,1,0,0],
 [0,0,0,0],
]
我们会将所有的俄罗斯的类型和状态都放到一个JSON中
var fangkuai = {
    "S": [
        [
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0],
        ]
    ],
    。。。。。。
}


2.4渲染方框
(function () {
    window.Block = function () {
        this.block = [
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]
        // 初始的行
        this.row = 0;
        // 初始的列，因为要居中显示，所以列要为4
        this.col = 4;
    }
    Block.prototype.render = function () {
        // 渲染四行四列的方框
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                //如果四乘四的矩阵中某一项不是0，就说明有颜色，渲染这个颜色
                if (this.block[i][j] != 0) {
                    // i=0 ,j = 1;  1
                    console.log(i,j)
                    game.setColor(i+this.row, j+this.col, this.block[i][j])
                }
            }
        }
    }
})()
效果图

但是我们发现this.block 是写死的，始终只有一种状态，所以接下来我们要随机显示方块
如何随机显示方块？我们一共有7种类型，每一种类型有不同的状态，所以我们要把所有的类型和所有的状态都随机

步骤如下
(function () {
    window.Block = function () {
        // 得到随机的方块
        // 1.罗列所有的类型
        var allType = ["S","T","O","L","J","I","Z"];
        // 2.从所有的类型中随机得到一种
        this.type = allType[parseInt(Math.random()*allType.length)];
        // 3.第三步得到随机的类型方块，然后通过这个类型获取当前的类型所有形状总数量，因为不同的类型，形状数量不同，比如O只有一种，I有俩种，L有四种
        this.allDir = fangkuai[this.type].length;
        // 4.通过当前的allDir的length随机得到不同的数字
        this.dir = parseInt(Math.random()*this.allDir)
        // 5.得到随机的方框
        this.code = fangkuai[this.type][this.dir]
        console.log(this.dir)

        // 初始的行
        this.row = 0;
        // 初始的列，因为要居中显示，所以列要为4
        this.col = 4;
    }
    Block.prototype.render = function () {
        // 渲染四行四列的方框
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                //如果四乘四的矩阵中某一项不是0，就说明有颜色，渲染这个颜色
                if (this.code[i][j] != 0) {
                    // i=0 ,j = 1;  1
                    console.log(i,j)
                    game.setColor(i+this.row, j+this.col, this.code[i][j])
                }
            }
        }
    }
})()


2.5地图类
我们需要一个地图，来显示已经到底的方块，此时我们的表格只是一个显示的dom，没有办法实时进行显示，因此为每一帧要清除画布，所以要想持久起来，所以我们维持一个地图类，用来持久已经到底的方块
(function () {
    window.Map = function () {
        // 地图的矩阵
        this.mapCode = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0],
            [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0, 0],
        ]
    }
    Map.prototype.render = function (mapGame) {
        // 渲染地图
        for (var i = 0; i < mapGame.row; i++) {
            for (var j = 0; j < mapGame.col; j++) {
                if (this.mapCode[i][j] != 0) {
                    game.setColor(i, j, this.mapCode[i][j])
                }
            }
        }
    }
})()


2.6方块的下落状态
此时我们的方块下落很简单，就是给Block.row++就可以了，但是怎么停止？
此时我们提出了一个“预判断”的概念，也就是每一次方块下落的时候需要进行一次预先判断，当前方块的下一次运动位置去和地图的（mapCpde）进行位置判断，如果此时mapCode在相同的位置也有方块存在，则停止下落。
    Block.prototype.check = function(row,col){
        // check函数的row和col指的是要校验的地图的row和col的位置
        // 能力判断方法，判断的是对应位置的方块和地图是否有都不为0的情况，如果有返回true，否则返回false：false就代表没有重合
        for(var i=0;i<4;i++){
            for(var j= 0;j<4;j++){
                 if(this.code[i][j] != 0 && game.map.mapCode[i+row][j+col] !== 0 ){
                     return false;
                 }
            }
        }
        return true;
    }
    // 方块下落，需要判断当前的方块是否能够下落
    Block.prototype.checkDown = function(){
        // 判断当前地图的位置和自己方块的位置是否有重合 this.row+1指的是预判断
        // 欲判断就是在下一次方块将要到达的位置是否有对应的地图不为0
        if(this.check(this.row +1,this.col)){
           this.row++;
        }else{
            // 此时就是下落到底的状态，渲染新的方块
            game.Block = new Block();
        }
    }
    
    
    2.7渲染地图
当前我们的方块到底之后，不会渲染当前的状态，只会消失，因为是mapCode一直在维护底部的持久状态，所以一旦方块到底后，将要将数据给mapCode进行持久更新
    // 方块下落，需要判断当前的方块是否能够下落
    Block.prototype.checkDown = function(){
        // 判断当前地图的位置和自己方块的位置是否有重合 this.row+1指的是预判断
        // 欲判断就是在下一次方块将要到达的位置是否有对应的地图不为0
        if(this.check(this.row +1,this.col)){
           this.row++;
        }else{
            // 此时就是下落到底的状态，渲染新的方块
            game.block = new Block();
            // 方块到底了，然后要渲染到地图的code中
            this.renderMap()
        }
    };


    // 将已经到底的方块渲染到地图中
    Block.prototype.renderMap = function(){
        for(var i=0;i<4;i++){
           for(var j =0;j<4;j++){
              //将现在已有的方块渲染到Map类的mapCode上
              if(this.code[i][j] !== 0){
                //   改变地图的mapCode数据
                  game.map.mapCode[this.row +i][this.col+j] =this.code[i][j];
              } 

           }
        }
    }
    
    2.8方块的左右移动
其实就是增加事件监听，然后通过check方法预判断是否有能力移动
    Game.prototype.bindEvent = function () {
        // 备份
        var self = this;
        
        $(window).keydown(function (event) {
            console.log(event.keyCode);
            // console.log(event.keydown);
            if (event.keyCode == 37) {
                //判断时候有向左移动的能力
                self.block.checkLeft();
            } else if (event.keyCode == 39) {
                //判断时候有右左移动的能力
                self.block.checkRight()
            } else if(event.keyCode == 32){
                // 一键到底，空格到底
                self.block.checkBlockEnd();
            }
        })
    }

    // 判断是否能够向左移动，如果可以则移动
    Block.prototype.checkLeft = function(){
        // 判断是否可以向左
        if(this.check(this.row,this.col - 1)){
            this.col--;
        }
    };
    // 判断是否能够右移动，如果可以则移动
    Block.prototype.checkRight = function(){
        // 判断是否可以向右
        if(this.check(this.row,this.col + 1)){
            this.col++;
        }
    };
    Block.prototype.checkBlockEnd = function(){
        // 使用while循环，如果当前的check返回的是true则代表能够下移，继续让row++
        while(this.check(this.row+1,this.col)){
            this.row++;
        }
    }



2.9方块的旋转
我们可以按上键让方块按照顺时针的方向旋转
但是此时会发生一个问题，方块在旋转的过程中不会顾及左右是否已有的颜色格子
此时我们可以对方块进行一次“备份”，将旧的方块备份一份，然后让新block的和已有的mapCode进行一一比对，如果新的有重合就打回原形



2.10 方块消行
方块消行本质就是mapCode的每一项数组的遍历，如果某一项数组中有都不为0了，就说明该消行




2.11 判断游戏结束
地图的第一行的mapCode有不为0的就判定死亡了
每次方块到底的时候进行一次判断


2.12 设置预览框
俄罗斯方块有一个重要的逻辑就是预览，下一次的方块 会 提前展示，所以我们可以设置一个nextBlock当做下一次出场的方块
渲染预览框的方法

初始化的时候增加预览框的功能

当方块到底的时候，渲染nextBlock
