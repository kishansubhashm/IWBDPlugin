package iwbdpChat;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class TestMessage
 */
@WebServlet("/TestMessage")
public class TestMessage extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TestMessage() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
				response.setContentType("application/javascript");
				 response.setCharacterEncoding("UTF-8"); 
				PrintWriter out = response.getWriter();
				System.out.println("in retrieve messages");
//				Scanner sc=new Scanner(System.in);
				String word="noNewMessages\n\n";
//				System.out.println(request.getParameter("title"));
//				System.out.println("from RetrieveMessages servlet");
//				System.out.print("enter any word :");
//				word=sc.next();
//				System.out.println("entered word is :"+word);
				out.print(word);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
