#Assignment II: Network of Trade Partnership 
###1.GitHub Link: https://github.com/vis2014/Assignment2/tree/YangLan_SongYunhong_A2

###2.Introduction
+ This is our first time to design a network visualization. Thus, we learnt the examples on the D3 and searched data on the Internet at first. Then the relationship between trade partnership and GDP of nations attracts us. We use ''Webstorm'' to fulfill our network visualization. From it, we can get the information about trade relationship among over 50 nations in 2011 more directly. What's more, we draw some conclusion through it.

###3.Data Source
+ Data Source:http://data.worldbank.org/
+ We found the data of trade partnership and GDP rank on the World Bank. First, we chose nations whose GDP ranks in the top 50.Then we find out them main import partners and reduce redundant data. Finally, we transformed the data to "nation_trade.json".  

###4.Package Description
+ data.xlsx:the original data.
+ d3.js:D3 library.
+ nation_trade.css:CSS of the network visualization and the main page.
+ nation_trade.html:the html to embed D3 script.
+ nation_trade.js:the D3 script to read network data and create visualization.
+ nation_trade.json:data of trade partnership.

###5.Visualization Usage
+ In the visualization, each dot stands for a nation. When you change the screening conditions, the visualization would change.
+ When you put the mouse on the dot, the color of dot would become black. And the dot of color would become the former when the mouse leaves.
+ When you select one dot, the edges between the dot and the dots related to it would become dark. Meanwhile, the size of the selected dot rises to twice and the size of dots that stands for nations importing from it also do.
+ You can drag dots to see the details of visualization more clearly.

