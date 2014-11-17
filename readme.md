Adolescent Social Network
=====================================
# DATA
1.	Dataset linked list formats of friendship choices made by students from a community in USA. The community contains 2 junior high schools. The numbers of students in this community is 457. 
2.	Friendship choices and value of links: 
(1) Each student was given a paper-and-pencil questionnaire and a copy of a roster listing every student in the school and the students were provided with the roster of the "sister" school as well. The name generator asked about five male and five female friends separately. The question was, "List your closest (male/female) friends. List your best (male/female) friend first, then your next best friend, and so on. (girls/boys) may include (boys/girls) who are friends and (boy/girl) friends."
(2) For each friend named, the student was asked to check off whether he/she participated in any of five activities with the friend. These activities were: 
1. You went to (his/her) house in the last seven days.
2. You met (him/her) after school to hang out or go somewhere in the last seven days.
3. You spent time with (him/her) last weekend.
4. You talked with (him/her) about a problem in the last seven days.
5. You talked with (him/her) on the telephone in the last seven days.
These activities were summed to create a valued network. Ties range in value from 1, meaning the student nominated the friend but reported no activities, to 6, meaning the student nominated the friend and reported participating in all five activities with the friend.
3.	Individual characteristics: 
Race is varied from White, Black, Hispanic, Asian and mixed/other. Gender is marked and grade is recorded as a number between 7 and 12. And school codes are “a” and “b” because two schools were in a single community.
4.	Reference: 
Moody, James, "Peer influence groups: identifying dense clusters in large networks," Social Networks, 2001, 23: 261-283.

# VISUALIZATION:
We code the data into network visualization by JavaScript, with force lay-out as our formwork
( for more details, here is an [introduction](https://github.com/mbostock/d3/wiki/Force-Layout) ). There are 457 nodes and 2158 links in the data file (as 457 students and 2158 relationships).
1.	First of all, the original VIS (screenshot 1) shows all friendship links between students and the two clusters which were generated from the VIS program indicate two different schools. We can jump to the conclusion that consistent with our common sense students in same school are more likely to make friends.
2.	As you can see in the top left corner, a search box is provided that you can enter any name varied from P1 to P457 to locate in a specific case. Firstly node and links of the case is highlighted and then others’ will emerge. Also, you can hover over a node to see it name.  
3.	We can slide the intimacy bar (below the search box) left or right to adjust the showed value of links. The beautiful VIS (screenshot 3) shows a clear picture of friendship links between students when the intimacy is larger than 3. The intimacy is represented by value described above and the high the intimacy is, the link between two students are closer. When intimacy increased from 0 to 3, center of the circle became the nodes and links of students who have strong ties with others.
4.	As the number of friends that students were asked to list ranged from 0 to 10, one click on a node will show us its links by fading the rest dots and lines, which is we can figure out anyone’s friends and their intimacy by these functions. The calculated average links is 5.2, which means that the average number of friends a student have in this community is 5. Compared to the average the students who have less than 5 friends in the VIS when intimacy is 0 should be pay attention to in case he/she needs some psychological concern.
5.	Below the bar of intimacy, we list colors used to differ races. By using the click function, we check several nodes and rarely find racial barrier between different races. It is consistent with our knowledge that America is a nation of immigrants and reminds us that J. Hector St. John de Crèvecoeur, a French writer who lived for many years in New York wrote 225 years ago that in America, "individuals of all nations are melted into a new race."







