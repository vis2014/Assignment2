#include<iostream>
#include<fstream>
#include <vector>
#include <algorithm>
#include<map>
using namespace std;

#define n 10000
typedef pair<int, int> PAIR;
map<int, int> node_map;
map<int, int>::iterator it;
vector<PAIR> tVector;

int cmp(const PAIR &x, const PAIR &y)
{
	return x.second<y.second;
}

void sornode_mapByValue(map<int, int>& node_map, vector<PAIR>& tVector)
{
	for (map<int, int>::iterator curr = node_map.begin(); curr != node_map.end(); curr++)
	{
		tVector.push_back(make_pair(curr->first, curr->second));
	}
	sort(tVector.begin(), tVector.end(), cmp);
}

int ReadFile(int *source, int *target, int *count, char *path)
{
	ifstream fin(path);
	int i = 0, j = 0; //i is the num of edges. j is the map value.
	int k, tag;
	int s, t;
	while (fin >> s >> t)
	{
		if (s == t) continue;
		tag = 0;
		for (k = 0; k<i; k++)
		{
			if (s == target[k] && t == source[k] || s == source[k] && t == target[k])
			{
				tag = 1;
				break;
			}
		}
		if (tag == 1) continue;
		source[i] = s;
		target[i] = t;
		it = node_map.find(s);
		if (it == node_map.end())
		{
			node_map.insert(pair<int, int>(s, j));
			j++;
		}
		count[node_map[s]]++;
		it = node_map.find(t);
		if (it == node_map.end())
		{
			node_map.insert(pair<int, int>(t, j));
			j++;
		}
		count[node_map[t]]++;
		i++;
	}
	fin.close();
	return i;
}

void WriteFile(int *source, int *target, int *count, char *path, int edge_num)
{
	ofstream fout;
	fout.open(path, ios::trunc);

	int i;
	fout << "{";
	fout << "\"nodes\":[";
	for ( i = 0; i < tVector.size(); i++)
	{
		fout << "{\"id\":" << tVector[i].first << ",";
		fout << "\"count\":" << count[node_map[tVector[i].first]] << "}";
		if (i != tVector.size() - 1)
		{
			fout << ",";
		}
	}
	fout << "],";

	fout << "\"edges\":[";
	for (i = 0; i<edge_num; i++)
	{
		fout << "{\"source\":" << node_map[source[i]] << ",";
		fout << "\"target\":" << node_map[target[i]] << "}";
		if (i != edge_num - 1)
		{
			fout << ",";
		}

	}
	fout << "]";

	fout << "}";
	fout.close();

}

int main()
{
	int source[n], target[n], count[n] = { 0 };
	int edge_num;

	edge_num = ReadFile(source, target, count, "bo.dat.gz.txt");

	sornode_mapByValue(node_map, tVector);

	WriteFile(source, target, count, "protein.json", edge_num);


	return 0;
}
