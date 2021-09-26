module.exports = {
  async up(db, client) {
    await db.collection("emails").insertOne({
      unqId: "8d5ed24c-8088-4414-9fcc-dd8556b84f21",
      emailName: "OTP_HOUSEMATE",
      source: "HTML",
      htmlbody: `
        <!doctype html>
<html lang="en">
  <head>
    <title>Title</title>
    
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  </head>
  <body style="background-color: #5CDB95">
      
    
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

    
    <div class="container-fluid">
        <div class="row m-4" style="background-color: #EDF5E1; color: #05386B">
            <div class="col-4">            
                <h1> OTP is {{OTP_VAL}} </h1>
                <h5>The otp will be valid for {{OTP_DURATION}} {{OTP_UNITS}}.</h5>
            </div>
        </div>
    </div>
    
  </body>
</html>
      `,
      textbody: null,
      placeholders: ["OTP_VAL", "OTP_DURATION", "OTP_UNITS"],
    });
  },

  async down(db, client) {
    await db
      .collection("emails")
      .deleteOne({ unqId: "8d5ed24c-8088-4414-9fcc-dd8556b84f21" });
  },
};
