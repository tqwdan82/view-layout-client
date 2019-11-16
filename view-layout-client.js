//version 1.0.1

'use strict';

const ViewLayoutClient = function() {
	this.containerId = '';
	// this.positionGrid = [];
    var autoResize = false;
    var disChildDefaultWidth = 0;
    var disChildDefaultHeight= 0;
	var autoFillers = [];
	
    this.resizeContainer = () =>{

        let outerContainer = document.getElementById(this.containerId);
        //get ul container
        var container = outerContainer.getElementsByTagName("UL")[0];

        //get the container configuration
        let contConfigWidth = container.getAttribute('colsizex');
        let contConfigHeight = container.getAttribute('colsizey');

        //resize
        let contWidth = outerContainer.clientWidth;
        let contHeight = outerContainer.clientHeight;
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
        let ulList = container.childNodes;
        
        for(var i = 0; i < ulList.length; i++){
            let child = ulList[i];
			console.log(child);
            
            let childWidth = child.getAttribute('sizex') * disChildDefaultWidth;
            let childHeight = child.getAttribute('sizey') * disChildDefaultHeight;
            let childPosX = (child.getAttribute('posx')-1) * disChildDefaultWidth;
            let childPosY = (child.getAttribute('posy')-1) * disChildDefaultHeight;
			
			//reset posy and sizey related changes due to the current state of the frame
			if(child.getAttribute("isMaximisedWidth") == 'true'
				&& child.getAttribute('autofilledLeft') !== null
			){
				childPosX = ((child.getAttribute('posx')-1) - parseInt(child.getAttribute("autofilledLeft"), 10) )* disChildDefaultWidth;
				
				childWidth = (parseInt(child.getAttribute('sizex'), 10) + parseInt(child.getAttribute("autofilledLeft"), 10))*disChildDefaultWidth;
				
			}
			if(child.getAttribute("isMaximisedWidth") !== 'true'
			){
				childWidth = disChildDefaultWidth;
			}
			
			//reset height
			if(child.getAttribute("isMaximisedHeight") == 'true'
				&& child.getAttribute('autofilledY') !== null
			){
				childPosY = parseInt(child.getAttribute("autofilledY"), 10) * disChildDefaultHeight;
				
				childHeight = (parseInt(child.getAttribute('sizey'), 10) + parseInt(child.getAttribute("autofilledY"), 10))*disChildDefaultHeight;
			}
			if(child.getAttribute("isMaximisedHeight") !== 'true'
			){
				childHeight = disChildDefaultHeight;
			}
			
            //set attributes
            child.style.width = childWidth+'px';
            child.style.height = childHeight+'px';
            child.style.left = childPosX+'px';
            child.style.top = childPosY+'px';
            
            //get the loader
            let neighborChildLoader = document.getElementById(child.id+"_layoutLoader");
            if(neighborChildLoader != null){
                //resize the loader
                neighborChildLoader.style.width = childWidth+'px';
                neighborChildLoader.style.height = childHeight+'px';
                neighborChildLoader.style.left = childPosX+'px';
                neighborChildLoader.style.top = childPosY+'px';

                //reposition the loader icon
                let loaderIcon = neighborChildLoader.childNodes[0];
                let loaderWidth = 0.1 * childWidth;
                let loaderHeight = 0.1 * childHeight;
                let loaderDim = loaderWidth >= loaderHeight ? loaderHeight: loaderWidth;
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

		//initialize position grid
		// this.positionGrid = [];
		// for(var l = 0; l < contConfigWidth; l++){
		// 	let row = [];
		// 	for(var h = 0; h < contConfigHeight; h++){
		// 		row.push(0);
		// 	}
		// 	this.positionGrid.push(row);
		// }
		// let _positionGrid = this.positionGrid;
		// var getPositionGrid = function()
		// {
		// 	return _positionGrid;
		// }

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
            layoutChild.id =containerId + "_frame"+index;
            //declare attributes values
            var childWidth = child.sizex * disChildDefaultWidth;
            var childHeight = child.sizey * disChildDefaultHeight;
            var childPosX = (child.posx-1) * disChildDefaultWidth;
			var childPosY = (child.posy-1) * disChildDefaultHeight;
			
			// //mark position occupy
			// for(let l = 0; l < parseInt(child.sizex,10); l++){
			// 	let x = parseInt(child.posx,10) - 1 + l;
			// 	for(let h = 0; h < parseInt(child.sizey,10); h++){
			// 		let y = parseInt(child.posy,10) - 1 + h;
			// 		_positionGrid[y][x] = 1;
			// 	}
			// }
            
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
			layoutChild.setAttribute("isMaximisedHeight", true);
			layoutChild.setAttribute("isMaximisedWidth", true);
			

			//check if vertical resize has been enabled
            if(child.enable_vert_resize
                && child.sizey != 1)
			{ // enabled and the current set height is not set to 1 unit
			
				//create the button
                var vertMinBtn = document.createElement('div');
                vertMinBtn.id = containerId + "_frame"+index+"_vertMinBtn";
				vertMinBtn.classList.add('horiAdjust');
				//create the chevron
				var verMinBtnLabel = document.createElement('i');
				//verMinBtnLabel.classList.add('arrow');
				verMinBtnLabel.classList.add('up');
				vertMinBtn.appendChild(verMinBtnLabel);
				
				//add click handler
                vertMinBtn.addEventListener("click", function(){
                    var rtaEvent = new CustomEvent("realTimeAdjustVert", {
                        detail: {
                            frameId: layoutChild.id,
                            orientation: "vertical",
                        }
                    });
                    container.dispatchEvent(rtaEvent);
                });
                layoutChild.appendChild(vertMinBtn);
				
            }
			
			//check if horizontal left resize has been enabled
            if(child.enable_hor_left_resize
                && child.sizex != 1)
			{ // enabled and the current set length is not set to 1 unit
			
				//create the button
                var horiLeftMinBtn = document.createElement('div');
                horiLeftMinBtn.id = containerId + "_frame"+index+"_horiLeftMinBtn";
				horiLeftMinBtn.classList.add('vertAdjust');
				//create the chevron
				var horiLeftMinBtnLabel = document.createElement('i');
				//horiLeftMinBtnLabel.classList.add('arrow');
				horiLeftMinBtnLabel.classList.add('right');
				horiLeftMinBtn.appendChild(horiLeftMinBtnLabel);
				
				//add click handler
                horiLeftMinBtn.addEventListener("click", function(){
                    var rtaEvent = new CustomEvent("realTimeAdjustHoriLeft", {
                        detail: {
                            frameId: layoutChild.id,
                            orientation: "horizontalLeft",
                        }
                    });
                    container.dispatchEvent(rtaEvent);
                });
                layoutChild.appendChild(horiLeftMinBtn);
				
            }
			
			//check if horizontal right resize has been enabled
            if(child.enable_hor_right_resize
                && child.sizex != 1)
			{ // enabled and the current set length is not set to 1 unit
			
				//create the button
                var horiRightMinBtn = document.createElement('div');
                horiRightMinBtn.id = containerId + "_frame"+index+"_horiRightMinBtn";
				horiRightMinBtn.classList.add('vertAdjust');
				horiRightMinBtn.classList.add('vertRight');
				//create the chevron
				var horiRightMinBtnLabel = document.createElement('i');
				//horiRightMinBtnLabel.classList.add('arrow');
				horiRightMinBtnLabel.classList.add('left');
				horiRightMinBtn.appendChild(horiRightMinBtnLabel);
				
				//add click handler
                horiRightMinBtn.addEventListener("click", function(){
                    var rtaEvent = new CustomEvent("realTimeAdjustHoriRight", {
                        detail: {
                            frameId: layoutChild.id,
                            orientation: "horizontalRight",
                        }
                    });
                    container.dispatchEvent(rtaEvent);
                });
                layoutChild.appendChild(horiRightMinBtn);
				
            }
			
			//check if auto fill has been enabled
			if(child.enable_auto_fill)
			{
				autoFillers.push(layoutChild);
			}
			
			
			//handler the mouseover of the iframe
			layoutChild.addEventListener("mouseover", function(){
					
				let overflowedY = document.getElementById(layoutChild.id).getAttribute("overflowedY") || 0;
				let overflowedX = document.getElementById(layoutChild.id).getAttribute("overflowedX") || 0;

				if(document.getElementById(layoutChild.id+'_vertMinBtn') !== null
					&& !overflowedY
				)
				{
					document.getElementById(layoutChild.id+'_vertMinBtn').style.visibility = "visible";
				}

				if(document.getElementById(layoutChild.id+'_horiLeftMinBtn') !== null
					&& !overflowedX
				)
				{
					document.getElementById(layoutChild.id+'_horiLeftMinBtn').style.visibility = "visible";
				}

				if(document.getElementById(layoutChild.id+'_horiRightMinBtn') !== null
					&& !overflowedX
				)
				{
					document.getElementById(layoutChild.id+'_horiRightMinBtn').style.visibility = "visible";
				}
			
			});
			
			//handler the mouseout of the iframe
			layoutChild.addEventListener("mouseout", function(){
				
				if(document.getElementById(layoutChild.id+'_vertMinBtn') !== null)
					document.getElementById(layoutChild.id+'_vertMinBtn').style.visibility = "hidden";
				
				if(document.getElementById(layoutChild.id+'_horiLeftMinBtn') !== null)
					document.getElementById(layoutChild.id+'_horiLeftMinBtn').style.visibility = "hidden";
				
				if(document.getElementById(layoutChild.id+'_horiRightMinBtn') !== null)
					document.getElementById(layoutChild.id+'_horiRightMinBtn').style.visibility = "hidden";
			});
			
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
		
		var animationInt = 25;
		//append real time adjust handler for horizontal left adjustment
		container.addEventListener("realTimeAdjustHoriLeft", function(e)
		{
			var cont = document.getElementById(e.detail.frameId);
			var contData = cont.data;
			
			var allAffectedAutofillers = [];
			var contPosX = parseInt(cont.getAttribute('posx'), 10);
			var contSizeX = parseInt(cont.getAttribute('sizex'), 10);
			var contPosY = parseInt(cont.getAttribute('posy'), 10);
			var contSizey = parseInt(cont.getAttribute('sizey'), 10);
			var contYBottomBound = contPosY + contSizey;
			
			//iterate all auto fillers
			autoFillers.forEach(function (autoFiller) {
				if(autoFiller.id !== cont.id){
					
					//check if autofiller is within the cont window
					let autoFillerPosY = parseInt(autoFiller.getAttribute('posy'), 10);
					let autoFillerSizeY = parseInt(autoFiller.getAttribute('sizey'), 10);
					let autoFillerBottomBound = autoFillerPosY + autoFillerSizeY;
					let autoFillerPosX = parseInt(autoFiller.getAttribute('posx'), 10);
					let autoFillerSizeX = parseInt(autoFiller.getAttribute('sizex'), 10);
					let autoFillerRightBound = autoFillerPosX + autoFillerSizeX;
					
					if( (contPosY <= autoFillerPosY && autoFillerPosY <= contYBottomBound ) //if auto fill posy is within the cont height
						 && (contPosY <= autoFillerBottomBound && autoFillerBottomBound <= contYBottomBound ) // if auto fill right boundary is within the cont width)
						 && !(autoFillerRightBound < (contPosX)) // if auto fill posx is not after cont
						 
					){
						allAffectedAutofillers.push(autoFiller);
					}
					
				}
			});
			
			if(contData.sizex != 1) // if is not the minimum
            {
				let isMaximisedWidth = cont.getAttribute('isMaximisedWidth');
				isMaximisedWidth = ( isMaximisedWidth==='true' || isMaximisedWidth == null);
				// let posGrid = getPositionGrid();
				
				//adjusting horizontal width
				if( isMaximisedWidth )
				{ // minimizing
			
					let aniIntvId = setInterval(function()
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
							cont.style.left = (parseInt(cont.style.left,10) + animationInt) +'px';
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {

								//set the width
								affectedAutofiller.style.width = (parseInt(affectedAutofiller.style.width,10) + animationInt) +'px'; 
								//set the flag
								affectedAutofiller.setAttribute("autofilledLeft", contPosX + contSizeX -2);
								
								// set flag to prevent maximising
								affectedAutofiller.setAttribute('overflowedX', true);
							});
						}
						else // if next interval size is less than the default height
						{
							//set height to default 1 unit height
							cont.style.width = disChildDefaultWidth+'px';
							let finalPosX = contPosX + contSizeX -2;
							cont.style.left = (finalPosX * disChildDefaultWidth) +'px';
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {

								//set auto filler final width
								affectedAutofiller.style.width = ( (finalPosX) * disChildDefaultWidth) +'px'; 

								//set the delta of being autofilled
								affectedAutofiller.setAttribute("autofilledLeft", contPosX + contSizeX -2);
								
								// set flag to prevent maximising
								affectedAutofiller.setAttribute('overflowedX', true);
							});

							// //reset position occupy
							// for(let l = 0; l < parseInt(contData.sizex,10); l++){
							// 	let x = parseInt(contData.posx,10) - 1 + l;
							// 	for(let h = 0; h < parseInt(contData.sizey,10); h++){
							// 		let y = parseInt(contData.posy,10) - 1 + h;
							// 		posGrid[y][x] = 0;
							// 	}
							// }
							// //mark position occupy
							// for(let l = 0; l < parseInt(contData.sizex,10); l++){
							// 	let x = parseInt(contData.posx,10) - 1 + l;
							// 	for(let h = 0; h < 1; h++){
							// 		let y = parseInt(contData.posy,10) - 1 + h;
							// 		posGrid[x][y] = 2;
							// 	}
							// }
							
							//stop the animation interval
							clearInterval(aniIntvId);
						}
					}, 1);
					
					cont.setAttribute('isMaximisedWidth', false);
					let horiLeftMinBtn = document.getElementById(e.detail.frameId + "_horiLeftMinBtn");
					let horiLeftMinBtnLabel = horiLeftMinBtn.getElementsByTagName("i")[0];
					horiLeftMinBtnLabel.classList.remove("right");
					horiLeftMinBtnLabel.classList.add('left');
					// console.log(posGrid);
				}
				else
				{// maximising
					
					let autofilledSize = cont.getAttribute('autofilledLeft') || 0;

					let aniIntvId = setInterval(function()
                    {
                        if(cont.style.width === (disChildDefaultWidth* (parseInt(contData.sizex) +autofilledSize))+'px'
                            || parseInt(cont.style.width,10) > (disChildDefaultWidth*parseInt(contData.sizex))) //if animation finished
                        {
                            //stop the animation interval
                            clearInterval(aniIntvId);
                        }
                        else if(parseInt(cont.style.width,10) + animationInt < (disChildDefaultWidth*parseInt(contData.sizex))) //continue to animate at interval size
                        {
                            //reduce the width based on the interval size
							cont.style.width = (parseInt(cont.style.width,10) + animationInt) +'px';
							cont.style.left = (parseInt(cont.style.left,10) - animationInt) +'px';
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {
								//set the width
								affectedAutofiller.style.width = (parseInt(affectedAutofiller.style.width,10) - animationInt) +'px'; 
								
								//set the flag
								affectedAutofiller.removeAttribute("autofilledLeft");
								
								// set overflow flag
								affectedAutofiller.removeAttribute('overflowedX');
							});
                        }
                        else // if next interval size is less than the default height
                        {
                            //set height to default 1 unit height
							cont.style.width = (disChildDefaultWidth*(parseInt(contData.sizex)))+'px';
							cont.style.left = (disChildDefaultWidth*(parseInt(contData.posx)-1))+'px';
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {
								//auto filler size x
								var autoFillerSizeX = parseInt(affectedAutofiller.getAttribute('sizex'), 10);
								
								//set auto filler final width
								affectedAutofiller.style.width = ( autoFillerSizeX * disChildDefaultWidth) +'px'; 
								
								//set the delta of being autofilled
								affectedAutofiller.removeAttribute("autofilledLeft");
								
								// set overflow flag
								affectedAutofiller.removeAttribute('overflowedX');
							});
							
                            //stop the animation interval
                            clearInterval(aniIntvId);
                        }
                    }, 1);

					cont.setAttribute('isMaximisedWidth', true);
					let horiLeftMinBtn = document.getElementById(e.detail.frameId + "_horiLeftMinBtn");
					let horiLeftMinBtnLabel = horiLeftMinBtn.getElementsByTagName("i")[0];
					horiLeftMinBtnLabel.classList.remove("left");
					horiLeftMinBtnLabel.classList.add('right');
			
				}
				
			}
			else // if is the minimum already
            {
                // dun resize
            }
		});
		
		//append real time adjust handler for horizontal right adjustment (<==)
		container.addEventListener("realTimeAdjustHoriRight", function(e)
		{
			var cont = document.getElementById(e.detail.frameId);
			var contData = cont.data;
			
			var allAffectedAutofillers = [];
			var contPosY = parseInt(cont.getAttribute('posy'), 10);
			var contSizeY = parseInt(cont.getAttribute('sizey'), 10);
			var contYLeftBound = contPosY + contSizeY;
			var contPosX = parseInt(cont.getAttribute('posx'), 10);
			var contSizeX = parseInt(cont.getAttribute('sizex'), 10);
			
			//iterate all auto fillers
			autoFillers.forEach(function (autoFiller) {
				if(autoFiller.id !== cont.id){
					
					//check if autofiller is within the cont window
					var autoFillerPosY = parseInt(autoFiller.getAttribute('posy'), 10);
					var autoFillerSizeY = parseInt(autoFiller.getAttribute('sizey'), 10);
					var autoFillerYLeftBound =  autoFillerPosY + autoFillerSizeY;
					var autoFillerPosX = parseInt(autoFiller.getAttribute('posx'), 10);
					
					if( (contPosY <= autoFillerPosY && autoFillerPosY <= contYLeftBound ) //if auto fill posy is within the cont height
						 && (contPosY <= autoFillerYLeftBound && autoFillerYLeftBound <= contYLeftBound ) // if auto fill right boundary is within the cont width)
						 && !(autoFillerPosX < (contPosX)) // if auto fill posx is not after cont
						 
					){
						allAffectedAutofillers.push(autoFiller);
					}
					
				}
			});
			
			if(contData.sizex != 1) // if is not the minimum
            {
				var isMaximisedWidth = cont.getAttribute('isMaximisedWidth');
				isMaximisedWidth = ( isMaximisedWidth==='true' || isMaximisedWidth == null);
				
				//adjusting horizontal width
				if( isMaximisedWidth )
				{ // minimizing
			
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
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {

								//set the left
								affectedAutofiller.style.left = (parseInt(affectedAutofiller.style.left,10) - animationInt) +'px'; 
								//set the width
								affectedAutofiller.style.width = (parseInt(affectedAutofiller.style.width,10) + animationInt) +'px'; 
								//set the flag
								affectedAutofiller.setAttribute("autofilledLeft", contSizeX - 1);
								
								// set overflow flag
								affectedAutofiller.setAttribute('overflowedX', true);
							});
						}
						else // if next interval size is less than the default height
						{
							//set height to default 1 unit height
							cont.style.width = disChildDefaultWidth+'px';
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {
								//auto filler size x
								var autoFillerSizeX = parseInt(affectedAutofiller.getAttribute('sizex'), 10);
								//set auto filler final left
								affectedAutofiller.style.left = (parseInt(cont.style.left,10) + disChildDefaultWidth) +'px'; 
								//set auto filler final width
								affectedAutofiller.style.width = ( (contSizeX - 1 + autoFillerSizeX) * disChildDefaultWidth) +'px'; 
								//set the delta of being autofilled
								affectedAutofiller.setAttribute("autofilledLeft", contSizeX - 1);
								
								// set overflow flag
								affectedAutofiller.setAttribute('overflowedX', true);
							});
							
							//stop the animation interval
							clearInterval(aniIntvId);
						}
					}, 1);
					
					cont.setAttribute('isMaximisedWidth', false);
					var horiRightMinBtn = document.getElementById(e.detail.frameId + "_horiRightMinBtn");
					var horiRightMinBtnLabel = horiRightMinBtn.getElementsByTagName("i")[0];
					horiRightMinBtnLabel.classList.remove("left");
					horiRightMinBtnLabel.classList.add('right');
					
				}
				else
				{// maximising
					
					var autofilledSize = cont.getAttribute('autofilledLeft') || 0;

					var aniIntvId = setInterval(function()
                    {
                        if(cont.style.width === (disChildDefaultWidth* (parseInt(contData.sizex) +autofilledSize))+'px'
                            || parseInt(cont.style.width,10) > (disChildDefaultWidth*parseInt(contData.sizex))) //if animation finished
                        {
                            //stop the animation interval
                            clearInterval(aniIntvId);
                        }
                        else if(parseInt(cont.style.width,10) + animationInt < (disChildDefaultWidth*parseInt(contData.sizex))) //continue to animate at interval size
                        {
                            //reduce the width based on the interval size
                            cont.style.width = (parseInt(cont.style.width,10) + animationInt) +'px';
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {
								//set the left
								affectedAutofiller.style.left = (parseInt(affectedAutofiller.style.left,10) + animationInt) +'px'; 
								//set the width
								affectedAutofiller.style.width = (parseInt(affectedAutofiller.style.width,10) - animationInt) +'px'; 
								//set the flag
								affectedAutofiller.removeAttribute("autofilledLeft");
								
								// set overflow flag
								affectedAutofiller.removeAttribute('overflowedX');
							});
                        }
                        else // if next interval size is less than the default height
                        {
                            //set height to default 1 unit height
                            cont.style.width = (disChildDefaultWidth*(parseInt(contData.sizex) +autofilledSize))+'px';
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {
								//auto filler size x
								var autoFillerSizeX = parseInt(affectedAutofiller.getAttribute('sizex'), 10);
								var autoFillerPosX = parseInt(affectedAutofiller.getAttribute('posx'), 10);
								//set auto filler final left
								
								affectedAutofiller.style.left = ((autoFillerPosX -1) * disChildDefaultWidth) +'px'; 
								//set auto filler final width
								if(affectedAutofiller.getAttribute('isMaximisedWidth') === 'true')
									affectedAutofiller.style.width = ( autoFillerSizeX * disChildDefaultWidth) +'px'; 
								else
									affectedAutofiller.style.width = disChildDefaultWidth +'px'; 
								//set the delta of being autofilled
								affectedAutofiller.removeAttribute("autofilledLeft");

								// set overflow flag
								affectedAutofiller.removeAttribute('overflowedX');
								
							});
							
                            //stop the animation interval
                            clearInterval(aniIntvId);
                        }
                    }, 1);
					
					cont.setAttribute('isMaximisedWidth', true);
					var horiRightMinBtn = document.getElementById(e.detail.frameId + "_horiRightMinBtn");
					var horiRightMinBtnLabel = horiRightMinBtn.getElementsByTagName("i")[0];
					horiRightMinBtnLabel.classList.remove("right");
					horiRightMinBtnLabel.classList.add('left');
			
				}
				
			}
			else // if is the minimum already
            {
                // dun resize
            }
			
		});
		
        //append real time adjust handler for vertical adjustment
        container.addEventListener("realTimeAdjustVert", function(e) 
		{
			var cont = document.getElementById(e.detail.frameId);
			var contData = cont.data;
			
			var allAffectedAutofillers = [];
			var contPosX = parseInt(cont.getAttribute('posx'), 10);
			var contSizeX = parseInt(cont.getAttribute('sizex'), 10);
			var contXLeftBound = contPosX + contSizeX;
			var contPosY = parseInt(cont.getAttribute('posy'), 10);
			var contSizey = parseInt(cont.getAttribute('sizey'), 10);
			
			//iterate all auto fillers
			autoFillers.forEach(function (autoFiller) {
				if(autoFiller.id !== cont.id){
					//check if autofiller is within the cont window
					var autoFillerPosX = parseInt(autoFiller.getAttribute('posx'), 10);
					var autoFillerSizeX = parseInt(autoFiller.getAttribute('sizex'), 10);
					var autoFillerXLeftBound =  autoFillerPosX + autoFillerSizeX;
					var autoFillerPosY = parseInt(autoFiller.getAttribute('posy'), 10);

					if( (contPosX <= autoFillerPosX && autoFillerPosX <= contXLeftBound ) //if auto fill posx is within the cont width
						 && (contPosX <= autoFillerXLeftBound && autoFillerXLeftBound <= contXLeftBound ) // if auto fill right boundary is within the cont width)
						 && !(autoFillerPosY < (contPosY + contSizey)) // if auto fill posy is not after cont
						 
					){
						allAffectedAutofillers.push(autoFiller);
					}
				}
			});

			// var allOtherAffectedAutofillers = [];
			// //iterate all other auto fillers
			// autoFillers.forEach(function (autoFiller) {
			// 	if(autoFiller.id !== cont.id){
			// 		//check if autofiller has left or right bound within the cont window
			// 		let autoFillerPosX = parseInt(autoFiller.getAttribute('posx'), 10);
			// 		let autoFillerSizeX = parseInt(autoFiller.getAttribute('sizex'), 10);
			// 		let autoFillerXLeftBound =  autoFillerPosX + autoFillerSizeX;
			// 		let autoFillerPosY = parseInt(autoFiller.getAttribute('posy'), 10);

			// 		let isConsidered = false;
			// 		// if( (contPosX <= autoFillerPosX && autoFillerPosX <= contXLeftBound ) //if auto fill posx is within the cont width
			// 		// 	 && (contPosX <= autoFillerXLeftBound && autoFillerXLeftBound <= contXLeftBound ) // if auto fill right boundary is within the cont width)
			// 		// 	 && !(autoFillerPosY < (contPosY + contSizey)) // if auto fill posy is not after cont
						 
			// 		// ){
			// 		// 	allOtherAffectedAutofillers.push(autoFiller);
			// 		// }

			// 		let alreadyIncluded = false;
			// 		allAffectedAutofillers.forEach(function (mainAutoFiller) {
			// 			if(autoFiller.id !== mainAutoFiller.id){
			// 				alreadyIncluded = true;
			// 			}
			// 		});

			// 		if(isConsidered && !alreadyIncluded ) //is considered for resize and not already included
			// 		{
			// 			allOtherAffectedAutofillers.push(autoFiller);
			// 		}
			// 	}
			// });
			
			if(contData.sizey != 1) // if is not the minimum
            {
				var isMaximisedHeight = cont.getAttribute('isMaximisedHeight');
				isMaximisedHeight = ( isMaximisedHeight==='true' || isMaximisedHeight == null);
				
				//adjusting vertical height
				if( isMaximisedHeight )
				{ // minimizing
					
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
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {
								//set the top
								affectedAutofiller.style.top = (parseInt(affectedAutofiller.style.top,10) - animationInt) +'px'; 
								//set the height
								affectedAutofiller.style.height = (parseInt(affectedAutofiller.style.height,10) + animationInt) +'px'; 
								//set the flag
								affectedAutofiller.setAttribute("autofilledY", contSizey - 1);
								
								// set overflow flag
								affectedAutofiller.setAttribute('overflowedY', true);
							});
						}
						else // if next interval size is less than the default height
						{
							//set height to default 1 unit height
							cont.style.height = disChildDefaultHeight+'px';
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {
								//auto filler size y
								var autoFillerSizeY = parseInt(affectedAutofiller.getAttribute('sizey'), 10);
								//set auto filler final top
								affectedAutofiller.style.top = (parseInt(cont.style.top,10) + disChildDefaultHeight) +'px'; 
								//set auto filler final height
								affectedAutofiller.style.height = ( (contSizey - 1 + autoFillerSizeY) * disChildDefaultHeight) +'px'; 
								//set the delta of being autofilled
								affectedAutofiller.setAttribute("autofilledY", contSizey - 1);
								
								// set overflow flag
								affectedAutofiller.setAttribute('overflowedY', true);
							});
							
							//stop the animation interval
							clearInterval(aniIntvId);
						}
					}, 1);
					
					cont.setAttribute('isMaximisedHeight', false);
					var vertMinBtn = document.getElementById(e.detail.frameId + "_vertMinBtn");
					var vertMinBtnLabel = vertMinBtn.getElementsByTagName("i")[0];
					vertMinBtnLabel.classList.remove("up");
					vertMinBtnLabel.classList.add('down');

				}
				else
				{// maximising
			
					var autofilledSize = cont.getAttribute('autofilledY') || 0;

					var aniIntvId = setInterval(function()
                    {
                        if(cont.style.height === (disChildDefaultHeight* (parseInt(contData.sizey) +autofilledSize))+'px'
                            || parseInt(cont.style.height,10) > (disChildDefaultHeight*parseInt(contData.sizey))) //if animation finished
                        {
                            //stop the animation interval
                            clearInterval(aniIntvId);
                        }
                        else if(parseInt(cont.style.height,10) + animationInt < (disChildDefaultHeight*parseInt(contData.sizey))) //continue to animate at interval size
                        {
                            //reduce the height based on the interval size
                            cont.style.height = (parseInt(cont.style.height,10) + animationInt) +'px';
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {
								//set the top
								affectedAutofiller.style.top = (parseInt(affectedAutofiller.style.top,10) + animationInt) +'px'; 
								//set the height
								affectedAutofiller.style.height = (parseInt(affectedAutofiller.style.height,10) - animationInt) +'px'; 
								//set the flag
								affectedAutofiller.removeAttribute("autofilledY");

								// set overflow flag
								affectedAutofiller.removeAttribute('overflowedY');
								
							});
                        }
                        else // if next interval size is less than the default height
                        {
                            //set height to default 1 unit height
                            cont.style.height = (disChildDefaultHeight*(parseInt(contData.sizey) +autofilledSize))+'px';
							
							//set all affected auto fillers
							allAffectedAutofillers.forEach(function (affectedAutofiller) {
								//auto filler size y
								var autoFillerSizeY = parseInt(affectedAutofiller.getAttribute('sizey'), 10);
								var autoFillerPosY = parseInt(affectedAutofiller.getAttribute('posy'), 10);
								//set auto filler final top
								
								affectedAutofiller.style.top = ((autoFillerPosY -1) * disChildDefaultHeight) +'px'; 
								//set auto filler final height
								if(affectedAutofiller.getAttribute('isMaximisedHeight') === 'true')
									affectedAutofiller.style.height = ( autoFillerSizeY * disChildDefaultHeight) +'px'; 
								else
									affectedAutofiller.style.height = disChildDefaultHeight +'px'; 
								//set the delta of being autofilled
								affectedAutofiller.removeAttribute("autofilledY");

								// set overflow flag
								affectedAutofiller.removeAttribute('overflowedY');
								
							});
							
                            //stop the animation interval
                            clearInterval(aniIntvId);
                        }
                    }, 1);
					
					cont.setAttribute('isMaximisedHeight', true);
					let vertMinBtn = document.getElementById(e.detail.frameId + "_vertMinBtn");
					let vertMinBtnLabel = vertMinBtn.getElementsByTagName("i")[0];
					vertMinBtnLabel.classList.remove("down");
					vertMinBtnLabel.classList.add('up');
				
				}
				
			}
			else // if is the minimum already
            {
                // dun resize
            }
		});
        
    };
   
}