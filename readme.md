#下面介绍github的使用方法：
###1. github地址：[Assignment2](https://github.com/vis2014/Assignment2).

###2. 安装git：
+ git工具用来获取远程代码以及提交代码。
+ 下载地址： [git](http://git-scm.com/downloads) 。

###3. 获取github上的代码：
+ 在一个单独的文件夹中，例如E:\git，按住shift同时右键，选择在此处打开命令窗口。依次输入以下命令
+ git clone https://github.com/vis2014/Assignment2.git		//克隆代码,username是vis2014@163.com, password是vis_2014
+ cd Assignment2		//进入文件夹Assignment2
+ git checkout -b *local_name* origin/master	//创建自己的分支，*注意*：local_name替换为自己的名字，格式为LastnameFirstname_LastnameFirstname_A2 

###4. 在Assignment2文件夹中放入自己的完整的代码，包括引用的javascript库等

###5. 修改readme.md文件，在该文件里写作业的介绍，编写该文件使用的是markdown语法，可以上网上查语法格式，也可以参考这篇文章[markdown语法说明](http://wowubuntu.com/markdown/basic.html)

###6. 在以上步骤完成之后可以上传代码，按住shift同时右键，选择在此处打开命令窗口。依次输入以下命令
  + git add . //添加文件
  + git commit -m "注释" //提交到本地，此时会提示要配置用户名和邮箱，按一下命令配置即可
  + git config --global user.name "yourname" 
  + git config --global user.email "your email"    //可以使用邮箱vis2014@163.com
   然后再次执行  git commit -m "注释"    //提交到本地
  + git push origin local_name //注意：和第三步一样，local_name替换为自己的名字，格式为LastnameFirstname_LastnameFirstname_A2，要和上面的local_name保持一致。
   此时会要求输入用户名和密码，username是vis2014@163.com, password是vis_2014

###7. 这时再次查看github的代码，[Assignment2](https://github.com/vis2014/Assignment2)，在自己的分支里就可以看到自己的代码了
