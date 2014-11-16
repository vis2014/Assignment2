@@ -0,0 +1,23 @@
#rhesus_interareal.cortical.network
###1.Introduction
+ this visualization shows the relationships among different parts of a rhesus’s brain. Each part of the brain is abstracted into a node, and the ecological signals between them is their edges. We get the data from [MROCP](http://mrbrain.cs.jhu.edu/graph-services/download/). And visualize it with force lay-out. Several interactions is included to allow you to get closer to the data. We hope you enjoy it.

###2.Dataset Discription
+ The dataset comes from MROCP(Magnetic Resonance One-Click Pipleline), which is an open source project that provides Web services to build and perform scientifically interesting computations on Connectome and general graphs. The data contains 93 nodes and 2667 edges, both of them have several properties like id, weights, atc.  We doload our data from [here](http://mrbrain.cs.jhu.edu/graph-services/download/). 

###3.What we do
+ We get the data in form of .dot, and translate it into json with [a java project](http:\\). Force-directed lay-out is our choice to make the visualization more clear and interesting. Several interactions(like drag, click, selected and atc.) is involved. The visualization of whole data can be shown in the picture below. See more details, please click here() to see our assignment report on wiki.

###4.Contact us
+ Email: liyuepei14@mails.ucas.ac.cn
+ Copyright @ LiYuepei & WangHailu.

@@ -0,0 +1,23 @@
#下面介绍github的使用方法：
###1. github地址：[Assignment3](https://github.com/vis2014/Assignment3).

###2. 安装git：
+ git工具用来获取远程代码以及提交代码。
+ 下载地址： [git](http://git-scm.com/downloads) 。

###3. 获取github上的代码：
+ 在一个单独的文件夹中，例如E:\git，按住shift同时右键，选择在此处打开命令窗口。依次输入以下命令
+ git clone https://github.com/vis2014/Assignment3.git		//克隆代码,username是vis2014@163.com, password是vis_2014
+ cd Assignment3		//进入文件夹Assignment3
+ git checkout –b *local_name* origin/master	//创建自己的分支，*注意*：local_name替换为自己的名字，格式为LastnameFirstname_LastnameFirstname_A3 

###4. 在Assignment3文件夹中放入自己的完整的代码，包括引用的javascript库等

###5. 修改readme.md文件，在该文件里写作业的介绍，编写该文件使用的是markdown语法，可以上网上查语法格式，也可以参考这篇文章[markdown语法说明](http://wowubuntu.com/markdown/basic.html)

###6. 在以上步骤完成之后可以上传代码，按住shift同时右键，选择在此处打开命令窗口。依次输入以下命令
+ git add . 	//添加文件
+ git commit -m "注释" //提交到本地
+ git push origin *local_name*	//*注意*：和第三步一样，local_name替换为自己的名字，格式为LastnameFirstname_LastnameFirstname_A3，要和上面的local_name保持一致,username是vis2014@163.com, password是vis_2014

###7. 这时再次查看github的代码，[Assignment3](https://github.com/vis2014/Assignment3)，在自己的分支里就可以看到自己的代码了