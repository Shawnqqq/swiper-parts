// 使用说明
// script内引入
//          new Swiper({
//              containerId：容器ID,    *新增 wrapper容器,设置容器width、height为图片大小、设置容器位置
//              listId：图片容器ID,     * wrapper容器内新增图片容器
//              imgUrl：图片引入地址    *例如: ["./img/img-1.jpg","./img/img-2.jpg"] 组成数组
//              btnId ：图片显示按钮ID  * wrapper容器内新增图片显示按钮
//          })




class Swiper{
    constructor(swiper){
        this.state={
            containerId: swiper.containerId,  //容器名称
            listId: swiper.listId,         //图片容器名称
            imgUrl: swiper.imgUrl,        //图片引入地址   例如: ["./img/img-1.jpg","./img/img-2.jpg"]
            btnId: swiper.btnId,          //图片显示按钮名称
            index:0,
            distance:null,
            isLock: false,
            firstDistance:0,
        };
        this._$ = selector => document.querySelector(selector);   //选择器
        this._createElement = type => document.createElement(type); 
        this._setContent =(elem,content) => elem.textContent = content;
        this._appendChild =(container,node) => container.appendChild(node);
        this._init();
    }
    _init(){
        this.addHtml();
        this.goIndex(0);
    }
    addHtml(){
        let wrapperContainer = this._$(`#${this.state.containerId}`);
        let swiperList = this._$(`#${this.state.listId}`);
        wrapperContainer.style.position="relative";
        wrapperContainer.style.overflow='hidden';
        swiperList.setAttribute('style','position: absolute;display:flex;')
        let swiperBtn = this._$(`#${this.state.btnId}`);
        swiperBtn.setAttribute('style','position: absolute;top:85%;left:50%;display:flex;transform:translateX(-50%)')
        for(let i=0;i<this.state.imgUrl.length;i++){
            let swiperItem = this._createElement('div');
            swiperItem.setAttribute('class','swiper-item')
            this._appendChild(swiperList,swiperItem)
            let itemImage= this._createElement('img');
            this._appendChild(swiperItem,itemImage)
            itemImage.setAttribute('src',`${this.state.imgUrl[i]}`);
            let swiperBtnItem = this._createElement('div');
            swiperBtnItem.setAttribute('class','swiper-btn-item');
            swiperBtnItem.setAttribute('data-index',`${i}`)
            swiperBtnItem.setAttribute('style','width:24px;height:24px;border:2px solid #ffffff;border-radius:50%;margin:10px;')
            this._appendChild(swiperBtn,swiperBtnItem);
            swiperBtnItem.addEventListener('click',this.switch.bind(this))
        };
        let arrowLeft = this._createElement('div');
        this._setContent(arrowLeft,'<')
        arrowLeft.setAttribute('style','width: 50px;height: 100px;text-align: center;line-height: 100px;font-size: 40px;position: absolute;top: 50%;transform: translateY(-50%);background-color: #999999;opacity: 0.7;')
        let arrowright = this._createElement('div');
        this._setContent(arrowright,'>')
        arrowright.setAttribute('style','width: 50px;height: 100px;text-align: center;line-height: 100px;font-size: 40px;position: absolute;top: 50%;transform: translateY(-50%);background-color: #999999;opacity: 0.7;right:0')
        this._appendChild(wrapperContainer,arrowLeft);
        this._appendChild(wrapperContainer,arrowright);
        let swiperItem = document.getElementsByClassName('swiper-item')
        let lastItem = swiperItem[swiperItem.length-1].cloneNode(true);
        let firsItem = swiperItem[0].cloneNode(true);
        swiperList.prepend(lastItem);
        swiperList.appendChild(firsItem);
        this.state.distance = wrapperContainer.offsetWidth;
        this.state.firstDistance = this.state.distance+this.state.distance*this.state.index
        let swiperBtnItem = document.getElementsByClassName('swiper-btn-item');
        swiperBtnItem[0].style.background = 'red';
        arrowLeft.addEventListener('click',this.swiperPrev.bind(this));
        arrowright.addEventListener('click',this.swiperNext.bind(this));
    }
    swiperPrev(){
        let index = this.state.index;
        this.goIndex(index-1);
    }
    swiperNext(){
        let index = this.state.index;
        this.goIndex(index+1);
    }
    goIndex(index){
        let swiperItem = document.getElementsByClassName('swiper-item');
        let endDistance = this.state.distance*index+this.state.distance;
        let swiperList = this._$(`#${this.state.listId}`);
        let beginDistance = this.state.firstDistance;
        swiperList.style.left=`-${beginDistance}px`;
        let isLock = this.state.isLock;
        if(isLock){
            return
        }
        this.state.isLock = true;
        this.animateTo(beginDistance,endDistance,1000,(value)=>{
            swiperList.style.left = `-${value}px`;
        },(value)=>{
            let swiperItemLength = swiperItem.length;
            if(index === -1){
                index = swiperItemLength-3;
                value = this.state.distance+this.state.distance*index;
            }
            if(index === swiperItemLength -2){
                index = 0 ;
                value = this.state.distance+this.state.distance*index;
            }
            swiperList.style.left = `-${value}px`;
            this.state.index =index;
            this.state.firstDistance = value;
            this.state.isLock = false;
            this.heightLight(index);
        })
    }
    animateTo(begin,end,duration,change,finish){
        let startTime = Date.now();
        let that = this;
        requestAnimationFrame(function update(){
            let dataNow = Date.now();
            let time = dataNow-startTime;
            let value = that.linear(time,begin,end,duration);
            typeof change === 'function' && change(value)
            if(startTime+duration>dataNow){
                requestAnimationFrame(update)
            }else{
                typeof finish === 'function' && finish(end)
            }
        })
    }
    linear(time,begin,end,duration){
        return (end-begin)*time/duration +begin;
    }
    heightLight(index){
        let swiperBtnItem = document.getElementsByClassName('swiper-btn-item');
        for (let i=0;i<swiperBtnItem.length;i++){
            swiperBtnItem[i].style.background='none';
        }
        swiperBtnItem[index].style.background='red';
    }
    switch(e){
        let index = e.target.dataset.index;
        index= Number(index);
        this.goIndex(index);
    }
}