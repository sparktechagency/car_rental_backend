const bookingTemp = (data) =>
  ` 
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f2f3f8;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
              }
              .nardo-logo {
                text-align: center
              }
              .logo {
                max-width: 150px;
                margin-bottom: 20px;
              }
              h1 {
                color: #1a73e8;
                font-size: 26px;
                margin-bottom: 20px;
                font-weight: bold;
                text-align: center;
              }
              p {
                color: #555555;
                line-height: 1.8;
                font-size: 16px;
                margin-bottom: 20px;
              }
              table {
                width: fit-content;
                border-collapse: collapse;
                margin: 20px 0;
              }
              table th, table td {
                padding: 12px;
                text-align: left;
                border: 1px solid #ddd;
              }
              table th {
                background-color: #f2f3f8;
                font-weight: bold;
              }
              .footer {
                margin-top: 30px;
                font-size: 13px;
                color: #9e9e9e;
                text-align: center;
              }
              .footer p {
                margin: 5px 0;
              }
              a {
                color: #1a73e8;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="nardo-logo">
                <img src="https://res.cloudinary.com/dhn7jffxh/image/upload/v1738644091/nardo_pftciu.png" alt="Nardo Logo" class="logo" />
              </div>
              <h1>Trip Confirmation</h1>
              <p>Hello, ${data.name},</p>
              <p>New booking from <strong>Nardo</strong>. Here are your Trip details:</p>
              
              <table>
                <tr>
                  <th>Transaction ID</th>
                  <td>${data.transactionId || "N/A"}</td>
                </tr>              
                <tr>
                  <th>Host Name</th>
                  <td>${data.hostName}</td>
                </tr>
                <tr>
                  <th>Car Name</th>
                  <td>${data.carName}</td>
                </tr>
                <tr>
                  <th>Rent Start Time</th>
                  <td>${data.startDateTime}</td>
                </tr>
                <tr>
                  <th>Rent End Time</th>
                  <td>${data.endDateTime}</td>
                </tr>
                <tr>
                  <th>Pickup Location</th>
                  <td>${data.pickupLocation}</td>
                </tr>
                <tr>
                  <th>Return Location</th>
                  <td>${data.returnLocation}</td>
                </tr>
                <tr>
                  <th>Total Price</th>
                  <td>£${data.price}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>${data.status}</td>
                </tr>
              </table>

              <p>We hope you enjoy your ride. If you have any questions, feel free to contact us at <a href="mailto:nardolimited@gmail.com">nardolimited@gmail.com</a>.</p>
              <p>Best regards,<br>The Nardo Team</p>
            </div>
            <div class="footer">
              <p>&copy; Nardo - All Rights Reserved.</p>
              <p><a href="https://yourwebsite.com/privacy">Privacy Policy</a> | <a href="https://yourwebsite.com/contact">Contact Support</a></p>
            </div>
          </body>
        </html>
      `;

module.exports = bookingTemp;
