// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class MainController extends cc.Component {
  onLoad() {
    cc.game.setFrameRate(60)
    cc.debug.setDisplayStats(false)
    let physicsManager: cc.PhysicsManager = cc.director.getPhysicsManager()
    /*启用物理世界*/
    physicsManager.enabled = true

    /* 设置重力
      cc.PhysicsManager.PTM_RATIO  像素/米
      重力 -9.8  米/秒的平方
      加速4倍
    */
    physicsManager.gravity = cc.v2(0, -cc.PhysicsManager.PTM_RATIO * 9.8 * 4)

    /*绘制物理调试信息*/
    physicsManager.debugDrawFlags =
      cc.PhysicsManager.DrawBits.e_aabbBit |
      cc.PhysicsManager.DrawBits.e_jointBit |
      cc.PhysicsManager.DrawBits.e_shapeBit

    /*
        设置物理步长
        物理系统是按照一个固定的步长来更新物理世界的，默认这个步长即是你的游戏的帧率：1/framerate
        物理步长，默认 FIXED_TIME_STEP 是 1/60
        每次更新物理系统处理速度的迭代次数，默认 VELOCITY_ITERATIONS  10
        每次更新物理系统处理位置的迭代次数，默认 POSITION_ITERATIONS 10
    */
    physicsManager.enabledAccumulator = true
    cc.PhysicsManager.FIXED_TIME_STEP = 1 / 60
    cc.PhysicsManager.VELOCITY_ITERATIONS = 10
    cc.PhysicsManager.POSITION_ITERATIONS = 10
  }
  start() {}
}
