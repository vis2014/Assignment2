
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import org.json.JSONArray;  
 
import org.json.JSONException;  
  
import org.json.JSONObject;  
  
   
  
public class TestJson {  
  
   public static void main(String[] args) throws JSONException {  
	   File file = new File("D:/raw.csv");  
	   File dest = new File("D:/data.json"); 
	   JSONObject obj=new JSONObject();
	   JSONArray edges=new JSONArray();
	   JSONArray nodes=new JSONArray();
	   JSONObject edgesAttr=new JSONObject();
	   JSONObject nodesAttr=new JSONObject();
	    JSONArray edge=new JSONArray();
	    JSONObject obj1=new JSONObject();
	   edgesAttr.put("name", "count");
	   edgesAttr.put("type", "int");
	   edge.put(edgesAttr);
	   edgesAttr=new JSONObject();
	   edgesAttr.put("name", "source");
	   edgesAttr.put("type", "int");
	   edge.put(edgesAttr);
	   edgesAttr=new JSONObject();
	   edgesAttr.put("name", "target");
	   edgesAttr.put("type", "int");
	   edge.put(edgesAttr);
	   edgesAttr=new JSONObject();
	   edgesAttr.put("name", "time");
	   edgesAttr.put("type", "int");
	   edge.put(edgesAttr);
	   obj1.put("edges", edge);
	   
	   edge=new JSONArray();
	   nodesAttr.put("name", "number");
	   nodesAttr.put("type", "string");
	   edge.put(nodesAttr);
	   nodesAttr=new JSONObject();
	   nodesAttr.put("name", "address");
	   nodesAttr.put("type", "string");
	   edge.put(nodesAttr);
	   nodesAttr=new JSONObject();
	   nodesAttr.put("name", "ISP");
	   nodesAttr.put("type", "string");
	   edge.put(nodesAttr);
	   obj1.put("nodes", edge);
	   obj.put("schemas", obj1);
	   try {  
	       InputStreamReader read = new InputStreamReader(new FileInputStream(file),"UTF-8");
	       BufferedReader reader=new BufferedReader(read);
	       BufferedWriter writer  = new BufferedWriter(new FileWriter(dest));  
	       String line =null;
	       int ans=0;
	       while((line=reader.readLine())!=null){  
	           line = reader.readLine(); 
	           if(line==null)break;
	           String[]cols=line.split(",");
	           edgesAttr=new JSONObject();
	           nodesAttr=new JSONObject();
	           int source=-1;
	           int target=-1;
	           int l=nodes.length();
	           for(int i=0;i<l;i++){
	        	   JSONObject n=(JSONObject) nodes.get(i);
	        	   if(n.get("number").equals(cols[1])){
	        		   source=i;
	        	   }
	        	   if(n.get("number").equals(cols[2])){
	        		   target=i;
	        	   }
	           }
	           if(source==-1){
	           nodesAttr.put("number", cols[1]);
	           nodesAttr.put("ISP", cols[3]);
	           nodesAttr.put("address", cols[5]);
	           nodes.put(nodesAttr);
	           source=ans++;
	           }
	           if(target==-1){
	           nodesAttr=new JSONObject();
	           nodesAttr.put("number", cols[2]);
	           nodesAttr.put("ISP", cols[4]);
	           nodesAttr.put("address", cols[6]);
	           nodes.put(nodesAttr);
	           target=ans++;
	           }
	           l=edges.length();
	           boolean flag=false;
	           for(int i=0;i<l;i++){
	        	   JSONObject o=(JSONObject)edges.get(i);
	        	   if(o.get("source").equals(source)&&o.get("target").equals(target)){
	        		   int count=o.getInt("count");
	        		   o.put("count", count+1);
	        		   flag=true;
	        		   break;
	        	   }
	           }
	           if(!flag){
	           edges.put(edgesAttr);
	           edgesAttr.put("source", source);
	           edgesAttr.put("target", target);
	           edgesAttr.put("time", Integer.parseInt(cols[7]));
	           edgesAttr.put("count", Integer.parseInt(cols[8]));
	           }
	       }  
	       obj.put("edges", edges);
	       obj.put("nodes", nodes);
	       writer.write(obj.toString());
	       reader.close();  
	       writer.close();  
	   } catch (FileNotFoundException e) {  
	       e.printStackTrace();  
	   } catch (IOException e) {  
	       e.printStackTrace();  
	   } catch (JSONException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}  
     
  
}  
