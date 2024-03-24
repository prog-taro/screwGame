const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 'dist'ディレクトリを静的ファイルのルートとして設定
app.use(express.static(path.join(__dirname, 'dist')));

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}/`);
// });

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
});
