package node;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import net.sf.json.JSONArray;

public class JavaJsonConvert {
	public static void main(String[] args) throws IOException {
		List<User> users = Read.read("E:/node.txt");
		JSONArray usersJson = javaToJson(users);
//		System.out.println(usersJson);
		for (int i = 0; i < usersJson.size(); i++) {
			writeFile("E:/node_json.txt",usersJson.getString(i));
			if(i!=usersJson.size()-1){
				writeFile("E:/node_json.txt",",");
			}
	
		}
		
		
	}
	public static void writeFile(String filePath, String sets) throws IOException {
	    FileWriter fw = new FileWriter(filePath,true);
	    PrintWriter out = new PrintWriter(fw);
	    out.write(sets);
	    out.println();
	    fw.close();
	    out.close();
	   }


	private static JSONArray javaToJson(List<User> users) {
		return JSONArray.fromObject(users);
	}
	
}
