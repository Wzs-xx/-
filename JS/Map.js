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
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0],
            [1, 2, 3, 4, 5, 6, 7, 1, 1, 0, 0, 0],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        ]
    }
    Map.prototype.render = function (mapGame) {
        // 渲染地图
        for (var i = 0; i < mapGame.row; i++) {
            for (var j = 0; j < mapGame.col; j++) {
                if (this.mapCode[i][j] != 0) {
                    game.setColor(i, j, this.mapCode[i][j])
                }
                // $("tr").eq(i).children("td").eq(j).html(this.mapCode[i][j])
            }
        }
    }
    Map.prototype.checkRemove = function(){
        // 判断当前的mapCpde是否该消行
        // 消行规则：当前的mapCode数组的每一项如果都不是0了，就说明该消行了
        for(var i = 0;i<20;i++){
            // 遍历地图数组进行判定
            if(this.mapCode[i].indexOf(0) == -1){
                // -1就是不存在，删除这一行
                this.mapCode.splice(i,1);
                // 删除一行补充一行
                this.mapCode.unshift( [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],);
                
                // 分数增加，根据不同的速度决定加多少分数
                if(game.during <= 30 && game.during >=20) {
                    game.score += 10;
                }else if (game.during < 20 && game.during >= 10){
                    game.score += 20;
                }else {
                    game.score += 30;
                }
                // 渲染分数
                document.getElementById("score").innerHTML = "分数"+game.score;
                if(game.score % 100 == 0){
                    game.during -= 5;
                    if(game.during <= 0){
                        game.during = 1;
                    }
                }
            }
        }
    }
})()