(function () {
    var tools = {
        /**
         * 设置缩放比
         * @param desW
         * @param fontSize
         */
        setScale: function (desW, fontSize) {
            var winW = document.documentElement.clientWidth;
            var scale = desW / fontSize;
            if (winW > desW) {
                winW = desW;
            }
            document.documentElement.style.fontSize = winW / scale + "px";
        },
        /**
         * 获得指定元素的所有的元素哥哥弟弟节点
         * @param ele 指定元素
         * @returns {Array} 哥哥弟弟，顺序和文档顺序相同
         */
        siblings: function siblings(ele) {
            var parent = ele.parentNode;
            var children = parent.children;//所有元素节点，在ie中还会包括注释节点
            var ary = [];
            for (var i = 0; i < children.length; i++) {
                if (children[i].nodeType === 1 && children[i] != ele) {
                    ary.push(children[i]);
                }
            }
            return ary;
        },
        /**
         * 新增class类名
         * @param ele 元素
         * @param className 要新增的类名
         */
        addClass: function addClass(ele, className) {
            if (ele && ele.nodeType && ele.nodeType === 1 && className && typeof className === "string") {
                var reg = new RegExp("(?:^| )" + className + "(?: |$)");
                if (!reg.test(ele.className)) {
                    ele.className = ele.className + " " + className;
                }
            }
        },
        /**
         * 移除class类名
         * @param ele 元素
         * @param className 要移除的类名
         */
        removeClass: function removeClass(ele, className) {
            if (ele && ele.nodeType && ele.nodeType === 1 && className && typeof className === "string") {
                var reg = new RegExp("(?:^| )" + className + "(?: |$)", "g");
                //ele.className = ele.className.replace(/ /g, "   ");//加空格
                ele.className = ele.className.replace(reg, " ");
            }
        }
    };
    //音乐播放暂停
    var musicBtn = document.querySelectorAll(".musicBtn");
    var music = document.getElementById("music");
    window.setTimeout(function () {
        music.play();
        music.addEventListener("canplay", function () {
            musicBtn.style.display = "block";
            musicBtn.className = "musicMove";
        }, false);
    },1000);
    var flag = false;
    [].forEach.call(musicBtn, function (val, i, index) {
        val.addEventListener("click", function () {
            if (flag) {
                [].forEach.call(index, function () {
                    arguments[0].className = "musicBtnPlay musicBtn";
                });
                music.play();
                flag = false;
            } else {
                [].forEach.call(index, function () {
                    arguments[0].className = "musicBtnPause musicBtn";
                });
                flag = true;
                music.pause();
            }

        });
    });

    /**
     * 鼠标滑动
     */
    var winH = document.documentElement.clientHeight;
    var oUl = document.querySelector("#list");
    var oLis = oUl.getElementsByTagName("li");
    [].forEach.call(oLis, function (val, index) {
        val.index = index;
        val.addEventListener("touchstart", start, false);
        val.addEventListener("touchmove", move, false);
        val.addEventListener("touchend", end, false);
    });
    var startY = null;
    var nowIndex = null;
    var prevOrNext = null;
    var step = 0.25;
    var startX = null;
    function start(e) {
        nowIndex = this.index;
        startY = e.changedTouches[0].pageY;
        startX = e.changedTouches[0].pageX;
    }

    function move(e) {
        this.flag = true;
        var siblings = tools.siblings(this);
        [].forEach.call(siblings, function (val) {
            val.style.display = "none";
            val.id="";
        });
        var moveDis = e.changedTouches[0].pageY - startY;
        if (Math.abs(e.changedTouches[0].pageX - startX) > Math.abs(moveDis)) {
            this.flag = false;
            return;
        }
        if (moveDis > 0) {//下移
            prevOrNext = nowIndex == 0 ? oLis.length - 1 : nowIndex - 1;
            oLis[prevOrNext].style.webkitTransform = "translate(0," + (-winH + moveDis) + "px)";
        } else if (moveDis < 0) {//上移
            prevOrNext = nowIndex == oLis.length - 1 ? 0 : nowIndex + 1;
            oLis[prevOrNext].style.webkitTransform = "translate(0," + (winH + moveDis) + "px)";
        }
        this.style.webkitTransform = "translate(0," + moveDis * step + "px) scale(" + (1 - Math.abs(moveDis) / winH * step) + ")";
        oLis[prevOrNext].style.display = "block";
        tools.addClass(oLis[prevOrNext], "zIndex");
        e.preventDefault();
    }

    function end(e) {
        if (this.flag) {
            var endDis = e.changedTouches[0].pageY;
            if (endDis > 0) {//下移
                this.style.webkitTransform = "translate(0," + winH * step + "px)";
            } else if (endDis < 0) {//上移
                this.style.webkitTransform = "translate(0,-" + winH * step + "px)";
            }
            this.style.webkitTransition = "0.5s";
            oLis[prevOrNext].style.webkitTransform = "translate(0,0)";
            oLis[prevOrNext].style.webkitTransition = "0.5s";
            var oSpans = document.querySelector(".info").children;
            if (prevOrNext == 1) {
                var oSpansIndex=0;
                var oSpanTimer = window.setInterval(function () {
                    oSpans[oSpansIndex].style.webkitTransform = "translate(0,0)";
                    oSpansIndex++;
                    if(oSpansIndex>oSpans.length-1){
                        window.clearInterval(oSpanTimer);
                    }
                }, 300)
            }else{
                [].forEach.call(oSpans,function (item) {
                    item.style.webkitTransform="";
                })
            }
            oLis[prevOrNext].addEventListener("webkitTransitionEnd", function (e) {
                if (e.target.nodeName != "LI")return;
                var siblings = tools.siblings(oLis[prevOrNext]);
                [].forEach.call(siblings, function (val) {
                    val.style.display = "none";
                });
                tools.removeClass(this, "zIndex");
                [].forEach.call(oLis, function (val) {
                    val.style.webkitTransition = "";
                });
                this.flag = false;
                this.id = "a" + this.index;
            }, false);
        }
    }

})();


