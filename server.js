const express = require('express');
const cors = require('cors');        // ① cors 추가
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());                    // ② 모든 도메인 허용
app.use(express.static('public'));
app.use(express.json());

// ... 이하 기존 코드 ...


app.get('/search', async (req, res) => {
  const { q } = req.query;

  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {
        filter: {
          or: [
            {
              property: '품목',
              rich_text: {
                contains: q
              }
            },
            {
              property: '원산지',
              rich_text: {
                contains: q
              }
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('검색 오류:', error.message);
    res.status(500).send('검색 중 오류가 발생했습니다');
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
