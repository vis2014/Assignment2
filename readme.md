#：Dynamic map of China
 
###1. Link to Assignmen2:(http://211.147.15.14/UCAS_14_Fall/index.php/Zhangyuan_Mazhenzhen_A2).

###2. Dataset:
+  city.json:We extract the data in Natural Earth and we just use the name and id for every province.
###3. Package Description:
+  map.js:the javascript file for the main control logic.We design a projection function to transform the longitude and latitude to two-dimensional data.Then we read the data file and draw the map.
+  map.html:the file to generate final visualization.
+  map.css:style for the html file.
###4. Introduction:
+  The map visualization can present the correct location of every province.And each province are made in different colors, we can also drag the mouse to move the location of the selected province. First of all,we download the data set from the internet to construct a JSON file.Then we use the geography and mechanical drawing to implement the map.There is an edge for each province connection with the neighbors.