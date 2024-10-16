const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

const app = express();
const port = 8080;

// Set up multer for file storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Store uploaded images in the public/images folder
    },
    filename: (req, file, cb) => {
        // Create a unique filename for each uploaded image to avoid conflicts
        cb(null, uuidv4() + path.extname(file.originalname)); 
    }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });


app.use(express.urlencoded({extended:true}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));


// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));


let posts = [
    {
        id: uuidv4(),
        username: "Chetan_Agrawal",
        title: "Insights into Cyber Security.",
        content: "Cyber Security is more critical than ever in today's digital age. Under the expert guidance of Prof. Chetan Agrawal, students delve into the essential strategies and techniques to safeguard systems against cyber threats. From encryption and network security to ethical hacking and risk management, Prof. Agrawal ensures a comprehensive understanding of how to protect information in a constantly evolving digital landscape.",
        image: "/images/cybersecurity.jpg"  // Add the image path her 
    },
    {
        id: uuidv4(),
        username: "Md_sadique",
        title: "🌟 Exciting Opportunity for CSE Students! 🌟",
        content: "I’m thrilled to announce that I’ve been selected as a Contributor for the GirlScript Summer of Code (GSSOC) 2024 - Extended Edition! 🎉💻                                      Although my selection came a bit later than expected, I’m determined to make the most of this opportunity and contribute to impactful open-source projects. 🚀                               🔑 Goals:                                                                                   Learn from industry mentors Contribute to open-source projects Collaborate with talented peers and enhance my skills Grateful for this chance to grow and share what I learn with fellow CSE students! Let’s make it count! 🔥💪",
        image: "/images/sadique.jpg"  // Add the image path her 
    },
    {
        id: uuidv4(),
        username: "Dr.Prachi_Tiwari",
        title: "Guiding the Future with Minor Projects.",
        content: "In the academic journey, minor projects play a pivotal role in applying theoretical knowledge to real-world scenarios. Under the guidance of Prof. Prachi Tiwari, students explore innovative ideas and develop hands-on solutions to practical problems. These projects not only enhance technical skills but also foster creativity and teamwork. Prof. Tiwari’s mentorship ensures that every student learns to turn their concepts into functional prototypes, making a lasting impact in their respective fields.",
        image: "/images/minorproject.jpg"  // Another example
    },
    {
        id: uuidv4(),
        username: "Dr.Darshna_Rai",  
        title: "Mastering Data Base Management System",
        content: "The study of Database Management Systems (DBMS) is essential for managing vast amounts of data efficiently. With Prof. Darshna Rai’s expert guidance, students gain deep insights into the core concepts of DBMS, including data modeling, SQL, normalization, and transaction management. Prof. Rai emphasizes both theoretical knowledge and practical application, helping students to develop a robust understanding of how data is structured, stored, and manipulated in databases, preparing them for real-world database management challenges.",
        image: "/images/dbms.jpg"
    },
    {
        id: uuidv4(),
        username: "Parmila_Lovanshi",
        title: "Exploring the Digital World.",
        content: "In the era of the internet, understanding web technology is crucial. Under the guidance of Prof. Parmila Lovanshi, students are introduced to the essential tools and techniques for building modern websites and web applications. From mastering HTML, CSS, and JavaScript to diving into server-side technologies, Prof. Lovanshi equips students with the skills needed to create functional, responsive, and dynamic web experiences. Her hands-on approach ensures that students not only learn the theory but also gain practical experience in the fast-evolving world of web development.",
        image: "/images/web.jpg"
    },
    {
        id: uuidv4(),
        username: "Pooja_Mina",
        title: "Understanding Digital Systems.",
        content: "Digital systems form the backbone of modern electronics, and under the expert guidance of Prof. Pooja Mina, students explore the core concepts that power everything from computers to smartphones. The subject of Digital Systems introduces students to binary arithmetic, logic gates, flip-flops, and the design of combinational and sequential circuits. Prof. Mina ensures that students not only grasp theoretical knowledge but also gain practical skills in designing and analyzing digital circuits, preparing them for the evolving world of electronics and embedded systems.",
        image: "/images/digital.jpg"
    },
    {
        id: uuidv4(),
        username: "Divya_Eveny",
        title: "Evaluating Internship Experiences.",
        content: "Internships are a vital part of a student’s academic journey, providing hands-on experience in real-world settings. Prof. Divya Eveny’s course on the Evaluation of Internship focuses on assessing the skills and growth of students during their internships. This subject helps students reflect on their learning experiences, analyze their contributions, and understand the key takeaways that will shape their future careers. Prof. Eveny’s guidance ensures that students gain the skills necessary for both self-assessment and feedback from mentors, enabling them to improve and excel in their professional paths.",
        image: "/images/internship.jpg"
    },
];

// Route to view all posts
app.get("/posts",(req,res)=>{
   res.render("index.ejs",{posts});
});

// Route to show form for creating new post
app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
});

// Post route to handle form submission with image upload
app.post("/posts", upload.single('image'), (req, res) => {
    let { username, content, title } = req.body;
    let image = req.file ? `/images/${req.file.filename}` : ''; // Get the image path if uploaded

    // Add the new post with image URL
    let id = uuidv4();
    posts.push({ id, username, content, title, image });

    res.redirect("/posts");
});

// Route to view a specific post
app.get("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p) =>id === p.id);
    console.log(post);
    res.render("show.ejs",{post});
});

// Route to edit a post
app.patch("/posts/:id",(req,res) =>{
    let {id} =req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    console.log(post);
    console.log(id);
    res.redirect("/posts");
});

// Route to handle post update
app.get("/posts/:id/edit",(req,res) =>{
    let {id} =req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs",{post});
});

// Route to delete a post
app.delete("/posts/:id",(req,res) =>{
    let {id} =req.params;
    posts = posts.filter((p) => id != p.id);
    res.redirect("/posts");
});



// Start the server
app.listen(port,()=>{
    console.log("app is listining on port 8080");
});