#The relationships among the heroes in Frozen Throne analysis

##Presented by Jiaozekun && Chenwenbin


This is a visualization we have done to show the complex relationships among the heroes from Frozen Throne in two different ways with the D3 tool.Our dataset is downloaded from the official website of WarCraft 3.We use two kinds of graph to find more insights in these data.

###1. Dataset:
+ We collect all the data manually on http://www.blizzcn.com/html/moshouzhengba3_WarCraft_/index.html and we orginzed the dataset in json files ourselves.
+ From the above data,we can acknowledge the characteristics of every hero,and we can find which race does the hero we are interested in come from,and we can also acknowledge the relationship between each of the two heroes.
+ We found 21 heroes in Frozen Throne,it is only a little part of heroes in World of Warcraft,but we found we can use the 21 heroes to summarize the world.

###2.Package Description：
+ tree.html: The html to show the four different races of the world.
+ test.html: The main html to show the relationship of the heroes.
+ relationship.js and relationship1.js: The javascript file which is the description of each hero and show the relationships among them. 
+ tree.js: The javascript file tells us the different races of heroes.
+ style.css: Style for the html file.
+ js/d3.js: D3 library
+ force_new.js: The javascript file to generate the force graph.
+ tree.js: The javascript file to generate the tree graph.
###3. Instruction and Interaction:
####Four different races
+ The first paragraph (tree.html) shows the different races in the world of warcraft, and which race does each hero belongs to.
+ The four races in Frozen Throne are Human, Night Elf, Orchid and Undead,there are also eight neutral heroes.    
+ We use the tree graph to show the race relationship because the tree graph can show classification easily.It is very easy to find out whether two heroes belong to the same race.
+ We add a link to the next graph at the top of the tree graph.
####The relationships among heroes
+ test.html shows the relationships among heroes.We use a force graph as a visualization.
+ We use heroes’ pictures to represent them. The different colors of heroes on the picture also represent different races. 
+ As is shown,the lines between each two heroes represent the relationship between the two heroes,the different colors represent different relationships. We use red to represent the relationship such an “敌对”,and other colors represent the relationship such as “恋人”,”兄弟”,”主仆”,”盟友”.
+ When we put our mouse on the picture,there will appear the description of the hero on the right,and it will also show the relationships between this hero and others.

###4.Findings and Insights
+ From the tree we can find that there are four heroes in each race,we can guess that the force of each race is relatively balanced,for example ,the power of Human is almost the same as that of the Undead,so if the Undead want to debate Human,he will must turn to another race for help,and it explains why different races unite as a team to defeat another.  
+ We can also find that there are eight neutral heroes in the tree graph,we can believe that the neutral heroes also play an important role in the world of warcraft.
+In the second graph which shows the relationships among heroes we can find there are very complex relationships,but we can find that deathknight and demonhunter have the most relationships with other heroes,so we can believe that deathknight and demonhunter are the most important two heroes in the world of warcraft,and most of stories are related to them.We can also find that most heroes from Human and Night Elf are the enemies of deathknight,so we can explain why Human and Night Elf get united as a union.
+ We can also in the force graph that neutral heroes also complex relationships with other heroes,it explains that neutral heroes play an important role in the world just as what we have found in the tree graph,but we can see pandarenbrewmaster has no relationship with others,that’s why? We can find the answer in the description of panda,it says panda is only interested in the wine and he is kindly.

###5. Environment:
+ Please open the **tree.html** and click the links on this page to see two more graphs.As for browser,Chrome is recommended.
