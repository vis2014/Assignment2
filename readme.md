#Network Using Force Layout
###1. GithubAddress：Assignment](https://github.com/vis2014/Assignment2/tree/LiWenchao_A2 ).

###2. Package Description
It includes:

+ force.html: The main html to embed D3 script.
+ force.css: CSS of the network visualization and the main page.
+ js/d3.js: D3 library.
+ js/force.js: The D3 script to read network data and create visualization.
+ data/graph.json: Data(graph) of Macaque's brain.
+ Screenshot: Three screenshots of this visualization.

###3. Operation of the Network Visualization 
+ Point to the node to zoom in and see its name.
+ Click one node, then its relevant nodes and links will be emphasized.
+ A node will be fixed after dragging it to a position.
+ Double-click to release the node and restore related links.
+ Click the "+" or the "-" button to change the size of the nodes.

###4. Usage and Analysis
+ The sizes of the nodes in the network are initially not the same due to their different weights. We can infer that the "n0", "n1", "n3", "n9", "n16", "n22", "n23", "n27", "n54", "n55", "n63" which in larger size are somehow important.
+ After selecting one node, it's easier for you to find the relevant nodes with the help of the emphasized nodes and links. Take the "n10" as an example, the relevant "n1", "n9", "n63" can be easily found. Besides, if you click the "n54", most of the other nodes are highlighted. So we can speculate that the "n54" is indispensable.
+ In order to have a better observation, you can prevent the force layout from subsequently changing the position of the nodes by fixing them in some place.

###5. Data
+ Data type: JSON.
+ [Network of Macaque's Brain](http://mrbrain.cs.jhu.edu/graph-services/download/ "Brain Network"): The data is transformed to "graph.json".
