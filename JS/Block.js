(function () {
    window.Block = function () {
        // 得到随机的方块
        // 1.第一步罗列所有的类型
        var allType = ["S","T","O","L","J","I","Z"];
        // 2.第二步从所有的类型中随机得到一种
        this.type = allType[parseInt(Math.random()*allType.length)];
        // 3.第三步得到随机的类型方块，然后通过这个类型获取当前的类型所有形状总数量，因为不同的类型，形状数量不同，比如O只有一种，I有俩种，L有四种
        this.allDir = fangkuai[this.type].length;
        // 4.第四步通过当前的allDir的length随机得到不同的数字
        this.dir = parseInt(Math.random()*this.allDir)
        // 5.第五步得到随机的方框
        this.code = fangkuai[this.type][this.dir]
        // console.log(this.dir)

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
                    // console.log(i,j)
                    game.setColor(i+this.row, j+this.col, this.code[i][j])
                }
            }
        }
    };
    // 渲染下一个方块的方法

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
            // 此时就是下落到底的状态，渲染预览框的方块
            game.block = game.nextBlock;
            // 让预览框的方块再次渲染新的
            game.nextBlock = new Block();
            // 方块到底了，然后要渲染到地图的code中
            this.renderMap()
            // 判断是否可以消行
            game.map.checkRemove()
            // 进行判定是否游戏结束
            this.checkOver()
        }
    };
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
            // 改变方向
            this.row++;
        }
    };
    // 方块的旋转
    Block.prototype.checkRot = function(){
        // 备份旧的形状方向
        var oldDir = this.dir;
        // 改变新的
        this.dir++;
        // 判断如果当前dir大于了最后一种方向，回到第一种状态
        if(this.dir>this.allDir-1){
            this.dir = 0;
        }
        // 改变方向之后渲染新的方块方向
        this.code = fangkuai[this.type][this.dir];
        console.log(this.code,'新的')
        // 渲染之后的新方块需要判断，是否有能力进行渲染
        if(!this.check(this.row,this.col)){
            // 进入这里了就说明重合了，违规了，打回原形
            this.dir = oldDir;
            // 再次渲染方块
            this.code = fangkuai[this.type][this.dir];
            console.log(this.code,'变回旧的')
        }
    }
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
    Block.prototype.checkOver = function(){
        for(var i = 0;i<game.col;i++){
            if(game.map.mapCode[0][i] != 0){
                clearInterval(game.timer);
                alert("游戏结束! 您当前的得分为: "+game.score)
            }
        }
    }
})()