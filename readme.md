#Family Relationships Visualizition 
### A brief introduction of our work.
What we have done is to visualize **the relationships between people in a family**. 
The **basic relationships** in family including the relationships between man and wife, parents and children, brothers and sisters, uncle and nephew, which including some complicated network relationships. 
In our visualization tools, we use **a dot** to represent a person, **a line** between dots to represent the relationships between them, which will make it very clear to see the relationships in one family.

### Data resource.
[kinship.data](https://archive.ics.uci.edu/ml/machine-learning-databases/kinship/kinship.data)
**The first source data shows the relationship between everyone**. Each relationship is represented as **relationship (character A, character B)**. 
There are not any lists of people and there are some parts that are redundant (such as not only does the relationship father (A, B) exist but also the relationship son (B, A) exists).

### Programming.
We make a java program in order to deal with the first source data. Including 3 functions: 
+ Transform the first source data into the form that can be distinguished.  
+ Count all people appeared in the relationships and determining the gender and position in the family.  
+ Reduce the redundant data. In addition, there is no need to transform the data into json, so we write it as array variable in javascript.  

### The process of visualization.
+ In the initial interface, there are only some people who are older and some free points that seem to be irrelevant. We use dots in cool colors to represent male characters, dots in warm color to represent female characters. And the size and color of the dots are different to represent people who are in different positions. 
![Figure 1](http://211.147.15.14/UCAS_14_Fall/images/a/ad/WangBingchen_LiuYang_A2_figure1.png)
+ When click on one dot, its children will be displayed. In the meantime the line between the new character and other former characters will be added automatically. Click on the dot again, its children will disappear, including the line.
![Figure 2](http://211.147.15.14/UCAS_14_Fall/images/c/c7/WangBingchen_LiuYang_A2_figure2.png.png)
+ The whole family-relationship network can be seen when all the dots and lines are unfolded.
![Figure 3](http://211.147.15.14/UCAS_14_Fall/images/1/1c/WangBingchen_LiuYang_A2_figure3.png.png)
+ It is possible to choose to emphasize some types of relationships using the drop-down box on the upper left corner.
![Figure 4](http://211.147.15.14/UCAS_14_Fall/images/e/e0/WangBingchen_LiuYang_A2_figure4.png.png)

### Conclusion from visualization.
+ The free points represented do not exist probably because new nodes are added in, which create some new relationships. (It can be seen in the real world, people may obtain new relatives from the marriages of brothers or sisters)
+ It is interesting that these kinds of family-relationship networks are always **symmetric**. (From the pictures we can conclude that family-relationship networks are symmetric, a male node will correspond with a female node)