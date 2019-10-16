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
import Config from "./Config"
@ccclass
export default class Ball extends cc.Component {
    @property(cc.RigidBody)
    rigidBody: cc.RigidBody = null
    isTouchedGround: Boolean = false
    @property(cc.Collider)
    collider: cc.Collider = null
    onLoad() {
        this.rigidBody = this.getComponent(cc.RigidBody);
        this.collider = this.getComponent(cc.Collider);
    }
    update(dt) {
        if (this.isTouchedGround) {
            this.rigidBody.active = false
            this.rigidBody.linearVelocity = cc.Vec2.ZERO;
             /*记录路径点*/
             let pathPos = [];
             pathPos.push(this.node.position);
             pathPos.push(cc.v2(349, -498))
             pathPos.push(cc.v2(338, 608))
             pathPos.push(cc.v2(162, 557))
             this.node.runAction(cc.sequence(
                cc.cardinalSplineTo(1, pathPos, 0.9),
                cc.callFunc(function () {
                    this.rigidBody.active = true;
                    this.node.group = Config.groupBallInRecycle;
                    this.main.recycleBall();
                }.bind(this))
            ))
            this.isTouchedGround = false;
        }
    }
   /*小球发生碰撞时*/
   onBeginContact(contact, selfCollider, otherCollider) {
    if(otherCollider.node.name == 'ground'){
        this.isTouchedGround = true;
    }
   }
}
