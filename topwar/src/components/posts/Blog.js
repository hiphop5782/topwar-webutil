import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 🔹 require.context()를 사용해 posts 폴더의 .txt 파일을 모두 불러옴
const markdownFiles = require.context("./markdowns", false, /\.txt$/);

// 🔹 불러온 파일을 리스트로 변환
const markdownList = markdownFiles.keys().map((file) => {
    console.log(file);
    console.log(require.context("./markdowns", false, /\.txt$/)(file))
    return {
        name: file.replace("./", ""), // 파일명만 추출
        content: markdownFiles(file)?.default || markdownFiles(file), // `.default` 속성을 확인 후 fallback 처리
    }
});

export default function Blog() {
    const [selected, setSelected] = useState(markdownList[0]);

    return (<div>
        <h1>📜 Markdown 블로그</h1>
        <ul>
            {markdownList.map((md, index) => (
                <li key={index}>
                    <button onClick={() => setSelected(md)}>{md.name} - {md.content}</button>
                </li>
            ))}
        </ul>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{selected.content}</ReactMarkdown>
    </div>);
};