##copyright
__you can not use the source code before the final check by the teacher.__

designed by __wangzhuo__ and __yijia__.

##data source
We use python to get the relationships from Yijia's [renren](http://www.renren.com/339805241) account,and the acount id is 339805241.

We got __name__, __gender__, __account id__ and some other informations. But we found it hard to get the __target__ from Renren, so we developd it by ourselves.You can see the source data in json file.

##description
*   we add [weight] to calculate the out-degree of a person, which shows all the friends of a person.The more friends you have, the deeper of color of black you will own.
*   what's more, we add a function to search one's influence by someone's name. Once you hit the search button, we will show the name in another color, and you will see the influence by the different levels of balck of color.
*   We use BFS method to add influence function.
*   Calculate the [weight] by out-degree.

##Online
View our results at [http://yijia.ws/pages/force_new.html](http://yijia.ws/pages/force_new.html) online.

##offline
To see all effects, we recommand you to use firefox. If you must use chrome, please set your local server.

ex, for python, you can type: __python -m SimpleHTTPServer 8888__, then you can visit [http://localhost:8888](http://localhost:8888).

