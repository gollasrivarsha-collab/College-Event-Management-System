
const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// MYSQL CONNECTION
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "college"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:");
        console.log(err.message);
        return;
    }

    console.log("Connected to MySQL");
});

// GET ALL EVENTS
app.get("/events", (req, res) => {

    db.query(
        `SELECT
            Event_id AS event_id,
            Event_name AS event_name,
            Event_type AS event_type,
            Event_date AS event_date,
            venue,
            description
         FROM events`,

        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.json(result);
        }
    );
});

// GET ONE EVENT
app.get("/events/:event_id", (req, res) => {

    db.query(
        `SELECT
            Event_id AS event_id,
            Event_name AS event_name,
            Event_type AS event_type,
            Event_date AS event_date,
            venue,
            description
         FROM events
         WHERE Event_id=?`,

        [req.params.event_id],

        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.json(result);
        }
    );
});

// INSERT EVENT
app.post("/events", (req, res) => {

    const {
        event_id,
        event_name,
        event_type,
        event_date,
        venue,
        description
    } = req.body;

    db.query(
        `INSERT INTO events
        (Event_id, Event_name, Event_type, Event_date, venue, description)
        VALUES (?, ?, ?, ?, ?, ?)`,

        [
            event_id,
            event_name,
            event_type,
            event_date,
            venue,
            description
        ],

        (err) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.send("Event Inserted");
        }
    );
});

// UPDATE EVENT
app.put("/events/:event_id", (req, res) => {

    const {
        event_name,
        event_type,
        event_date,
        venue,
        description
    } = req.body;

    db.query(
        `UPDATE events
         SET Event_name=?,
             Event_type=?,
             Event_date=?,
             venue=?,
             description=?
         WHERE Event_id=?`,

        [
            event_name,
            event_type,
            event_date,
            venue,
            description,
            req.params.event_id
        ],

        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0) {
                res.status(404).send("Event NOT found");
            }
            else {
                res.send("Event Updated");
            }
        }
    );
});

// DELETE EVENT
app.delete("/events/:event_id", (req, res) => {

    db.query(
        "DELETE FROM events WHERE Event_id=?",

        [req.params.event_id],

        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0) {
                res.status(404).send("Event NOT found to delete");
            }
            else {
                res.send("Event Deleted");
            }
        }
    );
});

// START SERVER
app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});
