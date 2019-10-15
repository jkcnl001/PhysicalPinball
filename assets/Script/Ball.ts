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

@ccclass
export default class NewClass extends cc.Component {
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
        }
    }
}
