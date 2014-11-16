###data source
A visualization of similarity between movies by means of a network graph
+ Similarity data taken from PopCha! recommender engine 
+ Movie info from The Movie Database
+ Visualization done in JavaScript with D3.js

###desciption
Each circle is a movie; It is linked to the set of movies most similar to it according to our engine (and therefore to PopCha! users). The size of the circle represents how it is valued by PopCha! users.
+ Hover over a node to see the movie title, and to highlight the movies related to it.
+ Click on a node to show movie details and center the graph on that movie. It will open up a side panel.
+ On the movie details panel, clicking on the link to a related movie will move to that movie (in the graph and in the panel)
+ You can use you usual browser controls to zoom and pan over the graph. 
+ Above a certain zoom level, movie titles are automatically displayed for all the nodes.



