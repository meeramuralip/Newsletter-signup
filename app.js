const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

mailchimp.setConfig({
  apiKey: "86bfae3d68faf60b592516b26d382be1-us9",
  server: "us9"
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")

});

app.post("/", function(req, res) {
  var fName = req.body.firstName;
  var lName = req.body.lastName;
  var email = req.body.emailId;

  var subscribingUser = {
    firstname: fName,
    lastname: lName,
    email: email
  };

  var listId = "3269537f77";

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstname,
        LNAME: subscribingUser.lastname
      }

    })

  res.sendFile(__dirname+ "/success.html");


  }


run().catch(e =>res.sendFile(__dirname + "/fail.html"))

});


app.post("/fail", function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("server is open on port ");
});
