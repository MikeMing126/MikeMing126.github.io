function InitAPlayerHolder() {
    var flag=0;
    try
    {
        ap=aplayers[0]; //aplayer对象的存放位置挺离谱的
        flag = 1;
    }
    catch
    {
        setTimeout(InitAPlayerHolder, 50);//等待aplayer对象被创建（没找到初始化实例的地方只能这样了，这个判断代码是StackOverflow上面扒的（因为自己是个蒟蒻
        return;
    }

    if (!flag) 
        return;
    
    //自带播放暂停时显隐歌词，可以删
    ap.lrc.hide();

    document.getElementsByClassName("aplayer-icon-menu")[0].click()
    //加载保存进度
    //Index
    if(localStorage.getItem("aPlayerMusicIndex")!=null)
    {
        aPlayerMusicIndex = localStorage.getItem("aPlayerMusicIndex");
        ap.list.switch(aPlayerMusicIndex);
    }
    //Time
    if(sessionStorage.getItem("aPlayerMusicTime") != null)
    {
        window.musict = sessionStorage.getItem("aPlayerMusicTime");
        ap.setMode(sessionStorage.getItem("aPlayerMusicMode"));
        if(sessionStorage.getItem("aPlayerMusicPaused")!='1')
        {
            ap.play();
        }
        // setTimeout(function(){
        //     ap.seek(window.musict); //seek炸了我很久，最后决定加个延时（本来要用canplay但是莫名鬼畜了）
        // },500);
        var g=true; //加个变量以防鬼畜但是不知道怎么节流qwq
        ap.on("canplay",function(){
            if(g){
                ap.seek(window.musict);
                g=false;//如果不加oncanplay的话会seek失败就这原因炸很久
            }
        });
    }
    else
    {
        sessionStorage.setItem("aPlayerMusicPaused",1);
        ap.setMode("mini"); //新版添加了保存展开状态功能
    }
    //Volume
    if(sessionStorage.getItem("aPlayerMusicVolume") != null)
    {
        ap.audio.volume=Number(sessionStorage.getItem("aPlayerMusicVolume"));
    }

    //#region 状态保存函数
    //原基础上加了个检测暂停免得切换页面后爆零(bushi)（指社死）
    ap.on("pause",function(){
        sessionStorage.setItem("aPlayerMusicPaused",1);
        //ap.lrc.hide()
    });
    //自带播放暂停时显隐歌词，后面那句可以删，上同
    ap.on("play",function(){
        sessionStorage.setItem("aPlayerMusicPaused",0);
        //ap.lrc.show()
    });

    //保存音量
    ap.audio.onvolumechange=function(){sessionStorage.setItem("aPlayerMusicVolume",ap.audio.volume);};

    //Index/Time/Mode 定时保存
    var saveTimeInterval = 200;
    setInterval(() => {
        localStorage.setItem("aPlayerMusicIndex",ap.list.index);
        sessionStorage.setItem("aPlayerMusicTime",ap.audio.currentTime);
        sessionStorage.setItem("aPlayerMusicMode",ap.mode);
    },saveTimeInterval);
    //#endregion 状态保存函数
}

//执行逻辑
InitAPlayerHolder();
