# View-Layout-Client
A JavaScript library that renders a layout for your page or section of page based on a configuration. View-Layout-Client is developed to assist developers to organise their page sections and load their different pages with more ease. This library is written in vanilla JavaScript using JavaScript DOM APIs. 

## Getting Started

Download view-layout-client.js and include the script to your script directory/location

### Steps to Setting Up
1. Include the view-notifier.js JavaScript library in your page.
```
<script src="javascript/view-layout-client.js" type="text/javascript"></script>
```

2. Define your layout configurations
```
 var configuration = {
	"colsizex":"5",
	"colsizey":"5",
	"grid":[
		{
			"posx":"1",
			"posy":"1",
			"sizex":"1",
			"sizey":"1",
			"content":"http://www.google.com"
		},
		{
			"posx":"2",
			"posy":"1",
			"sizex":"2",
			"sizey":"1",
			"content":"http://www.google.com"
		},
		{
			"posx":"2",
			"posy":"2",
			"sizex":"2",
			"sizey":"1",
			"content":"http://www.google.com"
		},
		{
			"posx":"2",
			"posy":"3",
			"sizex":"2",
			"sizey":"2",
			"content":"http://www.google.com"
		}
	]
}
```
   Configuration Definitions
   - colsizex : Horizontal grid count of the page/section (Container)
   - colsizey : Vertical grid count of the page/section (Container)
   - grid     : This contains an array of all the grid configurations for the page/section
    - posx    : The horizontal grid position in the (Container)
    - posy    : The vertical grid position in the (Container)
    - sizex   : The horizontal size of the grid section (Based on the colsizex of the Container)
    - sizey   : The vertical size of the grid section (Based on the colsizex of the Container)
    - content : The page to be loaded into this grid

3. Create your container element in your page
```
<div id='testContainer'></div>
```
The library will adjust the size of the section based on the size of the container element you set.

4. Register your layout configurations with View-Layout-Client to the container element
```
const vClient = new ViewLayoutClient();
vClient.render(configuration, 'testContainer');
```

## Sample
https://jsfiddle.net/tqwdan82/rck58z9d/
Shows the sample based on the setup steps. There are some minor differences from the sample.

The sample will not function correctly since it is trying to load 'www.google.com'. The content should be set to your page when deployed in a webserver. The expected error will be "Refused to display 'https://www.google.com/' in a frame because it set 'X-Frame-Options' to 'sameorigin'.".

## Built With

* [Visual Code] - IDE
* [NodeJs HTTP Server] - Webserver

## Authors

* **TQW** - *Initial work* - [tqwdan82](https://github.com/tqwdan82)
* **TQW** - *Version 1.0.1* - [tqwdan82](https://github.com/tqwdan82)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project, if any.

## Note
The loading of content is done by using ```<iframe>```. Thus, it may not work in all browsers.

## License

This project is free to use.
