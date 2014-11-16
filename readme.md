I've tried many other json data.Unfortunately,Some are failed to visualize,left some unknown faults.So I use the sample data to demonstrate interactive force visualization.

*Our purpose is to show the key relationship in this net,which means that the radius of a circle will be bigger if person it represents keeps in touch with more people.*





To run the force.html,if you work under the linux OS,a quick start goes like this:open terminal at your project directory,then print in the command--"python -m SimpleHTTPServer 8888 &" to excute,type "localhost:8888/force.html" in your browser,you will get what you want.

if your OS is windows,the suggestion is download webstorm.




project structure:+ ./d3/d3.js --is the D3 javascript file.
		  
                          + ./force.html-- the main file,I wrote the javascript into the html.There is no isolate javascript.
		                          +./socialnet_	count.json -- the data file.You could change it if you like.Remember to change the data load function in the force.html fils.

