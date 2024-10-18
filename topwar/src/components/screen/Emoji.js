import { useCallback, useEffect, useState } from "react";
import "./Emoji.css";

const Emoji = () => {
    const [images, setImages] = useState(Array.from({ length: 95 }, (_, index) => index + 1));

    const copyToClipboard = useCallback(async (src, backgroundColor = 'white') => {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // CORS 이슈 방지
            img.src = src;

            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                // 배경색 설정 (투명 배경 대신 사용)
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img, 0, 0); // 투명 배경을 유지하며 그리기

                canvas.toBlob(async (blob) => {
                    if (blob) {
                        try {
                            const clipboardItem = new ClipboardItem({ 'image/png': blob });
                            await navigator.clipboard.write([clipboardItem]);
                            //alert('이미지가 클립보드에 복사되었습니다!');
                        } catch (error) {
                            console.error('클립보드에 이미지 복사 실패:', error);
                        }
                    } else {
                        console.error('Blob 생성 실패');
                    }
                }, 'image/png'); // PNG 형식으로 Blob 생성
            };

            img.onerror = (error) => {
                console.error('이미지 로드 실패:', error);
            };
        } catch (error) {
            console.error('이미지를 클립보드에 복사하는 중 오류 발생:', error);
        }
    }, []);

    return (<>
        <div className="row">
            <div className="col">
                <h1>탑워 이모티콘</h1>
                <hr></hr>
                <p>클릭하면 복사되며 원하는 곳에 ctrl+v 하세요!</p>
            </div>
        </div>

        {images.map(imageNo => (
            <img className="topwar-emoji" src={`${process.env.PUBLIC_URL}/images/emoji/${imageNo}.png`}
                width={50} height={50}
                onClick={e => copyToClipboard(e.target.src)} />
        ))}
    </>);
};

export default Emoji;