//version 1.0.1

'use strict';

const ViewLayoutClient = function() {
    this.containerId = '';
    var autoResize = false;
    var disChildDefaultWidth = 0;
    var disChildDefaultHeight= 0;
    var autoFillers = [];

    this.resizeContainer = () =>{

        var outerContainer = document.getElementById(this.containerId);
        //get ul container
        var container = outerContainer.getElementsByTagName("UL")[0];

        //get the container configuration
        var contConfigWidth = container.getAttribute('colsizex');
        var contConfigHeight = container.getAttribute('colsizey');

        //resize
        var contWidth = outerContainer.clientWidth;
        var contHeight = outerContainer.clientHeight;
        if(autoResize){
            contHeight = outerContainer.clientHeight;
            if(contHeight !== window.innerHeight ){
                contHeight = window.innerHeight ;
            }
            contHeight = contHeight  - (container.offsetTop * 2);
            outerContainer.style.height = contHeight + 'px';
        }else{
            contHeight = outerContainer.clientHeight;
        }
        outerContainer.style.height = contHeight + 'px';

        //get default sizes
        disChildDefaultWidth = contWidth / contConfigWidth;
        disChildDefaultHeight = contHeight / contConfigHeight;
        
        //get ul list
        var ulList = container.childNodes;
        
        for(var i = 0; i < ulList.length; i++){
            var child = ulList[i];
            
            var childWidth = child.getAttribute('sizex') * disChildDefaultWidth;
            var childHeight = child.getAttribute('sizey') * disChildDefaultHeight;
            var childPosX = (child.getAttribute('posx')-1) * disChildDefaultWidth;
            var childPosY = (child.getAttribute('posy')-1) * disChildDefaultHeight;
            
            
            //set attributes
            child.style.width = childWidth+'px';
            child.style.height = childHeight+'px';
            child.style.left = childPosX+'px';
            child.style.top = childPosY+'px';
            
            //get the loader
            var neighborChildLoader = document.getElementById(child.id+"_layoutLoader");
            if(neighborChildLoader != null){
                //resize the loader
                neighborChildLoader.style.width = childWidth+'px';
                neighborChildLoader.style.height = childHeight+'px';
                neighborChildLoader.style.left = childPosX+'px';
                neighborChildLoader.style.top = childPosY+'px';

                //reposition the loader icon
                var loaderIcon = neighborChildLoader.childNodes[0];
                var loaderWidth = 0.1 * childWidth;
                var loaderHeight = 0.1 * childHeight;
                var loaderDim = loaderWidth >= loaderHeight ? loaderHeight: loaderWidth;
                loaderIcon.style.width = loaderDim + 'px';
                loaderIcon.style.height = loaderDim + 'px';
                loaderIcon.style.left = ((childWidth/2)-loaderDim) + 'px';
                loaderIcon.style.top = ((childHeight/2)-loaderDim) + 'px';
            }
        };

    };

    const myObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            this.resizeContainer();
        });
    });

    this.render = (jsonConfiguration, containerId) => {

        //get the container dimension
        this.containerId = containerId;
        var container = document.getElementById(containerId);
        var resolvedValH = window.getComputedStyle(container)['height'];
        //console.log(resolvedValH);
        if(resolvedValH === '0px') autoResize = true;

        var contWidth = 0;
        var contHeight = 0;
        contWidth = container.clientWidth - (container.offsetLeft * 2);
        if(autoResize){
            contHeight = container.clientHeight;
            if(contHeight == 0 ){
                contHeight = window.innerHeight ;
            }
            contHeight = contHeight  - (container.offsetTop * 2);
            container.style.height = contHeight + 'px';
        }else{
            contHeight = container.clientHeight;
        }
        
        //get the container configuration
        var contConfigWidth = jsonConfiguration.colsizex;
        var contConfigHeight = jsonConfiguration.colsizey;

        //get default sizes
        disChildDefaultWidth = contWidth / contConfigWidth;
        disChildDefaultHeight = contHeight / contConfigHeight;

        //create the elements
        //create container
        var layoutCont = document.createElement('ul');
        layoutCont.style.listStyle = 'none';
        layoutCont.style.position = 'relative';
        layoutCont.style.width = '100%';
        layoutCont.style.height = '100%';
        layoutCont.style.padding = '0';
        layoutCont.style.margin = '0';
        layoutCont.setAttribute('colsizex', jsonConfiguration.colsizex);
        layoutCont.setAttribute('colsizey', jsonConfiguration.colsizey);
        //create children
        var allChildren = jsonConfiguration.grid;
        var index = 0;
        allChildren.forEach(function(child){
            var layoutChild = document.createElement('li');
            layoutChild.data = child;
            console.log(child);
            if(child.autofill)
            {
                autoFillers.push(child);
            }

            layoutChild.id =containerId + "_frame"+index;
            //declare attributes values
            var childWidth = child.sizex * disChildDefaultWidth;
            var childHeight = child.sizey * disChildDefaultHeight;
            var childPosX = (child.posx-1) * disChildDefaultWidth;
            var childPosY = (child.posy-1) * disChildDefaultHeight;
            
            //set attributes
            layoutChild.style.width = childWidth+'px';
            layoutChild.style.height = childHeight+'px';
            layoutChild.style.left = childPosX+'px';
            layoutChild.style.top = childPosY+'px';
            layoutChild.style.position = 'absolute';
            layoutChild.setAttribute('sizex', child.sizex);
            layoutChild.setAttribute('sizey', child.sizey);
            layoutChild.setAttribute('posx', child.posx);
            layoutChild.setAttribute('posy', child.posy);

            var rightBuff = 17;
            var minBtnWidth = 17;
            var minBthHeight = 15;
            if(child.minhori
                && child.sizex != 1){
                var horiMinBtn = document.createElement('div');
                horiMinBtn.id = containerId + "_frame"+index+"_horiMinBtn";
                horiMinBtn.style.backgroundColor = 'rgba(0,0,0,0.5)';
                horiMinBtn.style.color = 'white';
                horiMinBtn.style.position = 'absolute';
                horiMinBtn.style.width = minBtnWidth + 'px';
                horiMinBtn.style.height = minBthHeight + 'px';
                horiMinBtn.style.left = 'calc(100% - 35px)';
                rightBuff = 40+minBtnWidth;
                horiMinBtn.style.top = '0px';
                horiMinBtn.style.paddingTop = '5px';
                var horiMinBtnLabel = document.createElement('span');
                horiMinBtnLabel.classList.add("chevron");
                horiMinBtnLabel.classList.add(child.minhori);
                horiMinBtn.appendChild(horiMinBtnLabel);
                horiMinBtn.addEventListener("click", function(){
                    var rtaEvent = new CustomEvent("realTimeAdjustHori", {
                        detail: {
                            frameId: layoutChild.id,
                            orientation: "horizontal",
                            direction: child.minhori
                        }
                    });
                    container.dispatchEvent(rtaEvent);
                });
                layoutChild.appendChild(horiMinBtn);
            }

            if(child.minvert
                && child.sizey != 1){
                var vertMinBtn = document.createElement('div');
                vertMinBtn.id = containerId + "_frame"+index+"_vertMinBtn";
                vertMinBtn.style.backgroundColor = 'rgba(0,0,0,0.5)';
                vertMinBtn.style.color = 'white';
                vertMinBtn.style.position = 'absolute';
                vertMinBtn.style.width = minBtnWidth + 'px';
                vertMinBtn.style.height = minBthHeight + 'px';
                vertMinBtn.style.left = 'calc(100% - '+rightBuff+'px)';
                vertMinBtn.style.top = '0px';
                vertMinBtn.style.paddingTop = '5px';
                var verMinBtnLabel = document.createElement('span');
                verMinBtnLabel.classList.add("chevron");
                verMinBtnLabel.classList.add(child.minvert);
                vertMinBtn.appendChild(verMinBtnLabel);
                vertMinBtn.addEventListener("click", function(){
                    var rtaEvent = new CustomEvent("realTimeAdjustVert", {
                        detail: {
                            frameId: layoutChild.id,
                            orientation: "vertical",
                            direction: child.minvert
                        }
                    });
                    container.dispatchEvent(rtaEvent);
                });
                layoutChild.appendChild(vertMinBtn);
            }

            //create loading progress bar
            var layoutChildProgBar = document.createElement('li'); //create the loader container
            layoutChildProgBar.style.position = 'absolute';
            layoutChildProgBar.cssFloat = 'left';
            layoutChildProgBar.id = containerId + "_frame"+index+"_layoutLoader";
            layoutChildProgBar.style.backgroundColor = 'rgba(0,0,0,0.5)';
            layoutChildProgBar.style.color = 'white';
            var loader = document.createElement('div');//create the loader icon
            loader.style.border = '5px solid #f3f3f3';
            loader.style.borderRadius  = '50%';
            loader.style.borderTop  = '5px solid #3498db';
            var loaderWidth = 0.1 * childWidth;
            var loaderHeight = 0.1 * childHeight;
            var loaderDim = loaderWidth >= loaderHeight ? loaderHeight: loaderWidth;
            loader.style.width = loaderDim + 'px';
            loader.style.height = loaderDim + 'px';
            loader.style.WebkitAnimation = 'spin 1s linear infinite';
            loader.style.animation = 'spin 1s linear infinite';
            loader.style.left = ((childWidth/2)-loaderDim) + 'px';
            loader.style.top = ((childHeight/2)-loaderDim) + 'px';
            loader.style.position = 'absolute';
            document.styleSheets[0].insertRule('\
                @keyframes spin {\
                    0% { transform: rotate(0deg);   }\
                    100%   { transform: rotate(360deg); }\
                }'
            );
            layoutChildProgBar.style.width = childWidth+'px';
            layoutChildProgBar.style.height = childHeight+'px';
            layoutChildProgBar.style.left = childPosX+'px';
            layoutChildProgBar.style.top = childPosY+'px';
            layoutChildProgBar.style.zIndex = '1';
            layoutChildProgBar.appendChild(loader);
            layoutCont.appendChild(layoutChildProgBar);

            //creating the container for content
            var ifrm = document.createElement('iframe');
            ifrm.setAttribute('src', child.content);
            ifrm.height = '100%';
            ifrm.width = '100%';
            ifrm.setAttribute('frameborder',0);
            ifrm.style.zIndex = '0';
            ifrm.onload=function(){ // when the frame content has completed loading
                layoutCont.removeChild(layoutChildProgBar);
            };
            layoutChild.appendChild(ifrm);         
               
            //append children to layout
            layoutCont.appendChild(layoutChild);
            index++;
        });

        //append layout to container
        container.appendChild(layoutCont);

        var animationInt = 25;
        //append real time adjust handler for vertical adjustment
        container.addEventListener("realTimeAdjustVert", function(e) 
        {
            var cont = document.getElementById(e.detail.frameId);
            var contData = cont.data;
            if(contData.sizey != 1) // if is not the minimum
            {
                if(e.detail.direction === "up"
                    && contData.isAdjustedVert) // if is maximising downwards
                {
                    //change height only
                    var aniIntvId = setInterval(function()
                    {
                        if(cont.style.height === (disChildDefaultHeight*parseInt(contData.sizey))+'px'
                            || parseInt(cont.style.height,10) > (disChildDefaultHeight*parseInt(contData.sizex))) //if animation finished
                        {
                            //stop the animation interval
                            clearInterval(aniIntvId);
                        }
                        else if(parseInt(cont.style.height,10) + animationInt < (disChildDefaultHeight*parseInt(contData.sizex))) //continue to animate at interval size
                        {
                            //reduce the height based on the interval size
                            cont.style.height = (parseInt(cont.style.height,10) + animationInt) +'px';
                        }
                        else // if next interval size is less than the default height
                        {
                            //set height to default 1 unit height
                            cont.style.height = (disChildDefaultHeight*parseInt(contData.sizey))+'px';
                            //indicate it is adjusted
                            contData.isAdjustedVert = false;
                            //stop the animation interval
                            clearInterval(aniIntvId);
                        }
                    }, 1);

                    var vertMinBtn = document.getElementById(e.detail.frameId + "_vertMinBtn");
                    var oVertMinBtnLabel = vertMinBtn.getElementsByTagName("span")[0];
                    vertMinBtn.removeChild(oVertMinBtnLabel);
                    oVertMinBtnLabel = document.createElement('span');
                    oVertMinBtnLabel.classList.add("chevron");
                    oVertMinBtnLabel.classList.remove("bottom");
                    vertMinBtn.appendChild(oVertMinBtnLabel);
                    vertMinBtn.addEventListener("click", function(){
                        var rtaEvent = new CustomEvent("realTimeAdjustVert", {
                            detail: {
                                frameId: e.detail.frameId,
                                orientation: e.detail.orientation,
                                direction: e.detail.direction
                            }
                        });
                        cont.dispatchEvent(rtaEvent);
                    });

                    return;
                }
                else if(e.detail.direction === "up"
                    && !contData.isAdjustedVert) // if is minimizing upwards
                {
                     //change width only
                     var aniIntvId = setInterval(function()
                     {
                         if(cont.style.height === disChildDefaultHeight+'px'
                             || parseInt(cont.style.height,10) < disChildDefaultHeight) //if animation finished
                         {
                             //stop the animation interval
                             clearInterval(aniIntvId);
                         }
                         else if(parseInt(cont.style.height,10) - animationInt > disChildDefaultHeight) //continue to animate at interval size
                         {
                             //reduce the height based on the interval size
                             cont.style.height = (parseInt(cont.style.height,10) - animationInt) +'px';
                         }
                         else // if next interval size is less than the default height
                         {
                             //set height to default 1 unit height
                             cont.style.height = disChildDefaultHeight+'px';
                             //indicate it is adjusted
                             contData.isAdjustedVert = true;
                             //stop the animation interval
                             clearInterval(aniIntvId);
                         }
                     }, 1);

                     var vertMinBtn = document.getElementById(e.detail.frameId + "_vertMinBtn");
                     var oVertMinBtnLabel = vertMinBtn.getElementsByTagName("span")[0];
                     vertMinBtn.removeChild(oVertMinBtnLabel);
                     oVertMinBtnLabel = document.createElement('span');
                     oVertMinBtnLabel.classList.add("chevron");
                     oVertMinBtnLabel.classList.add("bottom");
                     vertMinBtn.appendChild(oVertMinBtnLabel);
                     vertMinBtn.addEventListener("click", function(){
                         var rtaEvent = new CustomEvent("realTimeAdjustVert", {
                             detail: {
                                 frameId: e.detail.frameId,
                                 orientation: e.detail.orientation,
                                 direction: e.detail.direction
                             }
                         });
                         cont.dispatchEvent(rtaEvent);
                     });

                     //get all auto fillers that qualifies
                     console.log(cont.data.posy);
                     console.log(autoFillers);
                     autoFillers.forEach(autoFill)
                     {
                         //if(autoFill.posy >= )
                     }

                     return;
                } 
                else // if is minimizing downwards
                {
                    //change height towards down
                }

                return;
            }
            else // if is the minimum already
            {
                // dun resize
            }
        });

        //append real time adjust handler for horizontal adjustment
        container.addEventListener("realTimeAdjustHori", function(e) 
            { 
                var cont = document.getElementById(e.detail.frameId);
                var contData = cont.data;
                if(contData.sizex != 1) // if is not the minimum
                {
                    if(e.detail.direction === "left"
                        && contData.isAdjustedHori) // if is maximising rightwards
                    {
                        //change width only
                        var aniIntvId = setInterval(function()
                        {
                            if(cont.style.width === (disChildDefaultWidth*parseInt(contData.sizex))+'px'
                                || parseInt(cont.style.width,10) > (disChildDefaultWidth*parseInt(contData.sizex))) //if animation finished
                            {
                                //stop the animation interval
                                clearInterval(aniIntvId);
                            }
                            else if(parseInt(cont.style.width,10) + animationInt < (disChildDefaultWidth*parseInt(contData.sizex))) //continue to animate at interval size
                            {
                                //reduce the width based on the interval size
                                cont.style.width = (parseInt(cont.style.width,10) + animationInt) +'px';
                            }
                            else // if next interval size is less than the default width
                            {
                                //set width to default 1 unit width
                                cont.style.width = (disChildDefaultWidth*parseInt(contData.sizex))+'px';
                                //indicate it is adjusted
                                contData.isAdjustedHori = false;
                                //stop the animation interval
                                clearInterval(aniIntvId);
                            }
                        }, 1);

                        var horiMinBtn = document.getElementById(e.detail.frameId + "_horiMinBtn");
                        var oHoriMinBtnLabel = horiMinBtn.getElementsByTagName("span")[0];
                        horiMinBtn.removeChild(oHoriMinBtnLabel);
                        var horiMinBtnLabel = document.createElement('span');
                        horiMinBtnLabel.classList.add("chevron");
                        horiMinBtnLabel.classList.add("left");
                        horiMinBtn.appendChild(horiMinBtnLabel);
                        horiMinBtn.addEventListener("click", function(){
                            var rtaEvent = new CustomEvent("realTimeAdjustHori", {
                                detail: {
                                    frameId: e.detail.frameId,
                                    orientation: e.detail.orientation,
                                    direction: e.detail.direction
                                }
                            });
                            cont.dispatchEvent(rtaEvent);
                        });

                        return;
                    }
                    else if(e.detail.direction === "left"
                        && !contData.isAdjustedHori) // if is minimizing leftwards
                    {
                        //change width only
                        var aniIntvId = setInterval(function()
                        {
                            if(cont.style.width === disChildDefaultWidth+'px'
                                || parseInt(cont.style.width,10) < disChildDefaultWidth) //if animation finished
                            {
                                //stop the animation interval
                                clearInterval(aniIntvId);
                            }
                            else if(parseInt(cont.style.width,10) - animationInt > disChildDefaultWidth) //continue to animate at interval size
                            {
                                //reduce the width based on the interval size
                                cont.style.width = (parseInt(cont.style.width,10) - animationInt) +'px';
                            }
                            else // if next interval size is less than the default width
                            {
                                //set width to default 1 unit width
                                cont.style.width = disChildDefaultWidth+'px';
                                //indicate it is adjusted
                                contData.isAdjustedHori = true;
                                //stop the animation interval
                                clearInterval(aniIntvId);
                            }
                        }, 1);

                        var horiMinBtn = document.getElementById(e.detail.frameId + "_horiMinBtn");
                        var oHoriMinBtnLabel = horiMinBtn.getElementsByTagName("span")[0];
                        horiMinBtn.removeChild(oHoriMinBtnLabel);
                        var horiMinBtnLabel = document.createElement('span');
                        horiMinBtnLabel.classList.add("chevron");
                        horiMinBtnLabel.classList.add("right");
                        horiMinBtn.appendChild(horiMinBtnLabel);
                        horiMinBtn.addEventListener("click", function(){
                            var rtaEvent = new CustomEvent("realTimeAdjustHori", {
                                detail: {
                                    frameId: e.detail.frameId,
                                    orientation: e.detail.orientation,
                                    direction: e.detail.direction
                                }
                            });
                            cont.dispatchEvent(rtaEvent);
                        });

                        return;

                    }
                    else // if is minimizing rightwards
                    {
                        //change width towards right
                    }

                    return;
                }
                else // if is the minimum already
                {
                    // dun resize
                }
                
            }
        );

        myObserver.observe(container);
        window.addEventListener("resize", this.resizeContainer);
        
    };
   
}