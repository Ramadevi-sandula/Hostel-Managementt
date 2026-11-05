const express = require("express");
const mysql = require("mysql8");
const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "hostel"
});
db.connect(err => {
  if (err) { console.error("MySQL connection error:", err.message); return; }
  console.log("Connected to MySQL database hostel");
});

app.get("/rooms", (req,res) => {
  db.query("SELECT * FROM room", (err, rows) => {
    if(err) return res.status(500).send(err.message);
    res.json(rows);
  });
});
app.get("/rooms/:roomid", (req,res) => {
  db.query("SELECT * FROM room WHERE roomid=?", [req.params.roomid], (err, rows) => {
    if(err) return res.status(500).send(err.message);
    res.json(rows);
  });
});
app.post("/rooms", (req,res) => {
  const {roomid, roomname, block, capacity, status} = req.body;
  db.query("INSERT INTO room(roomid,roomname,block,capacity,status) VALUES(?,?,?,?,?)",
    [roomid,roomname,block,capacity,status], err => {
      if(err) return res.status(500).send(err.message);
      res.send("Room inserted successfully!");
    });
});
app.put("/rooms/:roomid", (req,res) => {
  const {roomname, block, capacity, status} = req.body;
  db.query("UPDATE room SET roomname=?, block=?, capacity=?, status=? WHERE roomid=?",
    [roomname,block,capacity,status,req.params.roomid], (err,result) => {
      if(err) return res.status(500).send(err.message);
      if(!result.affectedRows) return res.status(404).send("Room not found");
      res.send("Room updated successfully!");
    });
});
app.delete("/rooms/:roomid", (req,res) => {
  db.query("DELETE FROM room WHERE roomid=?", [req.params.roomid], (err,result) => {
    if(err) return res.status(500).send(err.message);
    if(!result.affectedRows) return res.status(404).send("Room not found");
    res.send("Room deleted successfully!");
  });
});
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
