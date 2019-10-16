// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import MainController from "./MainController";
@ccclass
export default class Barrier extends cc.Component {
                
    @property(cc.Label)
    lbScore: cc.Label = null
    isAddBuffBall:Boolean =false
    score:Number = 0
    main:MainController = null
    start () {
        if (this.lbScore) {
            this.lbScore.node.rotation = -this.node.rotation
        }
        this.setScore(this.main.setBarrierScore());
        this.node.color = cc.color(200, this.randomNum(0, 255), this.randomNum(0, 255), 255)
    }
    /*设置分数*/
    setScore(score) {
     if (this.lbScore) {
            this.score = score;
            this.lbScore.string = this.score.toString();
        }
    }

}
