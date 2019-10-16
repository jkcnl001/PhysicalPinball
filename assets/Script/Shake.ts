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
export default class Shake extends cc.ActionInterval {
    _initial_x: number = 0
    _initial_y: number = 0
    _strength_x: number = 0
    _strength_y: number = 0
    /*
   * 创建抖动动画
   * @param {number} duration     动画持续时长
   * @param {number} strength_x   抖动幅度： x方向
   * @param {number} strength_y   抖动幅度： y方向
   */
    constructor(duration: number, strength_x: number, strength_y: number) {
        super()
        this.initWithDuration(duration, strength_x, strength_y)
    }
    initWithDuration(duration: number, strength_x: number, strength_y: number) {
        cc.ActionInterval.prototype['initWithDuration'].call(this, duration)
        this._strength_x = strength_x;
        this._strength_y = strength_y;
        return true;
    }
    rangeRand(min: number, max: number) {
        let rnd = Math.random();
        return rnd * (max - min) + min;
    }
    startWithTarget(target: cc.Node) {
        cc.ActionInterval.prototype["startWithTarget"].call(this, target);
        this._initial_x = target.x;
        this._initial_y = target.y;
    }
    stop() {
        this.getTarget().setPosition(new cc.Vec2(this._initial_x, this._initial_y));
        cc.ActionInterval.prototype["stop"].call(this);
    }
    update() {
        let randx = this.rangeRand(-this._strength_x, this._strength_x);
        let randy = this.rangeRand(-this._strength_y, this._strength_y);
        this.getTarget().setPosition(randx + this._initial_x, randy + this._initial_y);
    }
}