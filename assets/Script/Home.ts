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
export default class Home extends cc.Component {
  @property(cc.ProgressBar)
  mProgressBar: cc.ProgressBar = null

  @property(cc.Label)
  mLoadingLabel: cc.Label = null

  @property(cc.Node)
  mStartBtn: cc.Node = null
  onLoad() {
    cc.game.setFrameRate(15)
  }
  start() {
    cc.debug.setDisplayStats(false)
    cc.director.preloadScene('game', this.onProgress.bind(this), this.onLoaded.bind(this))
    this.mStartBtn.on('click', () => {
      cc.log('1')
      cc.director.loadScene('game')
    })
  }
  onProgress(completedCount: number, totalCount: number, item: any) {
    let completedRate: number = completedCount / totalCount
    this.mProgressBar.progress = completedRate
    this.mLoadingLabel.string = `加载中...（${Math.floor(completedRate * 100).toString()} %）`
  }
  onLoaded(error: Error, asset: cc.SceneAsset) {
    this.mStartBtn.active = true
  }
}
