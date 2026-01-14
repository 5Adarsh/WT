const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.urlencoded({ extended: true }));

// =======================
// DATABASE CONNECTION
// =======================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    // 👉 For LOCAL MySQL → password: "your_password"
    // 👉 For WAMP Server → password: ""
    password: "class:13",
    database: "college",
    port: 3306
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");
});

// =======================
// HOME + READ
// =======================
app.get("/", (req, res) => {

    const query = `
        SELECT c.course_id, s.name, s.email, c.subject
        FROM courses c
        JOIN students s ON c.student_id = s.student_id
    `;

    db.query(query, (err, rows) => {
        if (err) throw err;

        let tableRows = rows.map(r => `
            <tr>
                <td>${r.name}</td>
                <td>${r.email}</td>
                <td>${r.subject}</td>
                <td><a href="/delete/${r.course_id}">Delete</a></td>
            </tr>
        `).join("");

        res.send(`
            <h2>Add Student & Course</h2>
            <form method="POST" action="/add">
                <input name="name" placeholder="Student Name" required><br><br>
                <input name="email" placeholder="Student Email" required><br><br>
                <input name="subject" placeholder="Subject" required><br><br>
                <button>Add</button>
            </form>

            <h2>Course Table</h2>
            <table border="1" cellpadding="5">
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Action</th>
                </tr>
                ${tableRows}
            </table>
        `);
    });
});

// =======================
// CREATE (Student + Course)
// =======================
app.post("/add", (req, res) => {
    const { name, email, subject } = req.body;

    // Check student
    db.query(
        "SELECT student_id FROM students WHERE email = ?",
        [email],
        (err, result) => {
            if (err) throw err;

            if (result.length === 0) {
                // Create student
                db.query(
                    "INSERT INTO students (name, email) VALUES (?,?)",
                    [name, email],
                    (err, data) => {
                        if (err) throw err;
                        addCourse(data.insertId);
                    }
                );
            } else {
                addCourse(result[0].student_id);
            }
        }
    );

    function addCourse(studentId) {
        db.query(
            "INSERT INTO courses (subject, student_id) VALUES (?,?)",
            [subject, studentId],
            err => {
                if (err) throw err;
                res.redirect("/");
            }
        );
    }
});

// =======================
// DELETE COURSE
// =======================
app.get("/delete/:id", (req, res) => {
    db.query(
        "DELETE FROM courses WHERE course_id = ?",
        [req.params.id],
        err => {
            if (err) throw err;
            res.redirect("/");
        }
    );
});

// =======================
// SERVER
// =======================
app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});
