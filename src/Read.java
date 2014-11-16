
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class Read {
	public static List<User> read(String filename) throws IOException {
		File file = new File(filename);
		FileReader fr = new FileReader(file);
		List<User> list = new ArrayList<User>();
		BufferedReader br = new BufferedReader(fr);
		while(br.ready()) {
			String line = br.readLine();
			String[] attributes = line.split("	");
			User user = new User();
			user.setSourse(Integer.parseInt(attributes[0]));
			user.setTarget(Integer.parseInt(attributes[1]));
			
//			user.setAge(Integer.parseInt(attributes[1]));
//			user.setName(attributes[0]);
//			user.setCountry(attributes[3]);
//			user.setSex(attributes[2]);
//			user.setForce(Integer.parseInt(attributes[4]));
//			user.setIntellegence(Integer.parseInt(attributes[5]));
			list.add(user);
		}
		return list;
	}
}
