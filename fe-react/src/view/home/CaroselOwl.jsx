import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import styles from "./carosel.module.css"
function CaroselOwl() {
    // Cấu hình Owl Carousel
    const carouselOptions = {
        loop: true,
        margin: 10,
        responsiveClass: true,
        items: 1,

    };

    return (
        <OwlCarousel className="owl-theme" {...carouselOptions}>
            <div className="item">
                <img className={styles.img} src="https://file.hstatic.net/1000304367/file/cover-web-mt1920x500_1e443d830c5349d8ac2e066e348d67ed.jpg" alt="Image 1" />
            </div>
            <div className="item">
                <img className={styles.img} src="https://file.hstatic.net/1000304367/file/cover-web-mt_413074395d30488084f10400a35fea1d.jpg" alt="Image 2" />
            </div>
            {/* Thêm các item khác nếu cần */}
        </OwlCarousel>
    );
};

export default CaroselOwl;
