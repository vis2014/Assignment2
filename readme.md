#论文影响关系可视化
###1.data文件夹中，source_data.xml，为原始数据，包含有很多论文的题目，作者，影响关系等信息。source.svg 为使用graphviz工具生成的原始数据的影响力关系图，由于节点数太多需要对其进行聚类处理，cluster.svg是聚类之后的影响力关系图

###2.code文件夹中为代码，对cluster.svg文件中数据进行处理重新画图