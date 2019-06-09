const ViewLayoutClient = {
    disChildDefaultWidth : 0,
    disChildDefaultHeight: 0,
    render: (jsonConfiguration, containerId) => {
        //get the container dimension
    var container = document.getElementById(containerId);
    
    var contWidth = container.clientWidth;
    var contHeight = container.clientHeight;

    //get the container configuration
    var contConfigWidth = jsonConfiguration.colsizex;
    var contConfigHeight = jsonConfiguration.colsizey;

    //get default sizes
    this.disChildDefaultWidth = contWidth / contConfigWidth;
    this.disChildDefaultHeight = contHeight / contConfigHeight;

    //create the elements
    //create container
    var layoutCont = document.createElement('ul');
    layoutCont.style.listStyle = 'none';
    layoutCont.style.position = 'relative';
    layoutCont.style.width = '100%';
    layoutCont.style.height = '100%';
    layoutCont.style.padding = '0';
    layoutCont.style.margin = '0';
    //create children
    var allChildren = jsonConfiguration.grid;
    allChildren.forEach(function(child){
        var layoutChild = document.createElement('li');
        //declare attributes values
        var childWidth = child.sizex * this.disChildDefaultWidth;
        var childHeight = child.sizey * this.disChildDefaultHeight;
        var childPosX = (child.posx-1) * this.disChildDefaultWidth;
        var childPosY = (child.posy-1) * this.disChildDefaultHeight;
        
        //set attributes
        layoutChild.style.width = childWidth+'px';
        layoutChild.style.height = childHeight+'px';
        layoutChild.style.left = childPosX+'px';
        layoutChild.style.top = childPosY+'px';
        layoutChild.style.position = 'absolute';

        //create loading progress bar
        var layoutChildProgBar = document.createElement('li'); //create the loader container
        layoutChildProgBar.style.width = childWidth+'px';
        layoutChildProgBar.style.height = childHeight+'px';
        layoutChildProgBar.style.left = childPosX+'px';
        layoutChildProgBar.style.top = childPosY+'px';
        layoutChildProgBar.style.position = 'absolute';
        layoutChildProgBar.style.backgroundColor = 'rgba(0,0,0,0.5)';
        layoutChildProgBar.style.color = 'white';
        var loader = document.createElement('div');//create the loader icon
        loader.style.border = '5px solid #f3f3f3';
        loader.style.borderRadius  = '50%';
        loader.style.borderTop  = '5px solid #3498db';
        loader.style.width = '20px';
        loader.style.height = '20px';
        loader.style.WebkitAnimation = 'spin 1s linear infinite';
        loader.style.animation = 'spin 1s linear infinite';
        loader.style.left = ((childWidth/2)-20) + 'px';
        loader.style.top = ((childHeight/2)-20) + 'px';
        loader.style.position = 'absolute';
        document.styleSheets[0].insertRule('\
			@keyframes spin {\
				0% { transform: rotate(0deg);   }\
				100%   { transform: rotate(360deg); }\
            }'
        );
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
    });

    //append layout to container
    container.appendChild(layoutCont);
    }
}

//freezes an object. A frozen object can no longer be changed
Object.freeze(ViewLayoutClient);