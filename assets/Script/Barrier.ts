// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import MainController from "./MainController";
@ccclass
export default class Barrier extends cc.Component {

    @property(cc.Label)
    lbScore: cc.Label = null
    @property(cc.Boolean)
    isAddBuffBall: Boolean = false
    score: number = 0
    main: MainController = null
    start() {
        if (this.lbScore) {
            this.lbScore.node.angle = -this.node.angle
        }
        this.setScore(this.main.setBarrierScore());
        this.node.color = cc.color(200, this.randomNum(0, 255), this.randomNum(0, 255), 255)
    }
    /** 获取随机值 */
    randomNum(Min: number, Max: number) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.floor(Rand * Range);
        return num;
    }
    /*设置分数*/
    setScore(score: number) {
        if (this.lbScore) {
            this.score = score;
            this.lbScore.string = this.score.toString();
        }
    }
    /**发生碰撞时 */
    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.isAddBuffBall) {
            this.main.addBall(this.node.position);
            this.main.removeBarrier(this);
        } else {
            this.main.addScore();
            if (this.score == 1) {
                this.main.removeBarrier(this);
            } else {
                this.setScore(this.score - 1);
                this.main.shake(this);
            }
        }
    }
}
