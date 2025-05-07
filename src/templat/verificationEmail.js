const verificaiton = (username, verificationUrl) => {
  return `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Xác thực tài khoản</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        padding: 20px;
                        background-color: #fff;
                        border: 1px solid #e9ecef;
                    }
                    .button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        font-size: 0.8em;
                        color: #6c757d;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>Xác thực tài khoản của bạn</h2>
                </div>
                <div class="content">
                    <h1>Xin chào ${username}!</h1>
                    <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng xác thực email của bạn bằng cách nhấp vào liên kết bên dưới:</p>
                    <div style="text-align: center;">
                        <a href="${verificationUrl}" class="button">Xác thực tài khoản</a>
                    </div>
                    <p>Hoặc bạn có thể sao chép và dán liên kết này vào trình duyệt:</p>
                    <p>${verificationUrl}</p>
                    <p>Liên kết này sẽ hết hạn sau 3 phút.</p>
                    <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
                </div>
                <div class="footer">
                    <p>&copy; Tất cả các quyền được bảo lưu.</p>
                    <p>Đây là email tự động, vui lòng không trả lời.</p>
                </div>
            </body>
            </html>`;
};

module.exports = verificaiton;
