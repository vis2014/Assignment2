#include <iostream>
#include <fstream>
#include <stdlib.h>

using namespace std;

int  main()
{
    //读取边数据
    std::ifstream rfile("edges_data.txt",std::ios::in);
    string str;
    char starget[3000][10];
    int value[100]={0};
    int i,j,m=0,n;
    /*while(getline(rfile,str))
    {
        j=1;
        i=0;
        while(str[i])
        {
            if(str[i]=='"')
            {
                j++;
                if(j%2==0)
                {
                    n=0;
                    while(str[i+n+1]!='"')
                    {
                        starget[m][n]=str[i+n+1];
                        n++;
                    }
                    m++;
                }
            }
            i++;
        }
    }*/
    while(getline(rfile,str))
    {
        i=0;
        while(str[i])
        {
            if(str[i]=='n')
            {
                n=0;
                while(str[i+n+1]!='"')
                {
                    starget[m][n]=str[i+n+1];
                    n++;
                }
                m++;
            }
            i++;
        }
    }
    rfile.close();

    for(i=0;i<m;i++)
    {
        value[atoi(starget[i])]++;
    }


    //写入边数据
    std::ofstream file("edges.txt",std::ios::out|std::ios::ate);
    i=0;
    while(i<m)
    {
        //file<<starget[i]<<endl;
        //std::cout<<starget[i]<<std::endl;
        file<<"{ \n\"count\":\"1\",\n\"source\":"<<starget[i]<<",\n"<<"\"target\":"<<starget[i+1]<<"\n},\n";
        i=i+2;
    }
    file.close();


    //读取节点数据
    std::ifstream rfile2("nodes_data.txt",std::ios::in);
    string str2;
    char nodes[100][200];
    m=0;
    while(getline(rfile2,str2))
    {
        j=1;
        i=0;
        while(str2[i])
        {
            if(str2[i]=='"')
            {
                j++;
                if(j%2==0)
                {
                    n=0;
                    while(str2[i+n+1]!='"')
                    {
                        nodes[m][n]=str2[i+n+1];
                        n++;
                    }
                    m++;
                }
            }
            i++;
        }
    }


    rfile2.close();

    //写入节点数据
    std::ofstream file2("nodes.txt",std::ios::out|std::ios::ate);
    i=0;
    while(i<m)
    {
        //file<<starget[i]<<endl;
        std::cout<<nodes[i]<<std::endl;
        file2<<"{\n\"id\":\""<<nodes[i]<<"\",\n\"value\":"<<value[i]<<"\n},\n";
        i++;
    }
    file2.close();
    return 0;
}
