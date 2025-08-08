**TinyURL Clone 🔗**
A simple, fast, and reliable URL shortener that makes sharing links effortless. Create a short link in seconds, generate a QR code for it, and share it anywhere.

**📌 What’s This Project About?**
The idea behind this TinyURL clone is to simplify link sharing. Instead of dealing with long, cumbersome URLs, you can instantly create a concise link and a corresponding QR code. Whether you're sharing on social media, in a document, or just tidying up your links, this tool helps you do it quickly and without any fuss.

**🌐 Live Demo**
You can try the live version here:
tinyurl-chvx.onrender.com

**✨ Key Features**
✂️ Shorten URLs: Instantly convert long URLs into short, shareable links.

📱 QR Code Generation: Automatically generate a QR code for every shortened link.

📊 Click Analytics: (Optional) Track basic click statistics for your links.

🖥️ Responsive Design: Works seamlessly on both desktop and mobile devices.

🌍 Accessible Anywhere: Hosted online for easy access from any location.

**📡 Tech Stack**
Area	Tools & Technologies
Frontend	HTML5, CSS3, JavaScript (Vanilla)
Backend	Node.js, Express.js
Database	MongoDB
APIs	QR Code API, Plotly.js / Chart.js (for analytics)
DevOps	Git, GitHub, Render

**⚠️ A Note on Hosting**
This project is hosted on Render’s free tier, which makes it accessible to everyone. However, please be aware of a few limitations:

Cold Starts: The server may take a few seconds to respond to the first request after a period of inactivity.

Traffic Delays: High traffic might cause temporary slowdowns.

**🛠️ Challenges Faced**
Backend Routing: Setting up robust backend routes for URL creation and redirection without creating conflicts or breaking functionality.

URL Validation: Handling invalid or malformed URLs gracefully to prevent the creation of broken links.

API Integration: Integrating the QR code generation API with minimal impact on frontend load times.

Cross-Browser Compatibility: Ensuring that the shortened links and the user interface work consistently across different browsers and devices.

Secure Deployment: Managing and deploying environment variables securely on the Render platform.

**📚 What I Learned**
This project was a great learning experience. It took about one month of consistent effort from initial design to final deployment. Key takeaways include:

Full-Stack Development: Gained practical experience working with Express.js for route handling and building a full-stack application.

Third-Party APIs: Learned to effectively integrate external services like the QR Code API.

User Input Handling: Mastered form validation techniques to handle user input errors on the server side.

Cloud Deployment: Acquired skills in deploying applications on cloud hosting platforms like Render.

Performance Optimization: Focused on creating a responsive and performant user experience.

**👨‍💻 Made By**
Made with ❤️ by Asim Husain. https://asimhusain.vercel.app

**📄 License**
This project is licensed under the MIT License. Feel free to fork, modify, or build upon it! See the LICENSE file for details.
