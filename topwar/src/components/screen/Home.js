import BannerImage from "@src/assets/images/topwar-helper-banner.jpg";
import "./Home.css";

function Home() {
    return (
        <div className="row text-center">
            <div className="col">
                <img className="main-banner" src={BannerImage} alt="배너"/>
            </div>
        </div>
    );
}

export default Home;