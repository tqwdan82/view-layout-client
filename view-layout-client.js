//version 1.0.1

'use strict';

const ViewLayoutClient = function() {
    this.containerId = '';
    var autoResize = false;
    var disChildDefaultWidth = 0;
    var disChildDefaultHeight= 0;

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

        myObserver.observe(container);
        window.addEventListener("resize", this.resizeContainer);
        
    };
   
}