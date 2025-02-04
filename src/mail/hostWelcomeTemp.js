const hostWelcomeTemp = (data) => `
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
        .nardo-logo{
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
        <h1>Congratulations on Becoming a Host!</h1>
        <p>Hello ${data.user},</p>
        <p>We're thrilled to inform you that your car submission has been approved by our admin team.</p>
        <p>You are now officially a <strong>Host</strong> on Nardo! To access all host privileges and manage your car listings, please log out and log back in.</p>
        <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:nardolimited@gmail.com">nardolimited@gmail.com</a>.</p>
        <p>Happy Hosting!<br><strong>The Nardo Team</strong></p>
      </div>
      <div class="footer">
        <p>&copy; Nardo - All Rights Reserved.</p>
        <p><a href="https://yourwebsite.com/privacy">Privacy Policy</a> | <a href="https://yourwebsite.com/contact">Contact Support</a></p>
      </div>
    </body>
  </html>
`;

module.exports = hostWelcomeTemp;
