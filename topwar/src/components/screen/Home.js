import BannerImage from "@src/assets/images/topwar-helper-banner.jpg";
import "./Home.css";
import BoxImage from "@src/assets/images/box.png";
import BoxOpenImage from "@src/assets/images/box-open.png";
import { useState } from "react";

function Home() {
    const [finish, setFinish] = useState(false);
    const [reward, setReward] = useState([]);
    const [limit] = useState(28);

    const shuffle = function (array) {
        for (let index = array.length - 1; index > 0; index--) {
            // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
            const randomPosition = Math.floor(Math.random() * (index + 1));

            // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
            const temporary = array[index];
            array[index] = array[randomPosition];
            array[randomPosition] = temporary;
        }
    };

    const lucky = function (e) {
        if (finish) return;

        const size = Math.floor(Math.random() * 3) + 1;
        const array = [...Array(limit).keys()].map(n=>n+1);
        shuffle(array);
        setReward(array.slice(0, size));
        setTimeout(() => setFinish(true), 10);
    };

    return (
        <>
            <div className="row text-center">
                <div className="col">
                    {/* <img className="main-banner" src={BannerImage} alt="배너"/> */}
                    {/* <h1>Topwar Helper</h1> */}
                </div>
            </div>

            {/* 리워드 */}
            {/* <div className="row mt-5">
                <div className={`col text-center reward-wrapper`} style={{ height: 100 }}>
                    {reward.map((r,index) => (
                        <img src={`${process.env.PUBLIC_URL}/images/lucky/${r}.png`} className={`reward-item ${finish ? 'finish' : ''}`} width={100} height={100} key={index}/>
                    ))}
                </div>
            </div> */}

            {/* 추첨 상자 */}
            {/* <div className="row">
                <div className="col text-sm-center">
                    <img src={finish ? BoxOpenImage : BoxImage} className={`random-box ${finish ? 'finish' : ''}`} onClick={lucky} />
                </div>
            </div> */}

            {/* iframe 슬롯머신 */}
            <div className="iframe-container">
                <iframe src="https://hiphop5782.github.io/topwar-slot/" allowFullScreen></iframe>
            </div>
        </>
    );
}

export default Home;