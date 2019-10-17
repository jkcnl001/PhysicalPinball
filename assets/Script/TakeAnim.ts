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
export default class TakeAnim extends cc.Component {
    @property(cc.Sprite)
    arraw: cc.Sprite = null
    start() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    }
    /**触摸移动操作，射线瞄准 */
    onTouchMove(event: cc.Event.EventTouch) {
        if (!this.node["main"].isRecycleFinished()) {
            return;
        }
        let origin = cc.v2(0, 446);  //射线原点坐标
        let touchPos = this.node.convertTouchToNodeSpaceAR(event.touch);

        if (touchPos.y > origin.y) {
            return;
        }

        let graphics = this.node.getComponent(cc.Graphics);
        let line = touchPos.sub(origin);
        let length = 40;
        let lineLength = line.mag();    //获得这个向量的长度
        let increment = line.normalize().mul(length); //根据每条线段的长度获得一个增量向量
        let pos = origin.clone(); //临时变量

        graphics.fillColor = cc.color(255, 255, 255, 150);
        pos.addSelf(increment);
        pos.addSelf(increment);
        graphics.clear();

        /** 只要线段长度还大于每条线段的长度 */
        while (lineLength > length) {
            graphics.circle(pos.x, pos.y, 5);
            graphics.fill();
            pos.addSelf(increment);
            lineLength -= length;
        }

        var dis = origin.sub(touchPos)
        var angle = Math.atan2(dis.y, dis.x) / Math.PI * 180;
        this.arraw.node.rotation = -angle;
    }
}
