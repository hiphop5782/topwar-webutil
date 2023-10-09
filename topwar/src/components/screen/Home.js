import BannerImage from "../../assets/images/topwar-helper-banner.png";

function Home() {
    return (
        <div className="row text-center">
            <div className="col">
                <img src={BannerImage} alt="배너" style={{maxWidth:1000, maxHeight:300, width:"100%"}}/>
            </div>
        </div>
    );
}

export default Home;