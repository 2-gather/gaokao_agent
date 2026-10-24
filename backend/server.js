const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================================
// 1. 显示前端页面
// ================================
app.use(express.static(path.join(__dirname, "../frontend")));

// ================================
// 2. AI 志愿规划 API
// ================================
app.post("/api/plan", async (req, res) => {
    try {
        const { score, subject, city, major } = req.body;

        console.log("收到前端请求：", {
            score,
            subject,
            city,
            major
        });

        const response = await fetch(
            process.env.DIFY_API_URL,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.DIFY_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: {
                        score,
                        subject,
                        city,
                        major
                    },
                    response_mode: "blocking",
                    user: "portfolio-demo-user"
                })
            }
        );

        const data = await response.json();

        console.log("Dify 返回：", data);

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error("调用 Dify 失败：", error);

        res.status(500).json({
            error: "AI规划服务调用失败",
            message: error.message
        });
    }
});

// ================================
// 3. 启动服务器
// ================================
const PORT = process.env.PORT || 3000;
const HOST = "localhost";
const SERVER_URL = `http://${HOST}:${PORT}`;

app.listen(PORT, "0.0.0.0", () => {
    console.log("=================================");
    console.log(`AI志愿规划助手已启动，访问地址：${SERVER_URL}`);
    console.log(`本地端口：${PORT}`);
    console.log("=================================");
});